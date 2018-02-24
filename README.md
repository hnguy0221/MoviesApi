# MoviesApi
This is the movies server API. The documentation on how to test different endpoints will appear if you type in localhost:3090 in the URL of the browser.

### Technologies used
* HTML, JavaScript, Express, Morgan, Body-Parser, Router, MongoDB, Mongoose (ORM to MongoDB), and Node Js.

### Getting Started
* git clone https://github.com/hnguy0221/MoviesApi.git
* cd MoviesApi
* npm install
* Assuming you have MongoDB installed
* On a separate terminal, type in, mongod, and hit enter
* On a separate terminal, type in, npm run dev, and hit enter
* On a separate terminal, type in the following command to import the movies from the CSV file into MongoDB. Note: The location of my Movies.csv is /Users/mackbook/WebProjects/MoviesApi/. On your machine, the location of the CSV file is probably different.
* mongoimport --db moviesapi --collection movies --type csv --headerline --file /Users/macbook/WebProjects/MoviesApi/Movies.csv
* I used Postman to test various endpoints of the API. You might need to do the same
