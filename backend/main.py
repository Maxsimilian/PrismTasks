import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine
from backend import models
from backend.routers import auth, todos, admin, user

load_dotenv()

app = FastAPI()

# ---- CORS ----

app.add_middleware(
    CORSMiddleware,
    # Local + stable production domain
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://prismtasks-vercel.vercel.app",
    ],
    # All Vercel preview deployments
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- DB ----
models.Base.metadata.create_all(bind=engine)

# ---- Routers ----
app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(admin.router)
app.include_router(user.router)
