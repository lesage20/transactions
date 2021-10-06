const mongoose = require('mongoose')
const Schema = mongoose.Schema 
const gerantSchema = require('./gerant')
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
    }

}, {timestamps: true})
pisteurSchema.index({"$**": 'text'})                

const magasinSchema = new Schema({
    nom: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true
    },
    ville: {
        type: String,
        required: true
    },
    addresse: {
        type: String,
        required: true
    },
    gerants: [ gerantSchema ],
    pisteurs: [ pisteurSchema ],
    produits: [produitSchema],
    solde: {
        type: Number,
        required: true
    }


}, {timestamps: true, collection: 'magasin'})
// magasinSchema.index({"nom": 'text', "code":"text", "createdAt": "text"})
magasinSchema.index({"$**":"text"})
var Magasin = mongoose.model('magasin', magasinSchema)
module.exports = Magasin
Magasin.createIndexes()


