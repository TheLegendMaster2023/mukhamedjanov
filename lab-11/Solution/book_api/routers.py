from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from datetime import date, timedelta
from collections import Counter

from models import BookCreate, BookResponse, BookUpdate, BorrowRequest, BookDetailResponse, Genre
from database import db_books, db_borrows, generate_new_id, map_to_response

router = APIRouter()

@router.get("/books", response_model=List[BookResponse])
async def list_books(
    genre: Optional[Genre] = Query(None, description="Фильтрация по жанру"),
    author: Optional[str] = Query(None, description="Фильтрация по автору (поиск подстроки)"),
    available_only: bool = Query(False, description="Показывать только доступные книги"),
    skip: int = Query(0, ge=0, description="Смещение для пагинации"),
    limit: int = Query(100, ge=1, le=1000, description="Максимальное количество элементов")
):
    """
    Получение списка всех книг с поддержкой фильтрации и пагинации.
    """
    results = []
    
    for b_id, b_data in db_books.items():
        # Применяем фильтры
        if genre and b_data["genre"] != genre:
            continue
        if author and author.lower() not in b_data["author"].lower():
            continue
        if available_only and not b_data.get("available", True):
            continue
            
        results.append(map_to_response(b_id, b_data))
        
    # Возвращаем срез списка (пагинация)
    return results[skip : skip + limit]

@router.get("/books/{book_id}", response_model=BookDetailResponse)
async def fetch_book_by_id(book_id: int):
    """
    Получение подробной информации о книге.
    Включает данные о заимствовании, если книга выдана читателю.
    """
    if book_id not in db_books:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена")
        
    b_data = db_books[book_id]
    response = BookDetailResponse(
        id=book_id,
        title=b_data["title"],
        author=b_data["author"],
        genre=b_data["genre"],
        publication_year=b_data["publication_year"],
        pages=b_data["pages"],
        isbn=b_data["isbn"],
        available=b_data.get("available", True)
    )
    
    # Дополняем информацию, если книга в данный момент арендована
    if not response.available and book_id in db_borrows:
        borrow_info = db_borrows[book_id]
        response.borrowed_by = borrow_info["borrower_name"]
        response.borrowed_date = borrow_info["borrowed_date"]
        response.return_date = borrow_info["return_date"]
        
    return response

@router.post("/books", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
async def add_new_book(book: BookCreate):
    """
    Добавление новой книги в базу. Проверяет уникальность ISBN.
    """
    # Проверка уникальности ISBN
    for existing_book in db_books.values():
        if existing_book["isbn"] == book.isbn:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, 
                detail="Книга с таким ISBN уже есть в библиотеке"
            )
            
    new_id = generate_new_id()
    db_books[new_id] = {
        "title": book.title,
        "author": book.author,
        "genre": book.genre,
        "publication_year": book.publication_year,
        "pages": book.pages,
        "isbn": book.isbn,
        "available": True
    }
    
    return map_to_response(new_id, db_books[new_id])

@router.put("/books/{book_id}", response_model=BookResponse)
async def modify_book(book_id: int, book_update: BookUpdate):
    """
    Изменение данных о книге по её ID. Обновляются только переданные поля.
    """
    if book_id not in db_books:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена")
        
    current_book = db_books[book_id]
    update_data = book_update.model_dump(exclude_unset=True)
    
    # Если пытаемся обновить ISBN, убедимся что он не занят другой книгой
    if "isbn" in update_data and update_data["isbn"] != current_book["isbn"]:
        for other_id, other_book in db_books.items():
            if other_id != book_id and other_book["isbn"] == update_data["isbn"]:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="ISBN уже используется другой книгой"
                )
                
    current_book.update(update_data)
    db_books[book_id] = current_book
    
    return map_to_response(book_id, db_books[book_id])

@router.delete("/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_book(book_id: int):
    """
    Удаление книги. Запрещено удалять книги, которые выданы на руки.
    """
    if book_id not in db_books:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена")
        
    if not db_books[book_id].get("available", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Нельзя удалить книгу, пока она находится у читателя"
        )
        
    del db_books[book_id]
    db_borrows.pop(book_id, None)
    return None

@router.post("/books/{book_id}/borrow", response_model=BookDetailResponse)
async def take_book(book_id: int, req: BorrowRequest):
    """
    Эндпоинт для оформления аренды книги.
    """
    if book_id not in db_books:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена")
        
    if not db_books[book_id].get("available", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="В данный момент книга выдана другому читателю"
        )
        
    db_books[book_id]["available"] = False
    
    current_date = date.today()
    expected_return_date = current_date + timedelta(days=req.return_days)
    
    db_borrows[book_id] = {
        "borrower_name": req.borrower_name,
        "borrowed_date": current_date,
        "return_date": expected_return_date
    }
    
    return await fetch_book_by_id(book_id)

@router.post("/books/{book_id}/return", response_model=BookResponse)
async def return_book_to_library(book_id: int):
    """
    Эндпоинт для возврата книги в библиотеку.
    """
    if book_id not in db_books:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена")
        
    if db_books[book_id].get("available", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Книга уже числится в библиотеке"
        )
        
    db_books[book_id]["available"] = True
    db_borrows.pop(book_id, None)
    
    return map_to_response(book_id, db_books[book_id])

@router.get("/stats")
async def get_library_statistics():
    """
    Получение общей статистики по всем книгам в библиотеке.
    """
    total = len(db_books)
    available_cnt = sum(1 for book in db_books.values() if book.get("available", True))
    borrowed_cnt = total - available_cnt
    
    genres_stats = Counter(book["genre"] for book in db_books.values())
    
    authors_stats = Counter(book["author"] for book in db_books.values())
    top_author = authors_stats.most_common(1)[0][0] if authors_stats else None
    
    return {
        "total_books": total,
        "available_books": available_cnt,
        "borrowed_books": borrowed_cnt,
        "books_by_genre": dict(genres_stats),
        "most_prolific_author": top_author
    }
