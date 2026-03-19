from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from rest.auth_routes import router as auth_router
from rest.tasks_routes import router as tasks_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tasks_router)
