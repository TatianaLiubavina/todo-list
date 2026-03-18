# Todo List API

Простой сервер для управления задачами.

## Структура

- `server/main.py` — FastAPI-сервер с CRUD для задач
- `server/tasks.json` — JSON-файл с данными (вместо базы данных)
- `server/requirements.txt` — зависимости

## Запуск

```bash
python3 -m venv venv
cd server
pip install -r requirements.txt
uvicorn main:app --reload
```

После запуска:
- API: http://127.0.0.1:8000
- Документация (Swagger): http://127.0.0.1:8000/docs

## Эндпоинты

| Метод  | URL             | Описание            |
| ------ | --------------- | -------------------- |
| GET    | `/tasks`        | Все задачи           |
| GET    | `/tasks/{id}`   | Одна задача по id    |
| POST   | `/tasks`        | Создать задачу       |
| PUT    | `/tasks/{id}`   | Обновить задачу      |
| DELETE | `/tasks/{id}`   | Удалить задачу       |

## Модель задачи

```json
{
  "id": 1,
  "title": "Сделать домашку",
  "description": "Сверстать страницу профиля",
  "status": "todo",
  "priority": "high",
  "deadline": "2026-03-15",
  "created_at": "2026-03-12T14:00:00"
}
```

| Поле         | Тип      | Значения                           |
| ------------ | -------- | ---------------------------------- |
| `id`         | number   | генерируется сервером              |
| `title`      | string   |                                    |
| `description`| string   |                                    |
| `status`     | string   | `"todo"`, `"in_progress"`, `"done"`|
| `priority`   | string   | `"low"`, `"medium"`, `"high"`      |
| `deadline`   | string   | дата в формате `YYYY-MM-DD`        |
| `created_at` | string   | генерируется сервером              |

## Примеры запросов

### Создать задачу

```bash
curl -X POST http://127.0.0.1:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Выучить FastAPI",
    "description": "Прочитать документацию",
    "priority": "high",
    "deadline": "2026-03-20"
  }'
```

### Обновить задачу

```bash
curl -X PUT http://127.0.0.1:8000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Сделать домашку",
    "description": "Сверстать страницу профиля",
    "status": "done",
    "priority": "high",
    "deadline": "2026-03-15"
  }'
```

### Удалить задачу

```bash
curl -X DELETE http://127.0.0.1:8000/tasks/1
```
