const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gallerySchema = new Schema({
    imageTitle: {
        type: String,
        required: true,
    },
    imageURL: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    dominantColor: {
        type: String,
        required: true
      }
}, {timestamps: true});

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;