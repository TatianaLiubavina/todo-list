import hashlib
import json
import re
import secrets
from datetime import datetime
from pathlib import Path


USERS_FILE = Path(__file__).resolve().parent.parent / "users.json"
TOKENS_FILE = Path(__file__).resolve().parent.parent / "tokens.json"


class AuthError(Exception):
    pass


class UsernameInvalidError(AuthError):
    pass


class UserAlreadyExistsError(AuthError):
    pass


class InvalidCredentialsError(AuthError):
    pass


class TokenInvalidError(AuthError):
    pass


def load_json_file(path: Path, default):
    if not path.exists():
        return default
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json_file(path: Path, data) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def hash_password(password: str, salt: str) -> str:
    # Примитивно для учебного проекта: sha256(salt + password)
    return hashlib.sha256(f"{salt}{password}".encode("utf-8")).hexdigest()


def sanitize_username(username: str) -> str:
    username = username.strip()
    if not re.fullmatch(r"[A-Za-z0-9_]{3,32}", username):
        raise UsernameInvalidError(
            "Имя пользователя должно содержать 3-32 символа: латиница, цифры, подчеркивание"
        )
    return username


def get_users() -> dict:
    return load_json_file(USERS_FILE, default={})


def save_users(users: dict) -> None:
    save_json_file(USERS_FILE, users)


def get_tokens() -> dict:
    # Храним как {token: {"username": ..., "created_at": ...}}
    return load_json_file(TOKENS_FILE, default={})


def save_tokens(tokens: dict) -> None:
    save_json_file(TOKENS_FILE, tokens)


def register_user(username: str, password: str) -> str:
    username = sanitize_username(username)
    if len(password) < 4:
        raise UsernameInvalidError("Пароль должен быть минимум 4 символа")

    users = get_users()
    if username in users:
        raise UserAlreadyExistsError("Пользователь уже существует")

    salt = secrets.token_hex(16)
    users[username] = {"salt": salt, "password_hash": hash_password(password, salt)}
    save_users(users)
    return username


def verify_user(username: str, password: str) -> str:
    username = sanitize_username(username)
    users = get_users()
    if username not in users:
        raise InvalidCredentialsError("Неверный логин или пароль")

    salt = users[username]["salt"]
    expected_hash = users[username]["password_hash"]
    provided_hash = hash_password(password, salt)

    if provided_hash != expected_hash:
        raise InvalidCredentialsError("Неверный логин или пароль")

    return username


def create_token(username: str) -> str:
    tokens = get_tokens()
    token = secrets.token_urlsafe(32)
    tokens[token] = {
        "username": username,
        "created_at": datetime.now().isoformat(timespec="seconds"),
    }
    save_tokens(tokens)
    return token


def get_username_by_token(token: str) -> str:
    tokens = get_tokens()
    if token not in tokens:
        raise TokenInvalidError("Токен не найден или истёк")
    return tokens[token]["username"]

