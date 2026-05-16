from typing import Dict
from models import BookResponse

# Имитация хранилища данных в памяти
# Используем словари для хранения книг и информации о заимствованиях
db_books: Dict[int, dict] = {}
db_borrows: Dict[int, dict] = {}
_id_counter = 1

def generate_new_id() -> int:
    """Генерация уникального идентификатора для новой книги"""
    global _id_counter
    new_id = _id_counter
    _id_counter += 1
    return new_id

def map_to_response(book_id: int, data: dict) -> BookResponse:
    """Преобразование сырых данных в формат ответа"""
    return BookResponse(
        id=book_id,
        title=data["title"],
        author=data["author"],
        genre=data["genre"],
        publication_year=data["publication_year"],
        pages=data["pages"],
        isbn=data["isbn"],
        available=data.get("available", True)
    )
