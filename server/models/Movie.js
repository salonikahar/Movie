import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        _id: {type: String, required: true},
        title: {type: String, required: true},
        overview: {type: String, required: true},
        poster_path: {type: String, required: true},
        backdrop_path: {type: String, required: true},
        release_date: {type: String, required: true},
        original_language: {type: String, default: 'en'},
        tagline: {type: String, default: ''},
        genres: {type: Array, required: true, default: []},
        casts: {type: Array, required: true, default: []},
        crew: {type: Array, required: true, default: []},
        vote_average: {type: Number, required: true, default: 0},
        vote_count: {type: Number, default: 0},
        runtime: {type: Number, required: true},
        isActive: {type: Boolean, default: true},
    },{timestamps: true}
)

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;