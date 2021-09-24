<template>
<div class="p-2 ">
    
    <div class="modal fade" tabindex="-1" id="depenseModal">
        <div class="modal-dialog modal-dialog-centered modal-lg">

            <div class="modal-content">
                <div class="modal-header ">
                    <h4 class="modal-title ps-5 text-center text-info" v-if="modalAction=='detail'"><i class="bi bi-info-circle-fill text-info"></i> Détails </h4>
                    <h4 class="modal-title  text-center text-warning" v-if="modalAction=='delete'"> <i class="bi bi-exclamation-octagon-fill text-warning"></i> Supprimer un Magasin </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row d-flex justify-content-around" v-if="modalAction=='detail'">
                        <div class="p-2  fs-3   rounded col-md-10">

                            <div class=" justify-content-center text-center">
                                <div class="">
                                    Motif : {{currentDep.motif}}
                                </div>
                                <div class="">
                                    Montant : {{currentDep.montant}}
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
                    <button type="button" @click="deleteDepense(currentDep)" data-bs-dismiss="modal" class="btn btn-danger px-2">Supprimer <i class="bi bi-trash-fill"></i> </button>
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
        <div>
            <div class="d-flex justify-content-end m-0 px-5 py-0">
                <div>
                    Total: {{depenseCounter}}
                </div>
            </div>
            <ol class="list-group list-group-flush mt-2 ">

                <li class="list-group-item d-flex justify-content-between align-items-start bg-light" v-for="dep in depenses" :key="dep.id">
                    <div class="p-3 me-auto">
                        {{dep.motif}}

                    </div>
                    <div class="d-flex p-2">
                        <div class="mx-1">
                            <button @click="infoDepense(dep)" class="btn text-info">
                                <i class="bi bi-info-circle"></i>
                            </button>
                        </div>
                        <div class="mx-1">
                            <button class="btn text-primary">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </div>
                        <div class="mx-1">
                            <button @click="deleteDepense(dep, 'warnDeletion')" class="btn text-danger">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </li>

            </ol>
        </div>
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
            currentDep: {
                date: new Date()
            },
            depenses: [],
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
        this.getDepenseList()
    },
    computed: {
        depenseCounter() {
            return this.depenses.length
        }
    },
    methods: {
        getDepenseList() {
            window.models.Depense.find({})
                .then((res) => {
                    this.depenses = res
                    console.log('liste de depenses recuperé avec succès', res)

                })
                .catch((err) => {
                    console.log(err)

                })
        },
        launchModal() {
            var myModal = document.getElementById('depenseModal')

            const depenseModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            depenseModal.show()

        },
        hideModal() {
            var myModal = document.getElementById('depenseModal')

            const depenseModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            depenseModal.hide()

        },
        infoDepense(dep) {
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
        deleteDepense(dep, msg) {
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
                    window.models.Depense.deleteOne({
                            _id: dep._id
                        })
                        .then((res) => {
                            this.hideModal()
                            console.log(res)
                            this.alertMessage = 'Depense supprimé avec succès.'
                            this.operation.status = true
                            this.getDepenseList()
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

<style lang="css" scoped>
.list-group-item {
    text-align: center !important;
}

.bg-gray {
    background-color: rgb(238, 236, 236) !important;
}
</style>
