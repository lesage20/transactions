<template>
<div>
    <div class="modal" tabindex="-1" id="produitModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajouter un produit</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="alert">
                        {{modalText}}
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary px-2" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>

    <form @submit.prevent="createProduit">
        <div class="form-group p-2">
            <label for="nom">Nom </label>
            <input v-model="nom" type="text" class="form-control" id="nom" aria-describedby="nameHelp" placeholder="Entrez le nom du produit">
        </div>
        <div class="form-group p-2">
            <label for="prixAchat">Prix d'achat pour 1 Kg</label>
            <input v-model="prixAchat" type="number" class="form-control" id="prixAchat" placeholder="Entrez le prix d'achat(s) pour 1 Kg">
        </div>

        <div class="form-group p-2">
            <label for="benefice">Benefice </label>
            <input v-model="benefice" type="text" class="form-control" id="benefice" placeholder="Entrez le benefice que vous voulez gagner sur ce produit">
        </div>
        <div class="form-group px-2 ">
            <p class="mb-0">
                Qui est le proprietaire du produit un pisteur independant ou un magasin ?
            </p>
            <div class="form-control">
                <div class="form-check">
                    <input type="radio" class="form-check-input" v-model="proprio" id="proprio1" name="proprio" value="magasin">
                    <label class="form-check-label" for="proprio1"> Un Magasin</label>
                </div>
                <div class="form-check">
                    <input type="radio" class="form-check-input" v-model="proprio" id="proprio2" name="proprio" value="pisteur">
                    <label class="form-check-label" for="proprio2"> Un Pisteur Independant</label>
                </div>

            </div>

        </div>

        <div class="form-group p-2" v-if="proprio ==  'magasin'">
            <label for="magasin">Magasin</label>
            <select v-model="magasin" name="magasin" id="magasin" class="form-select text-muted">
                <option :value="mag.nom" v-for="mag in magasins" :key="mag.id">{{ mag.nom }}</option>
            </select>
        </div>
        <div class="form-group p-2" v-else>

            <label for="pisteur">Pisteur</label>
            <select v-model="pisteur" name="pisteur" id="pisteur" class="form-select text-muted">
                <option :value="pist._id" v-for="pist in independantPisteurs" :key="pist.id">{{ pist.nom }} {{ pist.prenom }}</option>
            </select>
        </div>

        <div class="form-group p-2 d-flex justify-content-end">
            <div>
                <button type="submit" class="btn btn-success">Enregistrer</button>
            </div>
        </div>
    </form>
</div>
</template>

<script>
const bootstrap = require('bootstrap')
const ListsMixin = require('../mixins/lists').default
export default {
    /* eslint-env mongoose */
    name: 'produit',
    mixins: [ListsMixin],
    data() {
        return {
            nom: null,
            prixAchat: null,
            magasin: null,
            benefice: null,
            magasins: [],
            modalText: null,
            pisteur: null,
            proprio: 'magasin'

        }
    },
    created() {
        this.getMagasinList()
        this.getIndependantPisteurList()
    },
    methods: {
        createProduit() {
            if (this.proprio == "magasin") {
                window.models.Magasin.findOne({
                        nom: this.magasin
                    })
                    .then((doc) => {
                        doc.produits.push({
                            nom: this.nom,
                            prixAchat: this.prixAchat,
                            benefice: this.benefice,
                            util: false
                        })
                        doc.util = true
                        doc.save()
                            .then((res) => {
                                console.log(res)
                                // fire user
                                this.modalText = 'Produit ajouté avec succès'
                                this.launchModal('succes')
                                // clear all input field
                                this.nom = ''
                                this.prixAchat = ''
                                this.benefice = ''

                            }).catch((err) => {
                                console.log(err)
                                this.modalText = "Le produit n'a pas pu être ajoutée . veuillez vérifier les informations renseignées et reessayez"
                                this.launchModal('echec')
                            })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else if (this.proprio == "pisteur") {
                window.models.Pisteur.findOne({
                        _id: this.pisteur
                    })
                    .then((doc) => {
                        doc.produits.push({
                            nom: this.nom,
                            prixAchat: this.prixAchat,
                            benefice: this.benefice,
                            util: false
                        })
                        doc.util = true
                        doc.save()
                            .then((res) => {
                                console.log(res)
                                // fire user
                                this.modalText = 'Produit ajouté avec succès'
                                this.launchModal('succes')
                                // clear all input field
                                this.nom = ''
                                this.prixAchat = ''
                                this.benefice = ''

                            }).catch((err) => {
                                console.log(err)
                                this.modalText = "Le produit n'a pas pu être ajoutée . veuillez vérifier les informations renseignées et reessayez"
                                this.launchModal('echec')
                            })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }

        },
        launchModal(status) {
            var myModal = document.getElementById('produitModal')
            if (status == 'echec') {
                myModal.classList.add('text-danger')
                myModal.classList.remove('text-success')
            } else {
                myModal.classList.add('text-success')
                myModal.classList.remove('text-danger')
            }
            const produitModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            produitModal.show()

        }
    }

}
</script>
