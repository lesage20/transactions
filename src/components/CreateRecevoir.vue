<template>
<div class="row shadow-sm bg-white">
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
    <form>
        <div class="form-group p-2">
            <label for="montant">Montant </label>
            <input v-model="montant" type="number" class="form-control" id="montant" aria-describedby="montantHelp" placeholder="Entrez la somme à recevoir">
        </div>
        <div class="form-group p-2">
            <label for="date">Date </label>
            <input v-model="date" type="date" class="form-control" id="date" aria-describedby="dateHelp" placeholder="Entrez la date de reception">
        </div>
        <div class="form-group p-2">
            <label for="exportateur">Exportateur</label>
            <!-- <input type="text" class="form-control" id="exportateur" placeholder="veuillez choisir l'exportateur qui envoie l'argent"> -->
            <select v-model="exportateur" name="exportateur" id="exportateur" class="form-select">
                <option :value="exp._id" v-for=" exp in exportateurs" :key="exp._id">
                    {{exp.nom}} {{exp.prenom}}
                </option>
            </select>
        </div>
        <div class="form-group p-2 d-flex justify-content-end">
            <div>
                <button type="submit" @click.prevent="recevoir()" class="btn btn-success">Recevoir</button>
            </div>

        </div>

    </form>

</div>
</template>

<script>
const ListsMixin = require('../mixins/lists').default
const bootstrap = require('bootstrap')
export default {
    name: 'Recevoir',
    mixins: [ListsMixin],
    data() {
        return {
            exportateur: null,
            montant: null,
            date: new Date(),
            modalText: '',
        }
    },
    methods: {
        recevoir() {
            console.log(this.exportateur)
            window.models.Transaction.create({
                    montant: this.montant,
                    exportateur: this.exportateur,
                    type: 'reception',
                    date: this.date,
                    util: false

                })
                .then((res) => {
                    console.log('succès: ', res)
                    this.$store.commit('ajouter', {
                        somme: this.montant,
                        etat: 'principal'
                    })
                    this.$store.commit('ajouter', {
                        somme: this.montant,
                        etat: 'recu'
                    })

                    window.models.Exportateur.findOne({
                            _id: this.exportateur
                        })
                        .then((doc) => {
                            console.log('exportateur: ', doc)
                            doc.solde += res.montant
                            doc.util = true
                            doc.save((err, dc) => {
                                if (err) console.log(err)
                                else console.log('success: ', dc)
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    this.modalText = "Reception enregistré avec succès"
                    this.launchModal('succes')
                    this.exportateur = null,
                    this.montant = null

                })
                .catch((err) => {
                    console.log(err)
                    this.modalText = "Reception non enregistré une erreur s'est produite"
                    this.launchModal('echec')
                })
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
    },
    created() {
        // console.log('vue instance created')
        this.getExportateurList()
    },
    mounted() {
        // console.log('mounted')
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
