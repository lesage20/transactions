const mongoose = require('mongoose')
const Schema = mongoose.Schema 

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
// module.exports = pisteurSchema

module.exports = mongoose.model('pisteurs', pisteurSchema)