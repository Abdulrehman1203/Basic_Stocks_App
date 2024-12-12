from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.middleware.logs import logger
from backend.models.transaction import Transaction
from backend.models.stock import Stocks
from backend.models.users import Users
from backend.schemas.transaction_schema import Transaction_create, TransactionResponse

router = APIRouter()


@router.post("/transactions", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
        transaction: Transaction_create,
        db: Session = Depends(get_db)
):
    """
    Creates a new transaction (buy/sell stocks), checks balance, updates accordingly.
    """
    if transaction.transaction_volume <= 0:
        raise HTTPException(status_code=404, detail="Volume must be greater than 0")

    if transaction.transaction_type not in ["BUY", "SELL", "sell", "buy"]:
        raise HTTPException(status_code=404, detail="Transaction type must be BUY or SELL")

    stock = db.query(Stocks).filter(Stocks.ticker == transaction.ticker).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")

    # Query user by username
    user = db.query(Users).filter(Users.username == transaction.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    transaction_price = stock.stock_price * transaction.transaction_volume

    if transaction.transaction_type.lower() == 'buy':
        if user.balance < transaction_price:
            raise HTTPException(status_code=400, detail="Insufficient balance")
        user.balance -= transaction_price
    elif transaction.transaction_type.lower() == 'sell':
        user.balance += transaction_price

    logger.info(f"{transaction.transaction_type} Transaction is created for: {user.username}")

    new_transaction = Transaction(
        user_id=user.id,
        ticker_id=stock.id,
        transaction_price=transaction_price,
        transaction_volume=transaction.transaction_volume,
        transaction_type=transaction.transaction_type
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    response = TransactionResponse(
        id=new_transaction.id,
        transaction_volume=new_transaction.transaction_volume,
        transaction_type=new_transaction.transaction_type,
        transaction_price=new_transaction.transaction_price,
        created_time=new_transaction.created_time,
        username=user.username,
        ticker=stock.ticker
    )

    return response


@router.get("/transactions/{username}", response_model=list[TransactionResponse],
            status_code=status.HTTP_200_OK)
async def get_transactions_by_username(username: str, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.username == username).first()
    logger.info(f"Fetching transactions data for user: {username}")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    transactions = db.query(Transaction).filter(Transaction.user_id == user.id).all()

    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found for this user")

    response = [
        TransactionResponse(
            id=transaction.id,
            transaction_volume=transaction.transaction_volume,
            transaction_type=transaction.transaction_type,
            transaction_price=transaction.transaction_price,
            created_time=transaction.created_time,
            username=user.username,
            ticker=transaction.ticker.ticker
        )
        for transaction in transactions
    ]

    return response


#
# @router.get("/transactions/{username}/{start_time}/{end_time}/", response_model=list[TransactionResponse])
# async def get_transactions_by_time(
#         username: str,
#         start_time: str,
#         end_time: str,
#         db: Session = Depends(get_db)):
#
#     user = db.query(Users).filter(Users.username == username).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#
#     try:
#         start_date = datetime.strptime(start_time, "%Y-%m-%d")
#         end_date = datetime.strptime(end_time, "%Y-%m-%d")
#     except ValueError:
#         raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
#
#     transactions = db.query(
#         Transaction,
#         Users.username,
#         Stocks.ticker
#     ).join(Users, Users.id == Transaction.user_id).join(Stocks, Stocks.id == Transaction.ticker_id).filter(
#         Transaction.user_id == user.id,
#         Transaction.created_time.between(start_date, end_date)
#     ).all()
#
#     if not transactions:
#         return JSONResponse(content={"message": "No transactions found"}, status_code=200)
#
#     response = [
#         {
#             "id": transaction.id,
#             "user_id": transaction.user_id,
#             "amount": transaction.amount,
#             "created_time": transaction.created_time,
#             "username": username,
#             "ticker": ticker
#         }
#         for transaction, username, ticker in transactions
#     ]
#     return response
