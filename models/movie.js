const mongoose = require('mongoose');
const Schema = mongoose.Schema;//Schema is used to tell mongoose about a particular field that our model is going to have

//Define our model
const movieSchema = new Schema({
	"movie id": {
		type: Number,
		unique: true,
		required: true
	},
    title: {
    	type: String,
        required: true
    },
    genres: {
        type: String,
        required: true
    }
});

//Create the model class
const ModelClass = mongoose.model('movie', movieSchema);

//Export the model - since node can't use import keywork, we use module.exports
module.exports = ModelClass;