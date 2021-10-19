<template>
<div id='Ajout' class="d-flex justify-content-center">
    <div class="modal" tabindex="-1" id="livraisonModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajout un Livraison</h5>
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

    <form @submit.prevent="createLivraison" class="d-flex justify-content-center flex-wrap col-md-5" >
        <div class="form-group p-2 col-md-12">
            <label for="chargement">Chargement </label>
            <select name="chargement" id="chargement" v-model="chargement" class="form-select form-control">
                <option :value="chgt._id" v-for="chgt in chargements" :key="chgt">
                    {{chgt.produit}} le {{chgt.date.toLocaleDateString()}}
                </option>
            </select>
        </div>

        <div class="form-group p-2 col-md-12">
            <label for="exportateur">Exportateur ou usine</label>
            <select name="chargement" id="chargement" v-model="exportateur" class="form-select form-control">
                <option :value="exp._id" v-for="exp in exportateurs" :key="exp">
                    {{exp.nom}} {{exp.prenom}}
                </option>
            </select>
        </div>
        <div class="form-group p-2 col-md-12">
            <label for="date">Date</label>
            <input v-model="date" type="date" class="form-control" id="date" placeholder="Entrez date de livraison">
        </div>

        <div class="form-group p-2 col-md-12 d-flex justify-content-end">
            <div>
                <button type="submit" class="btn btn-primary">Enregistrer <i class="bi bi-save2"></i></button>
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
    name: 'Livraison',
    mixins: [ListsMixin],
    data() {
        return {
            chargement: null,
            exportateur: null,
            date: null,

            modalText: null,

        }
    },
    created() {
        this.getMagasinList()
        this.getExportateurList()
        setTimeout(() => {
            this.getChargementList({
                status: 'attente'
            })
        })
        // console.log(this.magasins)
    },
    methods: {
        createLivraison() {
            let chargement = this.chargementDetails
            let exportateur = this.exportateurDetails
            let dat = new Date(this.date)
            if (chargement != null) {
                if (chargement.date.getFullYear() > dat.getFullYear()) {
                    this.modalText = "Impossible de livrer avant de faire un chargement"
                    this.launchModal('echec')
                    return
                } else if (chargement.date.getMonth() > dat.getMonth()) {
                    this.modalText = "Impossible de livrer avant de faire un chargement"
                    this.launchModal('echec')
                    return
                } else if (chargement.date.getDate() > dat.getDate()) {
                    this.modalText = "Impossible de livrer avant de faire un chargement"
                    this.launchModal('echec')
                    return
                }

            } else {
                this.modalText = "Veuillez choisir un chargement a livré"
                this.launchModal('echec')
                return
            }
            if (exportateur.solde < chargement.prix_total) {
                this.modalText = "Le solde de l'exportateur ou de l'usine est insuffisant pour recevoir ce chargement"
                this.launchModal('echec')
                return
            }

            window.models.Livraison.create({
                    chargement: this.chargement,
                    exportateur: this.exportateur,
                    date: this.date,
                    util: false
                })
                .then(() => {
                    window.models.Exportateur.findOne({
                            _id: this.exportateur
                        })
                        .then((exp) => {
                            exp.solde -= chargement.prix_total
                            exp.save()
                                .then(() => {
                                    console.log("Le solde de l'exportateur a été mis a jour avec succès")
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            return
                        })
                    window.models.Chargement.findOne({
                            _id: this.chargement
                        })
                        .then((chgt) => {
                            chgt.status = "livré"
                            chgt.util = true
                            chgt.save()
                                .then(() => {
                                    console.log("Chargement livré avec succès")
                                })
                                .catch(err => {
                                    console.log(err)
                                })

                        })
                        .catch(err => {
                            console.log(err)
                            return
                        })
                    this.$store.commit('ajouter', {
                        somme: chargement.benefice,
                        etat: 'benefice'
                    })
                    this.modalText = "Livraison ajouté avec succès......\n\n Le prix total a été deduit du compte de l'exportateur.\n Vos bénéfices ont été ajouté"
                    this.launchModal('succes')
                    this.chargement = null
                    this.exportateur = null
                    this.date = null

                }).catch((err) => {
                    console.log(err)
                    this.modalText = "livraison n'a pas pu être ajoutée . veuillez vérifier les informations renseignées et reessayez"
                    this.launchModal('echec')
                })

        },
        launchModal(status) {
            var myModal = document.getElementById('livraisonModal')
            if (status == 'echec') {
                myModal.classList.add('text-danger')
                myModal.classList.remove('text-success')
            } else {
                myModal.classList.add('text-success')
                myModal.classList.remove('text-danger')
            }
            const livraisonModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            livraisonModal.show()

        },

    },
    watch: {
        chargement() {
            if (this.chargement != null) {
                window.models.Chargement.findOne({
                        _id: this.chargement
                    })
                    .then((chgt) => {
                        this.chargementDetails = chgt
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        exportateur() {
            if (this.exportateur != null) {
                window.models.Exportateur.findOne({
                        _id: this.exportateur
                    })
                    .then((exp) => {
                        this.exportateurDetails = exp
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }

        }
    }

}
</script>
