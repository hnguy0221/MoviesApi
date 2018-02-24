const Movie = require('../models/movie');

exports.findById = function(req, res, next) {
    const id = req.params.id;
    //res.send({ success: 'true' });
    Movie.findOne({ "movie id": id }, function(err, existingMovie) {
        if (err) {
            return next(err);
        }
        if (!existingMovie) {
            return res.status(404).send({ status: '404', error: 'Not Found' });
        }
        res.send(parseMovie(existingMovie));
    });
}

exports.findAll = function(req, res, next) {
    Movie.find({}).limit(100).exec(function(err, existingMovies) {
        if (err) {
            return next(err);
        }
        if (!existingMovies) {
            return res.status(404).send({ status: '404', error: 'Not Found' });
        }
        res.send(determineMoviesList(existingMovies));
    });
}

exports.findByGenre = function(req, res, next) {
    const genre = req.params.genre;
    Movie.find({ genres: { $regex: genre, $options: 'i'} }).limit(100).exec(function(err, existingMovies) {
        if (err) {
            return next(err);
        }
        if (!existingMovies) {
            return res.status(404).send({ status: '404', error: 'Not Found' });
        }
        res.send(determineGenresList(existingMovies));
    });
}

exports.update = function(req, res, next) {
    const id = req.params.id;
    if (!req.body.title && !req.body.genres) {
        return res.status(422).send({ error: 'You must provide either the title or the genres' });
    }

    Movie.update({ "movie id": id }, {
        $set: {
            "title": req.body.title,
            "genres": req.body.genres
        }
    }, function(err, updatedMovie) {
        if (err) {
            return next(err);
        }
        if (!updatedMovie) {
            return res.status(404).send({ status: '404', error: 'Not Found' });
        }
        //res.send({ success: true });
        res.send(updatedMovie);
    });   
}

exports.delete = function(req, res, next) {
    const id = req.params.id;
    Movie.remove({ "movie id": id }, function(err, removedMovie) {
        if (err) {
            return next(err);
        }
        if (!removedMovie) {
            return res.status(404).send({ status: '404', error: 'Not Found' });
        }
        res.send({ success: true });
    });
}

exports.add = function(req, res, next) {
    const id = req.body["movie id"];
    const title = req.body.title;
    const genres = req.body.genres;

    if (!id || !title || !genres) {
        return res.status(422).send({ error: 'You must provide movie id, title, and genres' });
    }

    const movie = new Movie({
        "movie id": id,
        title,
        genres
    });
    movie.save(function(err) {//save the move into the database
        if (err) {
            return next(err);
        }
        res.send({ success: true });
    });
}

//This helper function parses out the properties (id, title, 
//genres, year) of the movie object and returns a movie object 
//containing those properties.
function parseMovie(movie) {
    const _id = movie._id;
    const movie_id = movie["movie id"];
    const title = movie.title;
    const genres = movie.genres.split('|');
    const year = parseInt(title.substring(title.length-5, title.length-1));
    return { _id, movie_id, title, genres, year };
}

//This helper function determines which year has the most movies 
//and it returns an array that has the year with the most 
//movies first.
function determineMoviesList(moviesList) {
    const moviesArr = moviesList.map(movie => {
        return parseMovie(movie);
    });
    //sort movies from newest to oldest
    moviesArr.sort((movie1, movie2) => {
        return movie2.year - movie1.year;
    })
    //determine which year has the most movies. The object will
    //have the form as follows:
    //{'1996': 28, '1995': 93, '1994': 10, '1992': 2, '1976': 1}
    const yearsMap = {};
    for (let movie of moviesArr) {
        if (!yearsMap[movie.year]) {
            yearsMap[movie.year] = 1;
        } else {
            yearsMap[movie.year]++;
        }
    }
    //Convert the object that contains the year with the most movies
    //to an array so it can be sorted. The year with the most movies
    //will be the first element in the array. The second element of the
    //array will have the second most movies, etc ...
    const yearsArr = [];
    for (let year in yearsMap) {
        yearsArr.push({ year: parseInt(year), movies: yearsMap[year]});
    }
    yearsArr.sort((obj1, obj2) => {
        return obj2.movies - obj1.movies;
    });
    //Finally, using the array that has the year with the most movies,
    //build a list of movies with the most movies first.
    const moviesResults = [];
    for (let element of yearsArr) {
        for (let movie of moviesArr) {
            if (element.year === movie.year) {
                moviesResults.push(movie);
            }
        }
    }
    return moviesResults;
}

//This helper function determines which genres has the most movies 
//and it returns an array that has the genres with the most 
//movies first.
function determineGenresList(moviesList) {
    //sort movies in alphabetical order
    moviesList.sort((movieA, movieB) => {
        const genresA = movieA.genres.toUpperCase(); // ignore upper and lowercase
        const genresB = movieB.genres.toUpperCase(); // ignore upper and lowercase
        if (genresA < genresB) {
            return -1;
        }
        if (genresA > genresB) {
            return 1;
        }

        // genres must be equal
        return 0;
    })
    //determine which genres has the most movies. The object will
    //have the form as follows:
    //{'Action|Thriller': 28, 'Action|Drama': 93, 'Action|Drama|Thriller': 10}
    const genresMap = {};
    for (let movie of moviesList) {
        if (!genresMap[movie.genres]) {
            genresMap[movie.genres] = 1;
        } else {
            genresMap[movie.genres]++;
        }
    }
    //Convert the object that contains the genres with the most movies
    //to an array so it can be sorted. The year with the most movies
    //will be the first element in the array. The second element of the
    //array will have the second most movies, etc ...
    const genresArr = [];
    for (let genres in genresMap) {
        genresArr.push({ genres: genres, movies: genresMap[genres]});
    }
    genresArr.sort((objA, objB) => {
        return objB.movies - objA.movies;
    });
    //Finally, using the array that has the genres with the most movies,
    //build a list of movies with the most movies first.
    const moviesResults = [];
    for (let element of genresArr) {
        for (let movie of moviesList) {
            if (element.genres === movie.genres) {
                moviesResults.push(parseMovie(movie));
            }
        }
    }
    return moviesResults;
}