const mongoose = require('mongoose')
const Schema = mongoose.Schema 
const Pisteur = require('./pisteur')
const Magasin = require('./magasin')
const Exportateur = require('./exportateur')
const transactionSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    montant: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    magasin: {
        type: Schema.Types.ObjectId, ref: 'magasin',
        required: false
    },
    pisteur: {
        type: Schema.Types.ObjectId, ref: 'pisteur',
        required: false
    },
    exportateur: {
        type: Schema.Types.ObjectId, ref: 'exportateur',
        required: false
    }
    

}, {timestamps: true})
transactionSchema.index({"$**": 'text'})
module.exports = mongoose.model('transactions', transactionSchema)
mongoose.model('transactions', transactionSchema).createIndexes()