

class Settings:
    # change localhost to db for running pn docker
    SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://postgres:5571@localhost:5432/new_db"


settings = Settings()
