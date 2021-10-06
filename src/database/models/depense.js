const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const depenseSchema = new Schema({
    motif: {
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
    }
    

}, {timestamps: true, collection: 'depense'})
depenseSchema.index({"$**": 'text'})
module.exports = mongoose.model('depense', depenseSchema)
mongoose.model('depense', depenseSchema).createIndexes()