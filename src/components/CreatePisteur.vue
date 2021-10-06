<template>
<div class="">
    <div class="modal" tabindex="-1" id="pisteurModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajout un Pisteur</h5>
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

    <form @submit.prevent="createPisteur">
        <div class="form-group p-2">
            <label for="nom">Nom </label>
            <input v-model="nom" type="text" class="form-control" id="nom" aria-describedby="nameHelp" placeholder="Entrez le nom du partenaire">
        </div>
        <div class="form-group p-2">
            <label for="prenom">Prenoms</label>
            <input v-model="prenom" type="text" class="form-control" id="prenom" placeholder="Entrez le/les prenom(s) du pisteur">
        </div>
        <div class="form-group p-2">
            <label for="nb_cni">Numero de la carte nationale d'identité</label>
            <input v-model="nb_cni" type="text" class="form-control" id="nb_cni" placeholder="Entrez le numero de la carte nationale d'identité du pisteur">
        </div>
        <div class="form-group p-2">
            <label for="telephone">Numero de telephone du pisteur</label>
            <input v-model="telephone" type="text" class="form-control" id="telephone" placeholder="Entrez le numero de telephone du pisteur">
        </div>
        <div class="form-group p-2">

            <label for="statut">Statut</label>
            <select v-model="statut" name="statut" id="statut" class="form-select">
                <option value="dependant">Dependant</option>
                <option value="independant">Independant</option>
            </select>
        </div>
        <div class="form-group p-2" v-if="statut=='dependant'">

            <label for="magasin">Magasin</label>
            <select v-model="magasin" name="magasin" id="magasin" class="form-select text-muted">
                <option :value="mag.nom" v-for="mag in magasins" :key="mag.id">{{ mag.nom }}</option>
            </select>
        </div>

        <div class="form-group p-2 d-flex justify-content-end">
            <div>
                <button type="submit" class="btn btn-primary">Enregistrer</button>
            </div>

        </div>
    </form>
</div>
</template>

<script>
const bootstrap = require('bootstrap')
const ListsMixin
 = require('../mixins/lists').default
export default {
    /* eslint-env mongoose */
    name: 'Pisteur',
    mixins: [ListsMixin
],
    data() {
        return {
            nom: null,
            prenom: null,
            nb_cni: null,
            telephone: null,
            statut: "independant",
            magasin: null,
            magasins: [],
            modalText: null,

        }
    },
    mounted() {
        this.getMagasinList()
        // console.log(this.magasins)
    },
    methods: {

        createPisteur() {
            if (isNaN(this.telephone)) {
                this.modalText = "Le numero de telephone saisie est incorrect"
                this.launchModal('echec')
                return
            } else if ((this.telephone.length != 10)) {
                this.modalText = "Le numero de telephone en Côte d'ivoire compte 10 chiffre"
                this.launchModal('echec')
                return
            } else if (this.telephone.length == 10) {
                if (this.telephone.startsWith('01') || this.telephone.startsWith('05') || this.telephone.startsWith('07')) {
                    console.log('good number')
                } else {
                    this.modalText = "Le numero de telephone en Côte d'ivoire doivent commencer par 01,05 ou 07"
                    this.launchModal('echec')
                    return
                }
            }
            if (this.statut == 'dependant') {
                if (this.magasin != null) {
                    window.models.Magasin.findOne({
                            nom: this.magasin
                        })
                        .then((doc) => {
                            doc.pisteurs.push({
                                nom: this.nom,
                                prenom: this.prenom,
                                statut: this.statut,
                                nb_cni: this.nb_cni,
                                solde: 0,
                                telephone: this.telephone
                            })
                            doc.save()
                                .then((res) => {
                                    console.log(res)
                                    this.modalText = 'Pisteur ajouté avec succès'
                                    this.launchModal('succes')
                                    this.nom = ''
                                    this.prenom = ''
                                    this.statut = ''
                                    this.nb_cni = ''
                                    this.telephone = ''

                                }).catch((err) => {
                                    console.log(err)
                                    this.modalText = "Le pisteur n'a pas pu être ajoutée . veuillez vérifier les informations renseignées et reessayez"
                                    this.launchModal('echec')
                                })
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                } else {
                    this.modalText = "Choisissez d'abord un magasin"
                    this.launchModal('echec')
                    return
                }
            } else {
                window.models.Pisteur.create({
                    nom: this.nom,
                    prenom: this.prenom,
                    statut: this.statut,
                    nb_cni: this.nb_cni,
                    telephone: this.telephone,
                    solde: 0,
                }).then((res) => {
                    console.log(res)

                    this.modalText = 'Pisteur ajouté avec succès'
                    this.launchModal('succes')
                    this.nom = ''
                    this.prenom = ''
                    this.statut = ''
                    this.nb_cni = ''
                    this.telephone = ''

                }).catch((err) => {
                    console.log(err)
                    this.modalText = "Le pisteur n'a pas pu être ajoutée . veuillez vérifier les informations renseignées et reessayez"
                    this.launchModal('echec')
                })
            }

        },
        launchModal(status) {
            var myModal = document.getElementById('pisteurModal')
            if (status == 'echec') {
                myModal.classList.add('text-danger')
                myModal.classList.remove('text-success')
            } else {
                myModal.classList.add('text-success')
                myModal.classList.remove('text-danger')
            }
            const PisteurModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            PisteurModal.show()

        }
    }

}
</script>
