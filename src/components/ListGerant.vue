<template>
<div>
    <div id="context-menu">
        <div class="context-title text-center mb-2">
            <strong>Actions</strong>
            <hr style="padding: 2px; margin:1px">
        </div>
        <div class="item" @click="infoGerant(currentGer)">
            <i class="bi bi-info-circle-fill"></i> Info
        </div>
        <div class="item" @click="launchModal(currentGer, 'update')">
            <i class="bi bi-pencil-fill"></i> Modifier
        </div>
        <div class="item" @click="deleteGerant(currentGer, 'warnDeletion')">
            <i class="bi bi-trash-fill"></i> Supprimer
        </div>
    </div>
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
                            <input v-model="currentGer.nom" type="text" class="form-control" id="nom" aria-describedby="nameHelp" placeholder="Entrez le nom du gerant">
                        </div>
                        <div class="form-group p-2">
                            <label for="prenom">Prenoms</label>
                            <input v-model="currentGer.prenom" type="text" class="form-control" id="prenom" placeholder="Entrez le/les prenom(s) du gerant">
                        </div>
                        <div class="form-group p-2">
                            <label for="telephone">Numero de telephone du gerant</label>
                            <input v-model="currentGer.telephone" type="text" class="form-control" id="telephone" placeholder="Entrez le numero de telephone du gerant">
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">J'ai Fini</button>
                    <button type="submit" class="btn btn-primary">Modifier <i class="bi bi-pencil-square"></i></button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" tabindex="-1" id="gerantModal">
        <div class="modal-dialog modal-dialog-centered ">
            <div class="modal-content">
                <div class="modal-header ">
                    <h4 class="modal-title  text-center text-primary" v-if="modalAction=='detail'"> <i class="bi bi-info-circle-fill text-info"></i> Détails Gerant </h4>
                    <h4 class="modal-title  text-center text-warning" v-if="modalAction=='delete'"> <i class="bi bi-exclamation-octagon-fill text-warning"></i> Supprimer un Pisteur </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row d-flex justify-content-around" v-if="modalAction=='detail'">
                        <div class="p-2  fs-3   rounded col-md-10">

                            <div>
                                Nom : {{currentGer.nom}}
                            </div>
                            <div>
                                Prenom : {{currentGer.prenom}}
                            </div>
                            <div>
                                Telephone : {{currentGer.telephone}}
                            </div>
                            <div>
                                Magasin : {{currentGer.magasin}}
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
                    <button type="button" @click="deleteGerant(currentGer)" data-bs-dismiss="modal" class="btn btn-danger px-2">Supprimer <i class="bi bi-trash-fill"></i> </button>
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
                <button @click="printDocument('list', 'gerants')" class="btn btn-secondary"><i class="bi bi-printer"></i></button>
                <button class="btn btn-warning" @click="refresh()">
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button class="btn btn-light ">
                    Total: {{gerantCounter}}
                </button>
            </div>
        </div>
        <div class="d-flex justify-content-center m-0 p pb-2">
            <div class="col-md-8  pe-0">
                <transition enter-active-class="animate__animated animate__fadeInDown animate__faster" leave-active-class="animate__animated animate__fadeOutUp animate__faster" mode="out-in">
                    <div v-if="searchBool">
                        <input @keyup.enter="getGerantList(search)" v-model="search" type="text" name="search" id="search" class="form-control " placeholder="Rechechez un gerant par son nom, prenom, addresse ou numero de telephone">
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
                        <th>Magasin</th>
                        
                    </tr>
                </thead>
                <transition-group tag="tbody" mode="out-in" name="slide">
                    <tr class="" v-for="(ger, index ) in gerants" @dblclick="infoGerant(ger)" :key="ger.nom" @contextmenu="contextMenu($event, ger)">
                        <th class="col-md-2"> {{index+1}}</th>
                        <td class="col-md-4 px-2 ">{{ger.nom}} {{ger.prenom}}</td>
                        <td class="col-md-3 px-2 ">{{ger.telephone}}</td>
                        <td class="col-md-3 px-2 ">{{ger.magasin}}</td>
                        
                    </tr>
                </transition-group>
            </table>
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
            currentGer: {},
            gerants: [],
            modalAction: 'detail',
            modalText: '',
            alertMessage: null,
            operation: {
                name: '',
                status: false
            },
            gereurs: [],
            searchBool: false
        }
    },
    created() {
        this.getGerantList()
        window.addEventListener('click', ()=>{
            document.getElementById("context-menu").classList.remove('active')
        })

    },
    computed: {
        gerantCounter() {
            return this.gerants.length
        }
    },
    methods: {
        contextMenu(event, ger) {
            this.currentGer = ger
            //    this.context = true
            const context_menu = document.getElementById("context-menu")
            context_menu.classList.remove('active')
            context_menu.style.top = event.target.getBoundingClientRect().top + event.offsetY + "px"
            context_menu.style.left = event.target.getBoundingClientRect().left + event.offsetX + "px"
            context_menu.classList.add('active')

        },
        refresh() {
            this.searchBool = false
            this.search = null
            this.getGerantList()

        },
        launchModal(ger, name) {
            if (!name) {
                let myModal = document.getElementById('gerantModal')

                const gerantModal = new bootstrap.Modal(myModal, {
                    keyboard: false
                })
                gerantModal.show()

            } else {
                this.currentGer = ger
                // console.log(this.currentGer)
                let myModal = document.getElementById('updateModal')
                const updateModal = new bootstrap.Modal(myModal, {
                    keyboard: false
                })

                updateModal.show()

            }

        },
        infoGerant(ger) {
            this.modalAction = 'detail'

            this.currentGer = ger
            this.launchModal()
        },
        deleteGerant(ger, msg) {
            this.modalAction = 'delete'

            if (msg == 'warnDeletion') {
                this.modalText = 'Vous êtes sur le point de supprimer un gerant. êtes vous sur de vouloir le faire? cette action est irreversible'
                this.currentGer = ger
                this.launchModal()
            } else if (!msg) {
                this.operation.nom = 'delete'
                window.models.Magasin.findOne({
                        nom: ger.magasin
                    })
                    .then((mag) => {
                        console.log(ger)
                        console.log(ger.__index)
                        if (ger.nom + ger.prenom == this.currentGer.nom + this.currentGer.prenom) {

                            mag.gerants.splice(ger.__index, 1)

                            mag.save((err, doc) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(doc)
                                    this.alertMessage = 'Gerant supprimé avec succès.'
                                    this.operation.status = true
                                    this.getGerantList()
                                }
                            })
                        }

                    })
                    .catch((err) => {
                        this.alertMessage = "Impossible de supprimer le gerant une erreur s'est produite."
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
