<template>
<div>
   
    <div class="modal fade" tabindex="-1" id="pisteurModal">
        <div class="modal-dialog modal-dialog-centered ">

            <div class="modal-content">
                <div class="modal-header ">
                    <h4 class="modal-title  text-center text-primary" v-if="modalAction=='detail'"> <i class="bi bi-info-circle-fill text-info"></i> Détails Pisteur: {{currentPist.nom}} {{currentPist.prenom}} </h4>
                    <h4 class="modal-title  text-center text-warning" v-if="modalAction=='delete'"> <i class="bi bi-exclamation-octagon-fill text-warning"></i> Supprimer un Pisteur </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row d-flex justify-content-around" v-if="modalAction=='detail'">
                        <div class="p-2  fs-3   rounded col-md-10">

                            <div>
                                Nom : {{currentPist.nom}}
                            </div>
                            <div>
                                Prenom : {{currentPist.prenom}}
                            </div>
                            <div>
                                N° CNI : {{currentPist.nb_cni}}
                            </div>
                            <div>
                                Telephone : {{currentPist.telephone}}
                            </div>
                            <div>
                                Statut : {{currentPist.statut}}
                            </div>
                            <div v-if="currentPist.statut == 'dependant'">
                                magasin: {{currentPist.magasin}}
                            </div>
                            <div>
                                Solde: {{currentPist.solde}} FCFA
                            </div>

                        </div>

                    </div>
                    <div class="row p-2" v-if="modalAction=='delete'">
                        <p>
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
        <div class="d-flex justify-content-end my-1">
            <div class="btn-group text-center  shadow-sm rounded">
                <button @click="searchBool = !searchBool" class="btn btn-primary"> <i class="bi bi-search"></i> </button>
                <button @click="printDocument('list', 'pisteurs')" class="btn btn-secondary"><i class="bi bi-printer"></i></button>
                <button class="btn btn-warning" @click="refresh()">
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button class="btn btn-light ">
                    Total: {{pisteurCounter}}
                </button>
            </div>
        </div>
        <div>
            <div class="d-flex justify-content-center m-0 p pb-2">
                <div class="col-md-8  pe-0">
                    <transition enter-active-class="animate__animated animate__fadeInDown animate__faster" leave-active-class="animate__animated animate__fadeOutUp animate__faster" mode="out-in">
                        <div v-if="searchBool">
                            <input @keyup.enter="getPisteurList(search)" v-model="search" type="text" name="search" id="search" class="form-control " placeholder="Rechechez un exportateur par son nom, prenom, addresse ou numero de telephone">
                        </div>
                    </transition>

                </div>
            </div>
           
            <div id="list">
                <table class="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nom et Prenom</th>
                            <th>Telephone</th>
                            <th>Statut</th>
                            <th>Solde</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <transition-group tag="tbody" mode="out-in" name="slide">
                        <tr class="" v-for="(pist, index ) in pisteurs" @dblclick="infoPisteur(pist)" :key="pist.nom">
                            <th> {{index+1}}</th>
                            <td class="col-md-4 px-2 ">{{pist.nom}} {{pist.prenom}}</td>
                            <td class="col-md-3 px-2 ">{{pist.telephone}}</td>
                            <td class="col-md-3 px-2 ">{{pist.statut}}</td>
                            <td class="col-md-3 px-2 ">{{pist.solde || 0 }}</td>

                            <td>
                                <div class="btn-group">
                                    <button @click="infoPisteur(pist)" class="btn text-info">
                                        <i class="bi bi-info-circle"></i>
                                    </button>

                                    <button @click="launchModal(pist, 'update')" class="btn text-primary">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>

                                    <button @click="deletePisteur(pist, 'warnDeletion')" class="btn text-danger">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </transition-group>

                </table>
            </div>
        </div>

    </div>

</div>
</template>

<script>
const bootstrap = require('bootstrap')
const ListsMixin
 = require('../mixins/lists').default
const printMixin = require('../mixins/printDocument').default

export default {
    name: 'ListMagasin',
    mixins: [ListsMixin
, printMixin],
    data() {
        return {
            searchBool: false,
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
            return this.pisteurs.length
        }
    },
    methods: {
        launchModal() {
            var myModal = document.getElementById('pisteurModal')
            const pisteurModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            pisteurModal.show()
        },
        hideModal() {
            var myModal = document.getElementById('pisteurModal')

            const pisteurModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            pisteurModal.hide()
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
                            this.operation.status = false
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
