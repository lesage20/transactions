<template>
<div>
    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel"> <i class="bi bi-pencil-square"></i> Modification</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent>
                        <div class="form-group p-2">
                            <label for="nom">Nom </label>
                            <input v-model="currentProd.nom" type="text" class="form-control" id="nom" aria-describedby="nameHelp" placeholder="Entrez le nom du produit">
                        </div>
                        <div class="form-group p-2">
                            <label for="prixAchat">Prix d'achat pour 1 Kg</label>
                            <input v-model="currentProd.prixAchat" type="number" class="form-control" id="prixAchat" placeholder="Entrez le prix d'achat du produit">
                        </div>
                        <div class="form-group p-2">
                            <label for="benefice">Benefice sur vente d'un produit</label>
                            <input v-model="currentProd.benefice" type="text" class="form-control" id="benefice" placeholder="Entrez  le benefice sur vente d'un produit">
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Modifier <i class="bi bi-pencil-square"></i></button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" tabindex="-1" id="produitModal">
        <div class="modal-dialog modal-dialog-centered ">
            <div class="modal-content">
                <div class="modal-header ">
                    <h4 class="modal-title  text-center text-primary" v-if="modalAction=='detail'"> <i class="bi bi-info-circle-fill text-info"></i> Détails produit </h4>
                    <h4 class="modal-title  text-center text-warning" v-if="modalAction=='delete'"> <i class="bi bi-exclamation-octagon-fill text-warning"></i> Supprimer un Pisteur </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row d-flex justify-content-around" v-if="modalAction=='detail'">
                        <div class="p-2  fs-3   rounded col-md-10">

                            <div>
                                Nom : {{currentProd.nom}}
                            </div>
                            <div>
                                Prix Achat : {{currentProd.prixAchat}} FCFA
                            </div>
                            <div>
                                Benefice : {{currentProd.benefice}} FCFA
                            </div>
                            <div>
                                Magasin : {{currentProd.magasin}}
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
                    <button type="button" @click="deleteProduit(currentProd)" data-bs-dismiss="modal" class="btn btn-danger px-2">Supprimer <i class="bi bi-trash-fill"></i> </button>
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
                <button @click="printDocument('list', 'magasins')" class="btn btn-secondary"><i class="bi bi-printer"></i></button>
                <button class="btn btn-warning" @click="refresh()">
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button class="btn btn-light ">
                    Total: {{produitCounter}}
                </button>
            </div>
        </div>
        <div class="d-flex justify-content-center m-0 p pb-2">
            <div class="col-md-8  pe-0">
                <transition enter-active-class="animate__animated animate__fadeInDown animate__faster" leave-active-class="animate__animated animate__fadeOutUp animate__faster" mode="out-in">
                    <div v-if="searchBool">
                        <input @keyup.enter="getExportateurList(search)" v-model="search" type="text" name="search" id="search" class="form-control " placeholder="Rechechez un produit par son nom, prixAchat, benefice ou numero de telephone">
                    </div>
                </transition>

            </div>
        </div>

        <table class="table table-bordered table-striped table-hover">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nom </th>
                    <th>Prix Achat</th>
                    <th>Prix Vente</th>
                    <th>Magasin</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <transition-group tag="tbody" mode="out-in" name="slide">
                <tr class="" v-for="(prod, index ) in produits" @dblclick="infoProduit(prod)" :key="prod.nom">
                    <th class="col-md-2"> {{index+1}}</th>
                    <td class="col-md-3 px-2 ">{{prod.nom}} </td>
                    <td class="col-md-2 px-2 ">{{prod.prixAchat}}</td>
                    <td class="col-md-2 px-2 ">{{prod.benefice}}</td>
                    <td class="col-md-3 px-2 ">{{prod.magasin}}</td>
                    <td>
                        <div class="btn-group">
                            <button @click="infoProduit(prod)" class="btn text-info">
                                <i class="bi bi-info-circle"></i>
                            </button>

                            <button @click="launchModal(prod, 'update')" class="btn text-primary">
                                <i class="bi bi-pencil-square"></i>
                            </button>

                            <button @click="deleteProduit(prod, 'warnDeletion')" class="btn text-danger">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </transition-group>
        </table>
    </div>

</div>
</template>

<script>
const bootstrap = require('bootstrap')
const ListsMixin = require('../mixins/lists').default
const printMixin = require('../mixins/printDocument').default

export default {
    name: 'ListMagasin',
    mixins: [ListsMixin, printMixin],
    data() {
        return {
            isBool: false,
            currentProd: {},
            produits: [],
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
        setTimeout(() => {
            this.getProduitList()
        }, 80)
    },
    computed: {
        produitCounter() {
            return this.produits.length
        }
    },
    methods: {

        launchModal(prod, name) {
            if (!name) {
                let myModal = document.getElementById('produitModal')

                const produitModal = new bootstrap.Modal(myModal, {
                    keyboard: false
                })
                produitModal.show()

            } else {
                let myModal = document.getElementById('updateModal')
                const updateModal = new bootstrap.Modal(myModal, {
                    keyboard: false
                })
                this.currentProd = prod
                updateModal.show()

            }

        },
      
        infoProduit(pist) {
            this.modalAction = 'detail'

            this.currentProd = pist
            this.launchModal()
        },
        deleteProduit(prod, msg) {
            this.modalAction = 'delete'

            if (msg == 'warnDeletion') {
                this.modalText = 'Vous êtes sur le point de supprimer un Produit. êtes vous sur de vouloir le faire? cette action est irreversible'
                this.currentProd = prod
                this.launchModal()
            } else if (!msg) {
                this.operation.nom = 'delete'
                window.models.Magasin.findOne({
                        nom: prod.magasin
                    })
                    .then((mag) => {

                        mag.produits.splice(prod.__index)
                        mag.save((err, doc) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log(doc)
                                this.alertMessage = 'Produit supprimé avec succès.'
                                this.operation.status = true
                                this.getMagasinList()
                                this.getGerantList()
                            }
                        })

                    })
                    .catch((err) => {
                        this.alertMessage = "Impossible de supprimer le produit une erreur s'est produite."
                        console.log(err)
                        this.operation.status = false
                    })

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
