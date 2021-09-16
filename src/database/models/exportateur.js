const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const exportateurSchema = new Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    addresse: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    },
    solde: {
        type: Number,
        required: true
    }

}, {timestamps: true})
exportateurSchema.index({"$**": 'text'})
// module.exports = exportateurSchema

module.exports = mongoose.model('exportateurs', exportateurSchema)