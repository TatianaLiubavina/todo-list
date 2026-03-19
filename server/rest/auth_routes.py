from fastapi import APIRouter, Depends, HTTPException

from db.auth_repo import (
    InvalidCredentialsError,
    UserAlreadyExistsError,
    UsernameInvalidError,
    create_token,
    register_user,
    verify_user,
)
from domain.auth_models import AuthTokenResponse, LoginRequest, RegisterRequest
from rest.auth_dependency import get_current_user


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
def register(req: RegisterRequest):
    try:
        register_user(req.username, req.password)
    except (UsernameInvalidError, UserAlreadyExistsError) as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Пользователь создан"}


@router.post("/login", response_model=AuthTokenResponse)
def login(req: LoginRequest):
    try:
        username = verify_user(req.username, req.password)
    except InvalidCredentialsError as e:
        raise HTTPException(status_code=401, detail=str(e))

    token = create_token(username)
    return {"access_token": token, "token_type": "bearer", "username": username}


@router.get("/me")
def me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}

