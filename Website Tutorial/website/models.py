from ._init_ import db
from flask_login import UserMixin
from sqlalchemy.sql import func

# Defining Note Model with associated fields that we want to store in the database
class Note(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    data = db.Column(db.String(10000))
    
    # Records and stores the date and time automatically when this note is created
    date = db.Column(db.DateTime(timezone = True), default = func.now())
    
    # Stores a VALID user id as a foreign key that is associated with the note
    # Forms a one-to-many relationship
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

# Defining User Model with associated fields that we want to store in the database
class User(db.Model, UserMixin):
    # id is an Integer and is a primary key
    id = db.Column(db.Integer, primary_key = True)
    
    # email is a String with max length 150 and is unique
    email = db.Column(db.String(150), unique = True)
    
    # password is a String with max length 150
    password = db.Column(db.String(150))
    
    # firstName is a String with max length 150
    firstName = db.Column(db.String(150))

    # Stores a list of all the notes the user created
    # User has a relationship with Note
    notes = db.relationship('Note')