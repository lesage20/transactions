const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const chargementSchema = new Schema({
    nb_fiche: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    poid_brut: {
        type: Number,
        required: true
    },
    nb_sac: {
        type: Number,
        required: true
    },
    poid_net: {
        type: Number,
        required: true
    },
    prix_kg: {
        type: Number,
        required: true
    },
    prix_total: {
        type: Number,
        required: true
    }

}, {timestamps: true})
chargementSchema.index({"$**": 'text'})
module.exports = mongoose.model('chargement', chargementSchema)