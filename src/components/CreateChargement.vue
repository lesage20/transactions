<template>
<div>
    <div class="modal" tabindex="-1" id="chargementModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajout de chargement</h5>
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

    <form @submit.prevent="createChargement">
        <div class="form-group p-2">
            <label for="nb_fiche">N° fiche de chargement </label>
            <input v-model="nb_fiche" type="text" class="form-control" id="nb_fiche" placeholder="Entrez le numero de la fiche de chargement">
        </div>
        <div class="form-group p-2">
            <label for="date">Date de chargement</label>
            <input v-model="date" type="date" class="form-control" id="date" placeholder="Entrez la date de chargement">
        </div>
        <div class="form-group p-2">
            <label for="poid_brut">Poids brut du chargement (Kg)</label>
            <input v-model="poid_brut" type="number" class="form-control" id="poid_brut" placeholder="Entrez le poids brut du chargement en Kg">
        </div>
        <div class="form-group p-2">
            <label for="nb_sac">Nombre de sacs</label>
            <input v-model="nb_sac" type="number" class="form-control" id="nb_sac" placeholder="Entrez le nombre de sacs">
        </div>

        <div class="form-group px-2 ">
            <p class="mb-0">
                Qui fait le chargement un pisteur independant ou un magasin ?
            </p>
            <div class="form-control">
                <div class="form-check">
                    <input type="radio" class="form-check-input" v-model="chargeur" id="chargeur1" name="chargeur" value="magasin">
                    <label class="form-check-label" for="chargeur1"> Un Magasin</label>
                </div>
                <div class="form-check">
                    <input type="radio" class="form-check-input" v-model="chargeur" id="chargeur2" name="chargeur" value="pisteur">
                    <label class="form-check-label" for="chargeur2"> Un Pisteur Independant</label>
                </div>

            </div>

        </div>

        <div class="form-group p-2" v-if="chargeur=='magasin'">
            <label for="magasin">Le magasin concerné</label>
            <select name="magasin" @change="getProduitParChargeur('magasin')" id="magasin" v-model="magasin" class="form-select text-muted">
                <option :value="mag._id" v-for="mag in magasins" :key="mag._id">
                    {{ mag.nom }}
                </option>
            </select>
        </div>
        <div class="form-group p-2" v-if="chargeur=='pisteur'">
            <label for="magasin">Le pisteur concerné</label>
            <select name="pisteur" @change="getProduitParChargeur('pisteur')" id="pisteur" v-model="pisteur" class="form-select text-muted">
                <option :value="pisteur._id" v-for="pisteur in independantPisteurs" :key="pisteur._id">
                    {{ pisteur.nom }}
                </option>
            </select>
        </div>
        <div class="form-group p-2">
            <label for="poid_net">Poids net du chargement (Kg)</label>
            <input v-model="poid_net" type="number" class="form-control" id="poid_net" placeholder="Entrez le poids net du chargement en Kg">
        </div>
        <div class="form-group p-2" v-if="chargeur=='magasin'">
            <label for="produit">Produit contenu dans le chargement </label>
            <select name="produit" id="produit" v-model="produit" class="form-select text-muted">
                <option :value="prod.nom" v-for="prod in produitsChargeur" :key="prod.nom">
                    {{ prod.nom }}
                </option>
            </select>
        </div>
        <div class="form-group p-2">
            <label for="prix_kg">Prix par Kg (FCFA)</label>
            <input disabled v-model="prix_kg" type="number" class="form-control" id="prix_kg" placeholder="Entrez le prix pour 1 Kg  en FCFA">
        </div>

        <div class="form-group p-2 d-flex justify-content-end">
            <div>
                <button type="submit" class="btn btn-success">Enregistrer Le chargement</button>
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
    name: 'Chargement',
    mixins: [ListsMixin],
    data() {
        return {
            nb_fiche: null,
            produit: null,
            produitsChargeur: null,
            date: null,
            poid_brut: null,
            nb_sac: null,
            poid_net: null,
            // prix_kg: null,
            modalText: null,
            magasin: null,
            pisteur: null,
            chargeur: 'magasin'

        }
    },
    created() {
        this.getMagasinList()
        this.getIndependantPisteurList()
        setTimeout(() => {
            this.getProduitList()
        }, 80)
    },
    computed: {

        total() {
            return this.prix_kg * this.poid_net
        },
        benefice() {
            let productBenefice = 0
            this.produits.forEach((prod) => {
                if (prod.nom == this.produit) {
                    productBenefice = prod.benefice * this.poid_net
                }
            })
            return productBenefice
        },

        prix_kg() {
            if (this.produit) {
                let productPrice = 0
                console.log(this.produit)
                this.produitsChargeur.forEach((prod) => {
                    console.log(prod.nom, this.produit)
                    if (prod.nom == this.produit) {

                        productPrice = prod.prixAchat + prod.benefice
                    }
                })
                console.log(productPrice)
                return productPrice
            } else {
                return 0
            }
        }
    },
    methods: {
        getProduitParChargeur(chargeur) {
            if (chargeur == "magasin") {
                window.models.Magasin.findOne({
                    _id: this.magasin
                }).then((mag) => {
                    this.produitsChargeur = mag.produits
                    if (this.produitsChargeur.length == 0) {

                        this.modalText = "Le Magasin selectionné n'a aucun produit d'enregistré. Il ne peut donc pas faire de chargement.\n Veuillez en choisir un autre ou ajoutez ses produits et réessayez"
                        this.launchModal('avertissement')
                    }
                })
            } else {
                window.models.Pisteur.findOne({
                    _id: this.pisteur
                }).then((pist) => {
                    this.produitsChargeur = pist.produits
                    if (this.produitsChargeur.length == 0) {
                        this.modalText = "Le Pisteur selectionné n'a aucun produit d'enregistré. Il ne peut donc pas faire de chargement.\n Veuillez en choisir un autre ou ajoutez ses produits et réessayez"
                        this.launchModal('avertissement')

                    }
                })
            }
        },
        createChargement() {
            if ((this.poid_brut == 0) || (this.nb_sac == 0) ||
                (this.poid_net == 0)) {
                this.modalText = 'Aucun champs ne peut contenir zero(0). Veuillez vérifier les informations renseignées et reessayez'
                this.launchModal('echec')
                return
            }
            if (this.chargeur == 'magasin') {
                window.models.Chargement.create({
                    nb_fiche: this.nb_fiche,
                    date: this.date,
                    poid_brut: this.poid_brut,
                    nb_sac: this.nb_sac,
                    poid_net: this.poid_net,
                    prix_kg: this.prix_kg,
                    prix_total: this.total,
                    magasin: this.magasin._id,
                    produit: this.produit,
                    benefice: this.benefice,
                    status: "attente"
                }).then((res) => {
                    console.log(res)
                    window.models.Magasin.findOne({
                            _id: res.magasin
                        })
                        .then((doc) => {

                            doc.solde -= res.prix_total

                            doc.save((err, dc) => {
                                if (err) console.log("magasin concerné: ", err)
                                else console.log('magasin concerné: success: ', dc)
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })

                    this.modalText = 'Chargement crée avec succès'
                    this.launchModal('succes')
                    this.nb_fiche = null
                    this.date = null
                    this.poid_brut = 0
                    this.nb_sac = 0
                    this.poid_net = 0
                    this.prix_kg = 0

                }).catch((err) => {
                    console.log(err)
                    this.modalText = 'Chargement non enregistré. Veuillez vérifier les informations renseignées et reessayez'
                    this.launchModal('echec')
                })
            } else if (this.chargeur == 'pisteur') {
                window.models.Chargement.create({
                    nb_fiche: this.nb_fiche,
                    date: this.date,
                    poid_brut: this.poid_brut,
                    nb_sac: this.nb_sac,
                    poid_net: this.poid_net,
                    prix_kg: this.prix_kg,
                    prix_total: this.total,
                    pisteur: this.pisteur._id
                }).then((res) => {
                    console.log(res)
                    window.models.Pisteur.findOne({
                            _id: res.pisteur
                        })
                        .then((doc) => {

                            doc.solde -= res.prix_total

                            doc.save((err, dc) => {
                                if (err) console.log("pisteur concerné: ", err)
                                else console.log('pisteur concerné: success: ', dc)
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })

                    this.modalText = 'Chargement crée avec succès'
                    this.launchModal('succes')
                    this.nb_fiche = null
                    this.date = null
                    this.poid_brut = 0
                    this.nb_sac = 0
                    this.poid_net = 0
                    this.prix_kg = 0

                }).catch((err) => {
                    console.log(err)
                    this.modalText = 'Chargement non enregistré. Veuillez vérifier les informations renseignées et reessayez'
                    this.launchModal('echec')
                })
            }

        },
        launchModal(status) {
            var myModal = document.getElementById('chargementModal')
            var modalTitle = document.querySelector('#chargementModal h5')
            if (status == 'echec') {
                modalTitle.className = "modal-title text-danger"

            } else if (status == 'succes') {
                modalTitle.className = "modal-title text-success"

            } else if (status == 'avertissement') {
                modalTitle.className = "modal-title text-warning"

            }
            const chargementModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            chargementModal.show()

        }
    }

}
</script>

<style scoped>
   
</style>
