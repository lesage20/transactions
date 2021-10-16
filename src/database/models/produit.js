const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const produitSchema = new Schema({
    nom: {
        type: String,
        required: true
    },
    prixAchat: {
        type: Number,
        required: true
    },
    benefice: {
        type: Number,
        required: true
    },
    util: {
        type: Boolean,
        required: true
    }


}, {timestamps: true})
produitSchema.index({"$**": 'text'})

module.exports = produitSchema