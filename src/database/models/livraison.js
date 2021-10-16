const mongoose = require('mongoose')
const Schema = mongoose.Schema 

let livraisonSchema = Schema({
    date: {
        type: Date,
        required: true
    },
    exportateur: {
        type: Schema.Types.ObjectId, ref: 'exportateur',
        required: true
    },
    chargement: {
        type: Schema.Types.ObjectId, ref: 'chargement',
        required: true
    },
    util: {
        type: Boolean,
        required: true
    }
}, {timestamps: true, collection: 'livraison'})


livraisonSchema.index({"$**":"text"})

var Livraison = mongoose.model('livraison', livraisonSchema)
module.exports = Livraison
Livraison.createIndexes()