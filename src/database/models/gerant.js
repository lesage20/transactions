const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const gerantSchema = new Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },


}, {timestamps: true})
gerantSchema.index({"$**": 'text'})

module.exports = gerantSchema