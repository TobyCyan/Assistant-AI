from flask import Blueprint, render_template, flash, request, jsonify
from flask_login import login_required, current_user
from .models import Note
from ._init_ import db
import json

views = Blueprint('views', __name__)

# Defining route of webpage to be called
# Cannot access unless logged in
@views.route('/', methods = ['GET', 'POST'])
@login_required
def home():
    # Adds a new note
    if request.method == 'POST':
        note = request.form.get('note')

        # Checks
        if len(note) < 1:
            flash('Note is too short!', category = 'error')
        else:
            new_note = Note(data = note, user_id = current_user.id)
            db.session.add(new_note)
            db.session.commit()
            flash('Note added!', category = 'success')

    # loads webpage with given template
    # Checks if user is authenticated with its attributes and grants access to the webpage
    return render_template('home.html', user = current_user)

@views.route('/delete-note', methods = ['POST'])
def delete_note():
    # Take in data from POST request
    # Loads as json object and access its attributes
    note = json.loads(request.data)
    noteId = note['noteId']
    note = Note.query.get(noteId)

    # Checks
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()
    
    return jsonify({})