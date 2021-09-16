<template>
<div id="List" class="animate__animated animate__fadeInUp row bg-white shadow-sm rounded-bottom p-2">
    <div class="modal fade" tabindex="-1" id="gerantModal">
        <div class="modal-dialog modal-dialog-centered modal-lg">

            <div class="modal-content">
                <div class="modal-header ">
                    <h4 class="modal-title ps-5 text-center text-primary" v-if="modalAction=='detail'"> <i class="bi bi-info-circle-fill text-info"></i> Détails Pisteur: {{currentPist.nom}} {{currentPist.prenom}} </h4>
                    <h4 class="modal-title  text-center text-warning" v-if="modalAction=='delete'"> <i class="bi bi-exclamation-octagon-fill text-warning"></i> Supprimer un Pisteur </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row d-flex justify-content-around" v-if="modalAction=='detail'">
                        <div class="p-2  bg-gray  text-start rounded col-md-10">
                            <h5 class="text-center mt-1">
                                Informations basics
                            </h5>
                            <hr>
                            <div class="d-flex justify-content-start flex-wrap">
                                <div class="col-md-4">
                                    Nom : {{currentPist.nom}}
                                </div>
                                <div class="col-md-4">
                                    Prenom : {{currentPist.prenom}}
                                </div>
                                <div class="col-md-4">
                                    N° CNI : {{currentPist.nb_cni}}
                                </div>
                                <div class="col-md-4">
                                    Telephone : {{currentPist.telephone}}
                                </div>
                                <div class="col-md-4">
                                    Statut : {{currentPist.statut}}
                                </div>
                                <div v-if="currentPist.statut == 'dependant'">
                                    magasin: {{currentPist.magasin}}
                                </div>
                                Solde:
                            </div>
                        </div>

                    </div>
                    <div class="row p-2" v-if="modalAction=='delete'">
                        <p class="">
                            {{ modalText }}
                        </p>
                    </div>

                </div>

                <div class="modal-footer" v-if="modalAction=='delete'">
                    <button type="button" class="btn btn-secondary px-2" data-bs-dismiss="modal">Annuler</button>
                    <button type="button" @click="deletePisteur(currentPist)" data-bs-dismiss="modal" class="btn btn-danger px-2">Supprimer <i class="bi bi-trash-fill"></i> </button>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div v-if="operation.nom">
            <div class="alert alert-success d-flex justify-content-between" v-if="operation.status">
                <div class="me-auto">
                    {{alertMessage}}
                </div>
                <div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>

                </div>

            </div>
            <p class="alert alert-danger" v-if="!operation.status">
                {{alertMessage}}
            </p>
        </div>

        <ol class="list-group list-group-flush mt-2 ">

            <li class="list-group-item d-flex justify-content-between align-items-start bg-light" v-for="pist in pisteurs" :key="pist.nom">
                <div class="p-3 me-auto">
                    {{pist.nom}} {{pist.prenom}}

                </div>
                <div class="d-flex p-2">
                    <div class="mx-1">
                        <button @click="infoPisteur(pist)" class="btn text-info">
                            <i class="bi bi-info-circle"></i>
                        </button>
                    </div>
                    <div class="mx-1">
                        <button class="btn text-primary">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                    </div>
                    <div class="mx-1">
                        <button @click="deletePisteur(pist, 'warnDeletion')" class="btn text-danger">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </li>

        </ol>
    </div>

</div>
</template>

<script>
const bootstrap = require('bootstrap')
const MagasinMixin = require('../mixins/magasin').default

export default {
    name: 'ListMagasin',
    mixins: [MagasinMixin],
    data() {
        return {
            currentPist: {},
            modalAction: 'detail',
            modalText: '',
            alertMessage: null,
            operation: {
                name: '',
                status: false
            },
            pisteurs: [],
        }
    },
    created() {
        this.getMagasinList()
        this.getPisteurList()

    },
    computed: {
        pisteurCounter() {
            return this.pisteurs.length()
        }
    },
    methods: {
        getPisteurList() {
            window.models.Pisteur.find({})
                .then((docs) => {
                    this.pisteurs = docs

                    for (var i in this.magasins) {

                        this.magasins[i].pisteurs.forEach(pist => {
                            pist.magasin = this.magasins[i].nom
                            this.pisteurs.push(pist)
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        launchModal() {
            var myModal = document.getElementById('gerantModal')

            const gerantModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            gerantModal.show()

        },
        hideModal() {
            var myModal = document.getElementById('gerantModal')

            const gerantModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            gerantModal.hide()

        },
        infoPisteur(pist) {
            this.modalAction = 'detail'

            this.currentPist = pist
            this.launchModal()
        },
        deletePisteur(pist, msg) {
            this.modalAction = 'delete'

            if (msg == 'warnDeletion') {
                this.modalText = 'Vous êtes sur le point de supprimer un pisteur. êtes vous sur de vouloir le faire? cette action est irreversible'
                this.currentPist = pist
                this.launchModal()
            } else if (!msg) {
                if (pist.nom && (pist.magasin == undefined)) {
                    this.operation.nom = 'delete'
                    window.models.Pisteur.deleteOne({
                            nom: pist.nom
                        })
                        .then((res) => {
                            this.hideModal()
                            console.log(res)
                            this.alertMessage = 'Pisteur supprimé avec succès.'
                            this.operation.status = true
                            this.getMagasinList()
                            this.getPisteurList()
                        })
                        .catch((err) => {
                            this.alertMessage = "Impossible de supprimer le pisteur une erreur s'est produite."
                            console.log(err)
                            this.operation.status = true
                        })
                    // this.modalAction = 'detail'
                } else if (pist.nom && pist.magasin) {
                    this.operation.nom = 'delete'
                    window.models.Magasin.findOne({
                            nom: pist.magasin
                        })
                        .then((mag) => {
                            this.hideModal()
                            mag.pisteurs.splice(pist.__index)
                            mag.save((err, doc) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(doc)
                                    this.alertMessage = 'Pisteur supprimé avec succès.'
                                    this.operation.status = true
                                    this.getMagasinList()
                                    this.getPisteurList()
                                }
                            })

                        })
                        .catch((err) => {
                            this.alertMessage = "Impossible de supprimer le pisteur une erreur s'est produite."
                            console.log(err)
                            this.operation.status = false
                        })
                }
            }

        }
    }
}
</script>

<style lang="css" scoped>
.list-group-item {
    text-align: center !important;
}

.bg-gray {
    background-color: rgb(238, 236, 236) !important;
}
</style>
