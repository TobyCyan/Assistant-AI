from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager

# Initialize a database
db = SQLAlchemy()
DB_NAME = "database.db"


def create_app():
    
    # Initialize a flask application with the given template
    app = Flask(__name__, template_folder = 'template')

    # Configure the app with a custom secret key, not to be shown in production
    app.config['SECRET_KEY'] = 'AIKENDUEET'
    
    # Storing our sqlite database from the given URI into our website folder
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'

    # Telling our database that this is the application we are going to use
    db.init_app(app)

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix = '/')
    app.register_blueprint(auth, url_prefix = '/')

    from .models import User, Note
    
    create_database(app)

    # Redirects view to login page when not logged in
    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    # Telling login manager which app we are using
    login_manager.init_app(app)

    # Loads user by querying database using user id
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))
    
    return app

def create_database(app):
    with app.app_context():
        if not path.exists('website/' + DB_NAME):
            db.create_all()
            print('Created Database!')