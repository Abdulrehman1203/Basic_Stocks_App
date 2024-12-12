from fastapi import APIRouter
from sqlalchemy.orm import Session
from backend.middleware.logs import logger
from backend.models.stock import Stocks
from backend.schemas.stock_schema import StockCreate, StockResponse
from backend.database.db import get_db
from fastapi import HTTPException, Depends
import requests
import time

router = APIRouter()


@router.post("/stocks/", response_model=StockResponse)
def create_stock(stock: StockCreate,
                 db: Session = Depends(get_db)
                 ):
    existing_stock = db.query(Stocks).filter(Stocks.ticker == stock.ticker).first()
    if existing_stock:
        raise HTTPException(status_code=400, detail="Stock with this ticker already exists")

    if stock.stock_price <= 0:
        raise HTTPException(status_code=400, detail="Price must be greater than 0")

    db_stock = Stocks(
        ticker=stock.ticker,
        stock_name=stock.stock_name,
        stock_price=stock.stock_price
    )
    logger.info(f"{stock.stock_name}: is created with ticker: {stock.ticker}")
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock


@router.get("/getstocks/", response_model=list[StockResponse])
def get_all_stocks(db: Session = Depends(get_db)):
    stocks = db.query(Stocks).all()
    logger.info(f"fetching all stocks")

    return stocks


@router.get("/stocks/{ticker}", response_model=StockResponse)
def get_stock(ticker: str, db: Session = Depends(get_db)):
    logger.info(f"Fetching stock data for  {ticker}")
    stock = db.query(Stocks).filter(Stocks.ticker == ticker).first()
    if stock is None:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock


#
# ALPHA_VANTAGE_API_KEY = "6PGQAOEK5WO6HLM6"
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
#
#
# BASE_URL = "https://www.alphavantage.co/query"
#
#
# @router.get("/api/crypto/top20")
# def get_top_cryptocurrencies():
#     try:
#         # List of top cryptocurrencies to fetch (replace/add more as needed)
#         crypto_list = ["BTC", "ETH", "ADA", "BNB", "SOL", "XRP", "DOT", "DOGE", "MATIC", "LTC"]
#         results = []
#
#         for crypto in crypto_list:
#             response = requests.get(
#                 BASE_URL,
#                 params={
#                     "function": "CURRENCY_EXCHANGE_RATE",
#                     "from_currency": crypto,
#                     "to_currency": "USD",
#                     "apikey": ALPHA_VANTAGE_API_KEY,
#                 },
#                 timeout=10,  # Timeout for API request
#             )
#
#             if response.status_code != 200:
#                 logger.error(f"Failed to fetch data for {crypto}: {response.status_code}")
#                 continue  # Skip this cryptocurrency
#
#             data = response.json()
#             exchange_rate = data.get("Realtime Currency Exchange Rate")
#
#             if not exchange_rate:
#                 logger.warning(f"No exchange rate found for {crypto}")
#                 continue  # Skip this cryptocurrency
#
#             # Extract relevant information
#             results.append({
#                 "crypto": crypto,
#                 "price": exchange_rate.get("5. Exchange Rate"),
#                 "last_refreshed": exchange_rate.get("6. Last Refreshed"),
#             })
#
#         if not results:
#             raise HTTPException(status_code=500, detail="No cryptocurrency data available")
#
#         return {"data": results}
#
#     except requests.exceptions.RequestException as e:
#         logger.error(f"Error during API call: {e}")
#         raise HTTPException(status_code=500, detail="Failed to fetch cryptocurrency data")

BASE_URL = "https://api.coingecko.com/api/v3/coins/markets"
CACHE = {}
CACHE_EXPIRY = 3600


def fetch_top_20_crypto_data(vs_currency: str = "usd"):
    # Check cache
    current_time = time.time()
    cache_key = f"top20_{vs_currency}"
    if cache_key in CACHE and current_time - CACHE[cache_key]["timestamp"] < CACHE_EXPIRY:
        return CACHE[cache_key]["data"]

    # Fetch data from CoinGecko API
    try:
        response = requests.get(
            BASE_URL,
            params={
                "vs_currency": vs_currency,
                "order": "market_cap_desc",
                "per_page": 20,
                "page": 1,
                "sparkline": False,
            },
            timeout=10,
        )
        response.raise_for_status()  # Raise an error for non-200 responses
        data = response.json()

        # Cache the response
        CACHE[cache_key] = {
            "data": data,
            "timestamp": current_time,
        }
        return data
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data: {str(e)}")


@router.get("/api/crypto/top20")
def get_top_20_crypto(vs_currency: str = "usd"):
    """
    Endpoint to fetch the top 20 cryptocurrencies by market cap.
    Args:
        vs_currency (str): Target currency (default is 'usd').

    Returns:
        JSON response with the top 20 cryptocurrencies and their prices.
    """
    data = fetch_top_20_crypto_data(vs_currency)
    if not data:
        raise HTTPException(status_code=404, detail="No cryptocurrency data available")
    return {"top_20_cryptocurrencies": data}
