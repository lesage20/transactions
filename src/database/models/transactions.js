const mongoose = require('mongoose')
const Schema = mongoose.Schema 

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
    

}, {timestamps: true, collection: 'transaction'})

transactionSchema.index({"$**": 'text'})
var Transaction = mongoose.model('transaction', transactionSchema)
module.exports = Transaction
Transaction.createIndexes()