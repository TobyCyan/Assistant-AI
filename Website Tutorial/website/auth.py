from flask import Blueprint, render_template, request, flash, redirect, url_for
from .models import User
from ._init_ import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user

auth = Blueprint('auth', __name__)

# Defining route of webpage to be called
# Defining GET and POST methods to accept get and post requests
@auth.route('/login', methods = ['GET', 'POST'])
def login():
    # request form accepted from post request when users login
    data = request.form

    if request.method == 'POST':
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email = email).first()
        # checks
        if user:
            if check_password_hash(user.password, password):
                flash('Logged in successfully!', category = 'success')
                # Remembers that the user has logged in
                login_user(user, remember = True)
                return redirect(url_for('views.home'))
            else:
                flash('Incorrect password, try again.', category = 'error')
        else:
            flash('Email does not exist', category = 'error')

    # loads webpage with given template
    # Checks if user is authenticated with its attributes and grants access to the webpage
    return render_template('login.html', user = current_user)

# Cannot access unless logged in
@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@auth.route('/sign-up', methods = ['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        # request form accepted from post request when users sign up
        data = request.form

        # field data obtained from users
        # data is a hash map
        email = data.get('email')
        firstName = data.get('firstName')
        password = data.get('password')
        passwordConfirm = data.get('passwordConfirm')

        user = User.query.filter_by(email = email).first()
        # checks
        if user:
            flash('Email already exists.', category = 'error')
        elif len(email) < 4:
            flash('Email must be greater than 4 characters.', category = 'error')
        elif len(firstName) < 2:
            flash('First name must be greater than 1 character.', category = 'error')
        elif password != passwordConfirm:
            flash('Passwords do not match.', category = 'error')
        elif len(password) < 7:
            flash('Password must be at least 7 characters.', category = 'error')
        else:
            # add user to database and updates it
            # hash the password using the hash function sha256
            new_user = User(email = email, firstName = firstName, password = generate_password_hash(password, method = "scrypt"))
            db.session.add(new_user)
            db.session.commit()
            login_user(user, remember = True)
            flash('Account created!', category = 'success')
            return redirect(url_for('views.home'))

    # loads webpage with given template
    # Checks if user is authenticated with its attributes and grants access to the webpage
    return render_template('sign_up.html', user = current_user)