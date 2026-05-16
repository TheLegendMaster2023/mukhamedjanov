# Отчет по лабораторной работе №11
# Часть 1 и 2: API на FastAPI (Python) и API на Express (Node.js)

**Студент:** Мухамеджанов Эльёр Тимурович  
**Группа:** ПИН-б-о-24-1  

---

## Цель работы

**Часть 1:** Практическое знакомство с созданием RESTful API на современном Python-фреймворке FastAPI. Освоение принципов валидации данных с помощью Pydantic, автоматической документации (Swagger UI / ReDoc) и асинхронной обработки HTTP-запросов. Разработка API для управления каталогом книг в библиотеке с реализацией CRUD-операций, заимствования/возврата книг и сбора статистики.

**Часть 2:** Практическое знакомство с созданием RESTful API на Node.js с использованием Express. Освоение middleware, валидации данных через Joi, работы с файловой системой для хранения данных и сравнение подходов разных фреймворков. Разработка API для управления задачами (Task Manager) с фильтрацией, сортировкой, пагинацией и полнотекстовым поиском.

---

## Практическая часть

### Часть 1: API библиотеки книг (book_api)

#### Структура проекта

```
book_api/
├── main.py          # Основное FastAPI-приложение
├── models.py        # Pydantic-модели и валидация
├── database.py      # Имитация БД в памяти
├── routers.py       # Бизнес-логика и эндпоинты
└── requirements.txt # Зависимости
```

#### Выполненные задачи
1. Настроен проект и подключен роутер.
2. Реализованы методы работы со списком книг (фильтрация, пагинация) и конкретной книгой.
3. Реализованы создание, обновление, удаление (CRUD). Добавлены проверки на уникальность ISBN и возможность удаления только доступных книг.
4. Добавлены эндпоинты для аренды и возврата книг с проверками статусов.
5. Написан эндпоинт для подсчета статистики по книгам.






---

### Часть 2: Task Manager API (task-api)

#### Структура проекта

```
task-api/
├── src/
│   ├── app.js                   # Express-приложение и подключение middleware
│   ├── server.js                # Запуск сервера
│   ├── routes/
│   │   └── tasks.js             # Эндпоинты задач
│   ├── middleware/
│   │   ├── validation.js        # Валидация с Joi
│   │   └── errorHandler.js      # Централизованная обработка ошибок
│   └── utils/
│       └── fileOperations.js    # Операции чтения и записи в tasks.json
├── package.json
└── .gitignore
```

#### Выполненные задачи
1. Настроена структура проекта, установлены Joi, uuid и другие пакеты.
2. Внедрена фильтрация, сортировка и текстовый поиск по задачам.
3. Добавлена статистика: общая, по приоритетам, по категориям и просроченным дедлайнам.
4. Реализован полный цикл CRUD операций с валидацией входных данных.
5. Настроены глобальные обработчики ошибок.






---

## Ответы на контрольные вопросы

### Часть 1 (FastAPI)

#### 1. В чём преимущества использования Pydantic моделей для валидации?
**Ответ:** Pydantic позволяет декларативно (через аннотации типов Python) описывать структуру данных и их ограничения. Это обеспечивает автоматическую валидацию на этапе обработки запроса. Также Pydantic отлично интегрируется с FastAPI для генерации OpenAPI документации.

#### 2. Как работает автоматическая документация в FastAPI?
**Ответ:** FastAPI сканирует маршруты, параметры запросов и модели ответов в коде, генерируя стандартный файл спецификации OpenAPI (JSON). Swagger UI и ReDoc используют этот файл для отрисовки интерактивных интерфейсов тестирования API по путям `/docs` и `/redoc`.

#### 3. Почему важно проверять уникальность ISBN?
**Ответ:** ISBN (Международный стандартный книжный номер) уникален для каждого издания книги в мире. Если в системе будут дублироваться ISBN, возникнет конфликт данных, не позволяющий однозначно идентифицировать, какую именно книгу пытаются взять или вернуть. 

#### 4. Какие HTTP статус-коды вы использовали и почему?
**Ответ:** 
- `200 OK`: Успешные запросы (получение списка, книги).
- `201 Created`: Успешное создание ресурса (новая книга).
- `204 No Content`: Успешное удаление без тела ответа.
- `400 Bad Request`: Ошибка бизнес-логики (например, книга уже занята).
- `404 Not Found`: Книга с указанным ID не существует.
- `409 Conflict`: Нарушение уникальности (занятый ISBN).

### Часть 2 (Express / Node.js)

#### 5. Какие middleware вы использовали и для чего?
**Ответ:** 
- `cors` для кросс-доменных запросов.
- `helmet` для базовой защиты через HTTP заголовки.
- `express-rate-limit` для предотвращения DDoS (лимит запросов).
- Кастомные: `validateCreateTask`, `validateUpdateTask`, `validateId` для валидации данных перед выполнением логики роутера.
- Глобальные: `errorHandler` для перехвата и форматирования всех ошибок в приложении.

#### 6. Как работает валидация с Joi в сравнении с Pydantic из части 1?
**Ответ:** Joi описывает схемы через цепочки вызовов методов (например, `Joi.string().min(3).required()`) и выполняет валидацию в рантайме. Pydantic же использует аннотации типов Python и классы, что дает более сильную интеграцию с IDE и типизацией кода. Joi нужно явно вызывать через middleware, тогда как Pydantic глубоко интегрирован в параметры обработчиков FastAPI.

#### 7. В чём преимущества файлового хранения данных для этого задания?
**Ответ:** Файловое хранение легко реализовать и оно не требует настройки сторонних сервисов баз данных. Данные в `tasks.json` персистентны между запусками сервера, и их можно легко просмотреть или отредактировать в текстовом редакторе. Это идеально подходит для учебных проектов.

#### 8. Как бы вы улучшили это API для production использования?
**Ответ:** Внедрить полноценную СУБД (PostgreSQL/MongoDB) вместо `fs`. Добавить аутентификацию (например, JWT). Развернуть логирование (Winston). Добавить юнит-тесты с помощью Jest. Упаковать в Docker.

---

## Приложения (Ключевые файлы исходного кода)

### Исходный код routers.py (book_api)
```python
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
    results = []
    for b_id, b_data in db_books.items():
        if genre and b_data["genre"] != genre: continue
        if author and author.lower() not in b_data["author"].lower(): continue
        if available_only and not b_data.get("available", True): continue
        results.append(map_to_response(b_id, b_data))
    return results[skip : skip + limit]

@router.get("/books/{book_id}", response_model=BookDetailResponse)
async def fetch_book_by_id(book_id: int):
    if book_id not in db_books:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена")
    b_data = db_books[book_id]
    response = BookDetailResponse(
        id=book_id, title=b_data["title"], author=b_data["author"],
        genre=b_data["genre"], publication_year=b_data["publication_year"],
        pages=b_data["pages"], isbn=b_data["isbn"], available=b_data.get("available", True)
    )
    if not response.available and book_id in db_borrows:
        borrow_info = db_borrows[book_id]
        response.borrowed_by = borrow_info["borrower_name"]
        response.borrowed_date = borrow_info["borrowed_date"]
        response.return_date = borrow_info["return_date"]
    return response

@router.post("/books", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
async def add_new_book(book: BookCreate):
    for existing_book in db_books.values():
        if existing_book["isbn"] == book.isbn:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Книга с таким ISBN уже есть в библиотеке")
    new_id = generate_new_id()
    db_books[new_id] = {
        "title": book.title, "author": book.author, "genre": book.genre,
        "publication_year": book.publication_year, "pages": book.pages,
        "isbn": book.isbn, "available": True
    }
    return map_to_response(new_id, db_books[new_id])

@router.put("/books/{book_id}", response_model=BookResponse)
async def modify_book(book_id: int, book_update: BookUpdate):
    if book_id not in db_books:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена")
    current_book = db_books[book_id]
    update_data = book_update.model_dump(exclude_unset=True)
    if "isbn" in update_data and update_data["isbn"] != current_book["isbn"]:
        for other_id, other_book in db_books.items():
            if other_id != book_id and other_book["isbn"] == update_data["isbn"]:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="ISBN уже используется другой книгой")
    current_book.update(update_data)
    db_books[book_id] = current_book
    return map_to_response(book_id, db_books[book_id])

@router.delete("/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_book(book_id: int):
    if book_id not in db_books:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена")
    if not db_books[book_id].get("available", True):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Нельзя удалить книгу, пока она находится у читателя")
    del db_books[book_id]
    db_borrows.pop(book_id, None)
    return None

@router.post("/books/{book_id}/borrow", response_model=BookDetailResponse)
async def take_book(book_id: int, req: BorrowRequest):
    if book_id not in db_books:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена")
    if not db_books[book_id].get("available", True):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="В данный момент книга выдана другому читателю")
    db_books[book_id]["available"] = False
    current_date = date.today()
    expected_return_date = current_date + timedelta(days=req.return_days)
    db_borrows[book_id] = {
        "borrower_name": req.borrower_name, "borrowed_date": current_date, "return_date": expected_return_date
    }
    return await fetch_book_by_id(book_id)

@router.post("/books/{book_id}/return", response_model=BookResponse)
async def return_book_to_library(book_id: int):
    if book_id not in db_books:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Книга не найдена")
    if db_books[book_id].get("available", True):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Книга уже числится в библиотеке")
    db_books[book_id]["available"] = True
    db_borrows.pop(book_id, None)
    return map_to_response(book_id, db_books[book_id])

@router.get("/stats")
async def get_library_statistics():
    total = len(db_books)
    available_cnt = sum(1 for book in db_books.values() if book.get("available", True))
    genres_stats = Counter(book["genre"] for book in db_books.values())
    authors_stats = Counter(book["author"] for book in db_books.values())
    top_author = authors_stats.most_common(1)[0][0] if authors_stats else None
    return {
        "total_books": total, "available_books": available_cnt,
        "borrowed_books": total - available_cnt, "books_by_genre": dict(genres_stats),
        "most_prolific_author": top_author
    }
```

### Исходный код tasks.js (task-api)
```javascript
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { validateCreateTask, validateUpdateTask, validateId } = require('../middleware/validation');
const { initializeDataFile, readData, writeData, getNextId } = require('../utils/fileOperations');

initializeDataFile();

router.get('/', async (req, res, next) => {
  try {
    const { category, completed, priority, sortBy, page, limit, q } = req.query;
    const data = await readData();
    let tasks = [...data.tasks];
    
    if (category) tasks = tasks.filter(t => t.category === category);
    if (completed !== undefined) tasks = tasks.filter(t => t.completed === (completed === 'true'));
    if (priority) tasks = tasks.filter(t => t.priority === parseInt(priority, 10));
    if (q && q.trim().length >= 2) {
      const searchTerm = q.toLowerCase().trim();
      tasks = tasks.filter(t => t.title.toLowerCase().includes(searchTerm) || t.description.toLowerCase().includes(searchTerm));
    }
    
    if (sortBy) {
      const isDesc = sortBy.startsWith('-');
      const field = isDesc ? sortBy.slice(1) : sortBy;
      tasks.sort((a, b) => {
        let valA = a[field], valB = b[field];
        if (field === 'dueDate' || field === 'createdAt') {
          valA = valA ? new Date(valA).getTime() : 0;
          valB = valB ? new Date(valB).getTime() : 0;
        }
        if (valA < valB) return isDesc ? 1 : -1;
        if (valA > valB) return isDesc ? -1 : 1;
        return 0;
      });
    }
    
    let result = tasks;
    if (page && limit) {
      const pageNum = parseInt(page, 10), limitNum = parseInt(limit, 10);
      result = tasks.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    }
    
    res.json({ success: true, count: result.length, total: tasks.length, data: result });
  } catch (error) { next(error); }
});

router.get('/search/text', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.status(400).json({ success: false, error: 'Минимум 2 символа для поиска' });
    const data = await readData();
    const searchTerm = q.toLowerCase().trim();
    const results = data.tasks.filter(t => t.title.toLowerCase().includes(searchTerm) || (t.description && t.description.toLowerCase().includes(searchTerm)));
    res.json({ success: true, count: results.length, data: results });
  } catch (error) { next(error); }
});

router.get('/stats/summary', async (req, res, next) => {
  try {
    const data = await readData();
    const tasks = data.tasks;
    const stats = { total: tasks.length, completed: 0, pending: 0, overdue: 0, byCategory: {}, byPriority: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    const now = new Date();
    
    tasks.forEach(t => {
      if (t.completed) stats.completed++;
      else {
        stats.pending++;
        if (t.dueDate && new Date(t.dueDate) < now) stats.overdue++;
      }
      stats.byCategory[t.category] = (stats.byCategory[t.category] || 0) + 1;
      if (t.priority >= 1 && t.priority <= 5) stats.byPriority[t.priority]++;
    });
    
    res.json({ success: true, data: stats });
  } catch (error) { next(error); }
});

router.get('/:id', validateId, async (req, res, next) => {
  try {
    const data = await readData();
    const task = data.tasks.find(t => t.id === req.params.id);
    if (!task) { const err = new Error('Задача не найдена'); err.status = 404; throw err; }
    res.json({ success: true, data: task });
  } catch (error) { next(error); }
});

router.post('/', validateCreateTask, async (req, res, next) => {
  try {
    const { title, description, category, priority, dueDate } = req.body;
    const data = await readData();
    const newTask = {
      id: await getNextId(), uuid: uuidv4(), title, description: description || '',
      category: category || 'personal', priority: priority || 3, dueDate: dueDate || null,
      completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    data.tasks.push(newTask);
    await writeData(data);
    res.status(201).json({ success: true, message: 'Задача успешно создана', data: newTask });
  } catch (error) { next(error); }
});

router.put('/:id', validateId, validateUpdateTask, async (req, res, next) => {
  try {
    const updates = req.body;
    const data = await readData();
    const index = data.tasks.findIndex(t => t.id === req.params.id);
    if (index === -1) { const err = new Error('Задача не найдена'); err.status = 404; throw err; }
    const updatedTask = { ...data.tasks[index], ...updates, updatedAt: new Date().toISOString() };
    data.tasks[index] = updatedTask;
    await writeData(data);
    res.json({ success: true, message: 'Задача успешно обновлена', data: updatedTask });
  } catch (error) { next(error); }
});

router.patch('/:id/complete', validateId, async (req, res, next) => {
  try {
    const data = await readData();
    const index = data.tasks.findIndex(t => t.id === req.params.id);
    if (index === -1) { const err = new Error('Задача не найдена'); err.status = 404; throw err; }
    data.tasks[index].completed = true;
    data.tasks[index].updatedAt = new Date().toISOString();
    await writeData(data);
    res.json({ success: true, message: 'Задача отмечена как выполненная', data: data.tasks[index] });
  } catch (error) { next(error); }
});

router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const data = await readData();
    const index = data.tasks.findIndex(t => t.id === req.params.id);
    if (index === -1) { const err = new Error('Задача не найдена'); err.status = 404; throw err; }
    data.tasks.splice(index, 1);
    await writeData(data);
    res.json({ success: true, message: 'Задача успешно удалена' });
  } catch (error) { next(error); }
});

module.exports = router;
```
