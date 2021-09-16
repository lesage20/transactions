const mongoose = require('mongoose')
const Schema = mongoose.Schema 
const gerantSchema = require('./gerant')

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
    gerants: [ gerantSchema ],
    pisteurs: [ pisteurSchema ],
    solde: {
        type: Number,
        required: true
    }


}, {timestamps: true})
magasinSchema.index({"$**": 'text'})

module.exports = mongoose.model('magasins', magasinSchema)


