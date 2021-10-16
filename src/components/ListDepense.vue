<template>
<div>
    <div id="context-menu">
        <div class="context-title text-center mb-2">
            <strong>Actions</strong>
            <hr style="padding: 2px; margin:1px">
        </div>
        <div class="item" @click="infoDepense(currentDep)">
            <i class="bi bi-info-circle-fill"></i> Info
        </div>
        <div class="item" @click="launchModal(currentDep, 'update')">
            <i class="bi bi-pencil-fill"></i> Modifier
        </div>
        <div class="item" @click="deleteDepense(currentDep, 'warnDeletion')">
            <i class="bi bi-trash-fill"></i> Supprimer
        </div>
    </div>
    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel"> <i class="bi bi-pencil-square"></i> Modification</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="createExportateur">
                        <div class="form-group p-2">
                            <label for="motif">Motif </label>
                            <input v-model="currentDep.motif" type="text" class="form-control" id="motif" aria-describedby="nameHelp" placeholder="Entrez le motif de la depense">
                        </div>
                        <div class="form-group p-2">
                            <label for="montant">Montant</label>
                            <input v-model="currentDep.montant" type="text" class="form-control" id="montant" placeholder="Entrez le/les montant de la depense">
                        </div>
                        <div class="form-group p-2">
                            <label for="date">Date de depense</label>
                            <input v-model="currentDep.date" type="date" class="form-control" id="date" placeholder="Entrez  la date a laquelle vouuuuuuuus avez depensé l'argent">
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">j'ai fini</button>
                    <button type="submit" @click.prevent="editDep(currentDep)" class="btn btn-primary">Modifier <i class="bi bi-pencil-square"></i></button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" tabindex="-1" id="depenseModal">
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
        <div class="d-flex justify-content-end my-1">
            <div class="btn-group text-center  shadow-sm rounded">
                <button @click="searchBool = !searchBool" class="btn btn-primary"> <i class="bi bi-search"></i> </button>
                <button @click="printDocument('list', 'depenses')" class="btn btn-secondary"><i class="bi bi-printer"></i></button>
                <button class="btn btn-warning" @click="refresh()">
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button class="btn btn-light ">
                    Total: {{depenseCounter}}
                </button>
            </div>
        </div>
        <div>
            <div class="d-flex justify-content-center m-0 p pb-2">
                <div class="col-md-8  pe-0">
                    <transition enter-active-class="animate__animated animate__fadeInDown animate__faster" leave-active-class="animate__animated animate__fadeOutUp animate__faster" mode="out-in">
                        <div v-if="searchBool">
                            <input @keyup.enter="searchDepense(search)" v-model="search" type="text" name="search" id="search" class="form-control " placeholder="Rechechez un exportateur par son nom, prenom, addresse ou numero de telephone">
                        </div>
                    </transition>

                </div>
            </div>
            <div id="list">
                <table class="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Motif</th>
                            <th>Montant</th>
                            <th>Receveur</th>
                            <th>Date</th>
                           
                        </tr>
                    </thead>
                    <transition-group tag="tbody" mode="out-in" name="slide">
                        <tr class="" v-for="(dep, index) in depenses" :key="dep.id" @dblclick="infoDepense(dep)" @contextmenu="contextMenu($event, dep)">
                            <th> {{index+1}}</th>
                            <td class="col-md-4 px-2 ">{{dep.motif}} </td>

                            <td class="col-md-3 px-2 ">{{dep.montant}}</td>
                            <td class="col-md-3 px-2 " v-if="dep.magasin != undefined">{{dep.magasin.nom}}</td>
                            <td class="col-md-3 px-2 " v-if="dep.pisteur != undefined">{{dep.pisteur.nom}} {{dep.pisteur.prenom}}</td>
                            <td class="col-md-3 px-2 ">{{dep.date.toLocaleDateString()}}</td>

                            
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
const ListsMixin = require('../mixins/lists').default
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
        window.addEventListener('click', () => {
            document.getElementById("context-menu").classList.remove('active')
        })
    },
    computed: {
        depenseCounter() {
            return this.depenses.length
        },
        allDepenses() {
            return this.depensesForSearch
        }
    },
    methods: {
        contextMenu(event, dep) {

            this.currentDep = dep
            //    this.context = true
            const context_menu = document.getElementById("context-menu")
            context_menu.classList.remove('active')
            context_menu.style.top = event.target.getBoundingClientRect().top + event.offsetY + "px"
            context_menu.style.left = event.target.getBoundingClientRect().left + event.offsetX + "px"
            context_menu.classList.add('active')

        },
        searchDepense(searchString) {
            console.log(searchString)
            let depenses = this.allDepenses
            this.depenses = []
            depenses.forEach((el) => {
                console.log(el)
                if (el.motif.toLowerCase().includes(searchString.toLowerCase())) {
                    this.depenses.push(el)
                } else if (el.montant.toString().includes(searchString)) {
                    this.depenses.push(el)
                }

                if (this.depenses.indexOf(el) == -1) {
                    if (el.magasin) {
                        if (el.magasin.nom.toLowerCase().includes(searchString.toLowerCase())) {
                            this.depenses.push(el)
                        }
                    }
                }
                if (this.depenses.indexOf(el) == -1) {

                    if (el.pisteur) {
                        if (el.pisteur.nom.toLowerCase().includes(searchString.toLowerCase())) {
                            this.depenses.push(el)
                        }
                    }
                }
            })
        },
        refresh() {
            this.searchBool = false
            this.search = null
            this.getDepenseList()

        },
        
        launchModal(dep, name) {
            if (!name) {
                var myModal = document.getElementById('depenseModal')

                const depenseModal = new bootstrap.Modal(myModal, {
                    keyboard: false
                })
                depenseModal.show()

            } else {
                this.currentDep = dep
                let myModal = document.getElementById('updateModal')
                const updateModal = new bootstrap.Modal(myModal, {
                    keyboard: false
                })

                updateModal.show()

            }

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
            console.log(dep)
            if (msg == 'warnDeletion') {
                this.modalText = 'Vous êtes sur le point de supprimer une depense. êtes vous sur de vouloir le faire? cette action est irreversible'
                this.currentDep = dep

                this.launchModal()
            } else if (!msg) {
                console.log(dep, this.currentDep)
                if (dep) {

                    if (dep.util ) {
                        this.modalText = 'Cette depense ne peut être supprimée car elle contient deja un chargement supprimez le chargement et reessayé'
                        this.launchModal('echec')
                        return
                    }
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
