<template>
<div>
    <div class="modal" tabindex="-1" id="depenseModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajout de depense</h5>
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

    <form>
        <div class="form-group p-2">
            <label for="motif">Motif de la depense </label>
            <input v-model="motif" type="text" class="form-control" id="motif" aria-describedby="motifHelp" placeholder="Entrez le motif de la depense">
        </div>
        <div class="form-group p-2">
            <label for="montant">Montant de la depense</label>
            <input v-model="montant" type="number" class="form-control" id="montant" placeholder="Entrez le montant pour la depense">
        </div>
        <div class="form-group p-2">
            <label for="date">Date de la depense</label>
            <input v-model="date" type="date" class="form-control" id="date" placeholder="Entrez la date a laquelle la depense a été effectuée">
        </div>
        <div class="form-group px-2 ">
            <p class="mb-0">
                Qui fait la depense un pisteur independant ou un magasin ?
            </p>
            <div class="form-control">
                <div class="form-check">
                    <input type="radio" class="form-check-input" v-model="depenseur" id="depenseur1" name="depenseur" value="magasin">
                    <label class="form-check-label" for="depenseur1"> Un Magasin</label>
                </div>
                <div class="form-check">
                    <input type="radio" class="form-check-input" v-model="depenseur" id="depenseur2" name="depenseur" value="pisteur">
                    <label class="form-check-label" for="depenseur2"> Un Pisteur Independant</label>
                </div>

            </div>

        </div>

        <div class="form-group p-2" v-if="depenseur=='magasin'">
            <label for="magasin">Le magasin concerné</label>
            <!-- <input v-model="magasin" type="phone" class="form-control" id="magasin" placeholder="Entrez le nom du magasin concerné"> -->
            <select name="magasin" id="magasin" v-model="magasin" class="form-select text-muted">
                <option :value="magasin._id" v-for="magasin in magasins" :key="magasin._id">
                    {{ magasin.nom }}
                </option>
            </select>
        </div>
        <div class="form-group p-2" v-if="depenseur=='pisteur'">
            <label for="magasin">Le pisteur concerné</label>
            <!-- <input v-model="magasin" type="phone" class="form-control" id="magasin" placeholder="Entrez le nom du magasin concerné"> -->
            <select name="pisteur" id="pisteur" v-model="pisteur" class="form-select text-muted">
                <option :value="pisteur._id" v-for="pisteur in independantPisteurs" :key="pisteur._id">
                    {{ pisteur.nom }}
                </option>
            </select>
        </div>

        <div class="form-group p-2 d-flex justify-content-end">
            <div>
                <button @click.prevent='createDepense' type="submit" class="btn btn-success">Enregistrer</button>
            </div>
        </div>
    </form>
</div>
</template>

<script>
const bootstrap = require('bootstrap')
const MagasinMixin = require('../mixins/magasin').default

export default {
    /* eslint-env mongoose */
    name: 'Depense',
    mixins: [MagasinMixin],
    data() {
        return {
            motif: null,
            montant: null,
            date: null,
            magasin: null,
            pisteur: null,
            modalText: null,
            depenseur: 'magasin'

        }
    },
    created() {
        this.getMagasinList()
        this.getIndependantPisteurList()

    },
    methods: {
        createDepense() {
            if (this.$store.state.solde_principal < this.montant) {
                this.modalText = "Votre solde est insuffisant pour effectuer cette transaction"
                this.launchModal('echec')
                return
            }
            if (this.depenseur == 'magasin') {

                window.models.Depense.create({
                        motif: this.motif,
                        montant: this.montant,
                        magasin: this.magasin._id,
                        date: this.date
                    })

                    .then((res) => {
                        console.log(res)
                        this.$store.commit('deduire', {
                            somme: this.montant,
                            etat: 'principal'
                        })
                        this.$store.commit('ajouter', {
                            somme: this.montant,
                            etat: 'depense'
                        })
                        this.modalText = 'Depense crée avec succès'
                        this.launchModal('succes')
                        this.motif = ''
                        this.montant = ''
                        this.magasin = ''
                        this.date = ''

                    })
                    .catch((err) => {
                        console.log(err)
                        this.modalText = "La dépense n'a pas pu être ajoutée . veuillez vérifier les informations renseignées et reessayez"
                        this.launchModal('echec')
                    })

            } else if (this.depenseur == 'pisteur') {
                window.models.Depense.create({
                        motif: this.motif,
                        montant: this.montant,
                        pisteur: this.pisteur._id,
                        date: this.date
                    })

                    .then((res) => {
                        console.log(res)

                        this.modalText = 'Depense crée avec succès'
                        this.launchModal('succes')
                        this.motif = ''
                        this.montant = ''
                        this.magasin = ''
                        this.date = ''

                    })
                    .catch((err) => {
                        console.log(err)
                        this.modalText = "La dépense n'a pas pu être ajoutée . veuillez vérifier les informations renseignées et reessayez"
                        this.launchModal('echec')
                    })

            }

        },
        launchModal(status) {
            var myModal = document.getElementById('depenseModal')
            if (status == 'echec') {
                myModal.classList.add('text-danger')
                myModal.classList.remove('text-success')
            } else {
                myModal.classList.add('text-success')
                myModal.classList.remove('text-danger')
            }
            const depenseModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            depenseModal.show()

        }
    }

}
</script>
