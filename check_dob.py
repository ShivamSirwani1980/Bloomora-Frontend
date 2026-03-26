
import pymongo
from datetime import datetime, timezone

MONGO_URL = "mongodb+srv://harshdpatil2007:harsh123ava@bloomora.m6samgs.mongodb.net/Bloomora?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true&authSource=admin"

client = pymongo.MongoClient(MONGO_URL)
db = client['Bloomora']

users = list(db.users.find({}, {"email": 1, "dob": 1}))
print(f"TOTAL USERS: {len(users)}")
for u in users[:20]:
    print(f"User: {u.get('email')}, DOB: {u.get('dob')}")

today_mm_dd = datetime.now(timezone.utc).strftime("-%m-%d")
print(f"TODAY MM-DD (UTC): {today_mm_dd}")
