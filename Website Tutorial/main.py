from website._init_ import create_app

app = create_app()

if __name__ == '__main__':
    # runs application with debug mode on
    app.run(debug = True)
