from backend.middleware.logs import logger
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from backend.models.users import Users
from backend.schemas.user_schema import UserCreate, UserResponse
from backend.database.db import get_db

router = APIRouter()


@router.get("/")
def index():
    return {"message": "<<<<< Welcome to the stock app >>>>>"}


@router.post("/register")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    logger.info(f"User registration attempt for: {user.username}")

    existing_user = db.query(Users).filter_by(username=user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    if user.balance <= 0:
        raise HTTPException(status_code=400, detail="Balance must be greater than zero")

    # Directly store the password without hashing
    new_user = Users(
        username=user.username,
        hashed_password=user.password,
        balance=user.balance
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {
            f"message: User created successfully, user_id: {new_user.id}, username: {new_user.username}, balance: {new_user.balance}"
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="An error occurred while creating the user")


@router.post("/login")
async def login_user(username: str, password: str, db: Session = Depends(get_db)):
    db_user = db.query(Users).filter_by(username=username).first()
    if not db_user or db_user.hashed_password != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful"}


@router.get("/users/{username}", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_user(username: str, db: Session = Depends(get_db)):
    """
    Retrieves user details by username.
    """
    logger.info(f"Fetched User data for: {username}")

    user = db.query(Users).filter(Users.username == username).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(id=user.id, username=user.username, balance=user.balance)
