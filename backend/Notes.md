- setup 
    - npm init -y
    - npm i express
    - npm i nodemon -D
    - edit package.json if you need to (scripts)
    - create server.js file at root
- in server.js 
    - require and call express() as app
    - code to listen to port app.listen(PORT, func)
    - add any folder you create in root to app.use()
- create routes, views and public folders
    - set paths in server.js
    - create index.html in views
- code for handling 404 error
    - create 404.html file in views
    - app.all() in server.js

- middleware
    - middleware folder
    - create logs folder
    - date-fns uuid
    - logEvents function
    - errorHandler
    - cookie-parser
    - cors (!)
    - config
    - setup cors so that only allowed origins can access resources of app

- setup mongodb
    - dotenv mongoose
    - create models folder
    - define schema in models

- routing and controllers
    - set userRoutes 
    - create controllers to control the http requests

