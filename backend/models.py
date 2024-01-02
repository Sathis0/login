from mongoengine import Document, StringField, EmailField, DateTimeField, connect
from datetime import datetime

# Connect to MongoDB
connect(host="mongodb+srv://2034043aiml:1234@cluster0.xcada4c.mongodb.net/?retryWrites=true&w=majority")

# Define the UserDetails document
class UserDetails(Document):
    email = EmailField(required=True, unique=True)
    username = StringField(required=True)
    password = StringField(required=True)
    created_at = DateTimeField(default=datetime.now)

    meta = {"collection": "userDetails"}

# User data for 10 users
user_data = [
    {"username": "Sathish K", "email": "sathishofficial75@gmail.com", "password": "1234"},
    {"username": "Madhava Raj M", "email": "madhavasuresh1515@gmail.com", "password": "1234"},
    {"username": "Dhyaneshwaran K", "email": "dhanukd021202@gmail.com", "password": "1234"},
    {"username": "Mukish S", "email": "mukishselvam123@gmail.com", "password": "1234"},
    {"username": "Bharath Raj R ", "email": "rbharath2310@gmail.com", "password": "1234"},
    {"username": "Selvabharathi S", "email": "selvabharathi779@gmail.com", "password": "1234"},
    {"username": "Kedareeshwar  sekar", "email": "kedareshwar72381@gmail.com", "password": "1234"},
    {"username": "Havishyanand T ", "email": "havishcore@gmail.com", "password": "1234"},
    {"username": "Jayasuriya J", "email": "jayasuriyaj0405@gmail.com", "password": "1234"},
    {"username": "Rithanya R B ", "email": "rithanyasai1308@gmail.com", "password": "1234"},
    {"username": "NaveenKumar V ", "email": "Nk42434@gmail.com", "password": "1234"},
    {"username": "Sri Dharshana T ", "email": "sridharshanat@gmail.com", "password": "1234"},

]

# Insert data for users
for data in user_data:
    user = UserDetails(**data)
    user.save()

print("Data inserted for users.")
