# Todo List API

Простой сервер для управления задачами.

## Структура

- `server/main.py` — точка входа FastAPI + включение роутеров
- `server/rest/*` — REST-эндпоинты (auth, tasks)
- `server/domain/*` — модели (Pydantic) для входных данных/ответов
- `server/db/*` — репозитории для работы с "БД" (JSON-файлы)
- `server/tasks.json` — задачи (вместо базы данных)
- `server/users.json` — пользователи (логин/пароль-хэш)
- `server/tokens.json` — токены (Bearer)
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
| POST   | `/auth/register`| Регистрация          |
| POST   | `/auth/login`   | Логин (возвращает токен) |
| GET    | `/auth/me`      | Текущий пользователь |
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

### Регистрация

```bash
curl -X POST http://127.0.0.1:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user_1",
    "password": "1234"
  }'
```

### Логин (получить токен)

```bash
curl -s -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user_1",
    "password": "1234"
  }'
```

Скопируй `access_token` из ответа и используй его в запросах к `/tasks`.

### Создать задачу

```bash
curl -X POST http://127.0.0.1:8000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
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
  -H "Authorization: Bearer <access_token>" \
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
curl -X DELETE http://127.0.0.1:8000/tasks/1 \
  -H "Authorization: Bearer <access_token>"
```
