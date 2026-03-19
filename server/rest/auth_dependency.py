from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from db.auth_repo import TokenInvalidError, get_username_by_token

bearer_scheme = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    token = credentials.credentials

    try:
        return get_username_by_token(token)
    except TokenInvalidError as e:
        raise HTTPException(status_code=401, detail=str(e))

