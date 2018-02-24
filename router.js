const MoviesDbAccess = require('./controllers/movies_db_access');

module.exports = function(app) {
    //simple index route
    app.get('/', function(req, res) {
        res.send(index.html);
    });
    app.get('/api/movies/find/:id', MoviesDbAccess.findById);
    app.get('/api/movies/all', MoviesDbAccess.findAll);
    app.get('/api/movies/genre/:genre', MoviesDbAccess.findByGenre);
    app.post('/api/movies/update/:id', MoviesDbAccess.update);
    app.delete('/api/movies/delete/:id', MoviesDbAccess.delete);
    app.post('/api/movies/add', MoviesDbAccess.add);
}