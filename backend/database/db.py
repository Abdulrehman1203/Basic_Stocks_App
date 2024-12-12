from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from backend.config.config import settings
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = settings.SQLALCHEMY_DATABASE_URL


engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
print(f"Connecting to database at: {SQLALCHEMY_DATABASE_URL}")


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def create_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
