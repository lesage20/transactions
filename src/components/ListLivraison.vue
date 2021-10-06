<template>
<div>
    <div class="modal fade" tabindex="-1" id="livraisonModal">
        <div class="modal-dialog modal-dialog-centered ">
            <div class="modal-content">
                <div class="modal-header ">
                    <h4 class="modal-title ps-5 text-center text-info" v-if="modalAction=='detail'"><i class="bi bi-info-circle-fill text-info"></i> Détails </h4>
                    <h4 class="modal-title  text-center text-warning" v-if="modalAction=='delete'"> <i class="bi bi-exclamation-octagon-fill text-warning"></i> Supprimer un Magasin </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row d-flex justify-content-around" v-if="modalAction=='detail'">
                        <div class="p-2  fs-3   rounded col-md-10">

                            <div class=" justify-content-center ">
                                <div class="">
                                    Motif : {{currentDep.motif}}
                                </div>
                                <div class="">
                                    Montant : {{currentDep.montant}} FCFA
                                </div>
                                <div class="">
                                    Date : {{currentDep.date.toLocaleDateString()}}
                                </div>
                                <div class="" v-if="currentDep.magasin">
                                    Magasin : {{currentDep.magasin.nom}}
                                </div>
                                <div class="" v-if="!currentDep.magasin">
                                    Pisteur: {{currentDep.pisteur}}
                                </div>

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
                    <button type="button" @click="deleteLivraison(currentDep)" data-bs-dismiss="modal" class="btn btn-danger px-2">Supprimer <i class="bi bi-trash-fill"></i> </button>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div v-if="operation.nom">
            <p class="alert alert-success" v-if="operation.status">
                {{alertMessage}}
            </p>
            <p class="alert alert-danger" v-if="!operation.status">
                {{alertMessage}}
            </p>
        </div>
         <div class="d-flex justify-content-end my-1">
            <div class="btn-group text-center  shadow-sm rounded">
                <button @click="searchBool = !searchBool" class="btn btn-primary"> <i class="bi bi-search"></i> </button>
                <button @click="printDocument('list', 'exportateurs')" class="btn btn-secondary"><i class="bi bi-printer"></i></button>
                <button class="btn btn-warning" @click="refresh()">
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button class="btn btn-light ">
                    Total: {{livraisonCounter}}
                </button>
            </div>
        </div>
        <div>
            <div class="d-flex justify-content-center m-0 p pb-2">
                <div class="col-md-8  pe-0">
                    <transition enter-active-class="animate__animated animate__fadeInDown animate__faster" leave-active-class="animate__animated animate__fadeOutUp animate__faster" mode="out-in">
                        <div v-if="searchBool">
                            <input @keyup.enter="getExportateurList(search)" v-model="search" type="text" name="search" id="search" class="form-control " placeholder="Rechechez un exportateur par son nom, prenom, addresse ou numero de telephone">
                        </div>
                    </transition>

                </div>
            </div>
            <div id="list">
                <table class="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Exportateur</th>
                            <th>Chargement</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <transition-group tag="tbody" mode="out-in" name="slide">
                        <tr class="" v-for="(dep, index) in livraisons" :key="dep.id" @dblclick="infoLivraison(dep)">
                            <th> {{index+1}}</th>
                            <td class="col-md-4 px-2 ">{{dep.exportateur.nom}} {{dep.exportateur.prenom}} </td>

                            <td class="col-md-3 px-2 ">{{dep.chargement.nb_fiche}}</td>
                            <td class="col-md-3 px-2 ">{{dep.date.toLocaleDateString()}}</td>

                            <td>
                                <div class="btn-group">
                                    <button @click="infoLivraison(dep)" class="btn text-info">
                                        <i class="bi bi-info-circle"></i>
                                    </button>

                                    <button @click="launchModal(exp, 'update')" class="btn text-primary">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>

                                    <button @click="deleteExportateur(exp, 'warnDeletion')" class="btn text-danger">
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
    mixins: [ListsMixin, printMixin],
    data() {
        return {
            searchBool: false,
            currentDep: {
                date: new Date()
            },
            livraisons: [],
            modalAction: 'detail',
            modalText: '',
            alertMessage: null,
            operation: {
                name: '',
                status: false
            },
        }
    },
    created() {
        this.getMagasinList()
        this.getLivraisonList()
    },
    computed: {
        livraisonCounter() {
            return this.livraisons.length
        }
    },
    methods: {
        
        // getLivraisonList() {

        //     window.models.Livraison.find({})
        //     .populate({
        //         path: 'magasin',
        //         model: window.models.Magasin,
                
        //     })
        //     .populate({
        //         path: 'pisteur',
        //         model: window.models.Pisteur,
        //     })
        //         .then((res) => {
                   
        //             this.livraisons = res
        //             console.log('liste de livraisons recuperé avec succès', res)

        //         })
        //         .catch((err) => {
        //             console.log(err)

        //         })
        // },
        launchModal() {
            var myModal = document.getElementById('livraisonModal')

            const livraisonModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            livraisonModal.show()

        },
        hideModal() {
            var myModal = document.getElementById('livraisonModal')

            const livraisonModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            livraisonModal.hide()

        },
        infoLivraison(dep) {
            this.modalAction = 'detail'
            this.currentDep = dep
            if (this.currentDep.magasin) {
                // window.models.Magasin.findone({_id: this.currentDep.magasin})
                // .then(doc => {
                //     doc.populate()
                // })

                this.currentDep.populate('magasin')
                    .then((res) => {
                        console.log(res)
                    })

            }
            this.launchModal()
        },
        deleteLivraison(dep, msg) {
            this.modalAction = 'delete'

            if (msg == 'warnDeletion') {
                this.modalText = 'Vous êtes sur le point de supprimer un depasin. êtes vous sur de vouloir le faire? cette action est irreversible'
                var date = dep.date.toLocaleDateString()
                dep.date = date
                this.currentDep = dep

                this.launchModal()
            } else if (!msg) {
                if (dep.motif) {
                    this.operation.nom = 'delete'
                    window.models.Livraison.deleteOne({
                            _id: dep._id
                        })
                        .then((res) => {
                            this.hideModal()
                            console.log(res)
                            this.alertMessage = 'Livraison supprimé avec succès.'
                            this.operation.status = true
                            this.getLivraisonList()
                        })
                        .catch((err) => {
                            this.alertMessage = "Impossible de supprimer le depasin une erreur s'est produite."
                            console.log(err)
                            this.operation.status = true

                        })
                    // this.modalAction = 'detail'
                } else {

                    console.log("vous ne pouvez pas supprimé un produit si vous n'en selectionner aucun")
                }
            }

        }
    }
}
</script>

<style lang="css" >
.list-group-item {
    text-align: center !important;
}

.bg-gray {
    background-color: rgb(238, 236, 236) !important;
}
</style>
