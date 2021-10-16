const mongoose = require('mongoose')
const Schema = mongoose.Schema 
const produitSchema = require('./produit')

const pisteurSchema = new Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    nb_cni: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    statut: {
        type: String,
        required: true
    },
    solde: {
        type: Number,
        required: true
    },
    produits: [produitSchema],
    util: {
        type: Boolean,
        required: true
    }

}, {timestamps: true, collection: 'pisteur'})
pisteurSchema.index({"$**": 'text'})
// module.exports = pisteurSchema

module.exports = mongoose.model('pisteur', pisteurSchema)
mongoose.model('pisteur', pisteurSchema).createIndexes()