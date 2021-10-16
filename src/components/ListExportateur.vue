<template>
<div>
     <div id="context-menu" >
        <div class="context-title text-center mb-2">
            <strong>Actions</strong>
            <hr style="padding: 2px; margin:1px">
        </div>
        <div class="item" @click="infoExportateur(currentExp)">
            <i class="bi bi-info-circle-fill"></i>  Info
        </div>
        <div class="item" @click="launchModal(currentExp, 'update')">
            <i class="bi bi-pencil-fill"></i>  Modifier
        </div>
        <div class="item" @click="deleteExportateur(currentExp, 'warnDeletion')">
            <i class="bi bi-trash-fill"></i>  Supprimer
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
                            <label for="nom">Nom </label>
                            <input v-model="currentExp.nom" type="text" class="form-control" id="nom" aria-describedby="nameHelp" placeholder="Entrez le nom de l'exportateur">
                        </div>
                        <div class="form-group p-2">
                            <label for="prenom">Prenoms</label>
                            <input v-model="currentExp.prenom" type="text" class="form-control" id="prenom" placeholder="Entrez le/les prenom(s) de l'exportateur">
                        </div>
                        <div class="form-group p-2">
                            <label for="addresse">Addresse de l'exportateur</label>
                            <input v-model="currentExp.addresse" type="text" class="form-control" id="addresse" placeholder="Entrez  l'addresse de l'exportateur">
                        </div>
                        <div class="form-group p-2">
                            <label for="telephone">Numero de telephone de l'exportateur</label>
                            <input v-model="currentExp.telephone" type="text" class="form-control" id="telephone" placeholder="Entrez le numero de telephone de l'exportateur">
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" @click.prevent="editExp(currentExp)" class="btn btn-primary">Modifier <i class="bi bi-pencil-square"></i></button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" tabindex="-1" id="exportateurModal">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header ">
                    <h4 class="modal-title ps-5 text-center text-primary" v-if="modalAction=='detail'"> <i class="bi bi-info-circle-fill text-info"></i> Détails Exportateur: {{currentExp.nom}} {{currentExp.prenom}} </h4>
                    <h4 class="modal-title  text-center text-warning" v-if="modalAction=='delete'"> <i class="bi bi-exclamation-octagon-fill text-warning"></i> Supprimer un Exportateur </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row d-flex justify-content-around" v-if="modalAction=='detail'">
                        <div class="p-2  fs-3   rounded col-md-10">

                            <div>
                                Nom : {{currentExp.nom}}
                            </div>
                            <div>
                                Prenom : {{currentExp.prenom}}
                            </div>
                            <div>
                                Addresse : {{currentExp.addresse}}
                            </div>
                            <div>
                                Telephone : {{currentExp.telephone}}
                            </div>
                            <div>
                                Solde : {{currentExp.solde}} FCFA
                            </div>
                            <div>
                                Modifier : {{currentExp.updatedAt}}
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
                    <button type="button" @click="deleteExportateur(currentExp)" data-bs-dismiss="modal" class="btn btn-danger px-2">Supprimer <i class="bi bi-trash-fill"></i> </button>
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
                <i class="bi bi-exclamation-triangle-fill text-danger"></i> {{alertMessage}}
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
                    Total: {{exportateurCounter}}
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
                            <th>Nom et Prenom</th>
                            <th>Addresse</th>
                            <th>Telephone</th>
                            <th>Solde</th>
                            
                        </tr>
                    </thead>
                    <transition-group tag="tbody" mode="out-in" name="slide" appear>
                        <tr class="" v-for="(exp, index ) in exportateurs" @dblclick="infoExportateur(exp)" :key="exp.nom" @contextmenu="contextMenu($event, exp)">
                            <th> {{index+1}}</th>
                            <td class="col-md-4 px-2 ">{{exp.nom}} {{exp.prenom}}</td>

                            <td class="col-md-3 px-2 ">{{exp.addresse}}</td>
                            <td class="col-md-3 px-2 ">{{exp.telephone}}</td>
                            <td class="col-md-3 px-2 ">{{exp.solde}}</td>

                            
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
            search: '',
            searchBool: false,
            searchDate: new Date(),
            currentExp: {},
            modalAction: 'detail',
            modalText: '',
            alertMessage: null,
            operation: {
                name: '',
                status: false
            },
            Exportateurs: [],
        }
    },
    watch: {
        currentExp() {
            if (this.currentExp) {
                this.currentExp.createdAt = this.currentExp.createdAt.toLocaleDateString()
            }
        }
    },
    created() {
        this.getExportateurList()
        window.addEventListener('click', ()=>{
            document.getElementById("context-menu").classList.remove('active')
        })
       
    },
    computed: {
        exportateurCounter() {
            return this.exportateurs.length
        }
    },
    methods: {
        contextMenu(event, exp) {

            this.currentExp = exp
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
            this.getExportateurList()

        },
        editExp(exp) {
            console.log(exp)
            window.models.Exportateur.findOne({
                _id: exp._id
            }, (err, doc) => {
                if (err) {
                    console.log(err)
                    return
                }
                doc.nom = this.currentExp.nom
                doc.prenom = this.currentExp.prenom
                doc.addresse = this.currentExp.addresse
                doc.telephone = this.currentExp.telephone
                doc.save()
                console.log('modifier avec succes')
            })
        },
        launchModal(exp, name) {
            if (!name) {
                let myModal = document.getElementById('exportateurModal')
                const exportateurModal = new bootstrap.Modal(myModal, {
                    keyboard: false
                })
                exportateurModal.show()

            } else {
                let myModal = document.getElementById('updateModal')
                const updateModal = new bootstrap.Modal(myModal, {
                    keyboard: false
                })
                this.currentExp = exp
                updateModal.show()

            }

        },

        infoExportateur(exp) {

            this.currentExp = exp
            this.modalAction = 'detail'

            this.launchModal()
        },
        deleteExportateur(exp, msg) {
            this.modalAction = 'delete'

            if (msg == 'warnDeletion') {
                this.modalText = 'Vous êtes sur le point de supprimer un exportateur. êtes vous sur de vouloir le faire? cette action est irreversible'
                this.currentExp = exp
                this.launchModal()
            } else if (!msg) {
                if (exp.util) {
                        this.modalText = 'Cet Exportateur ne peut être supprimé car il a deja effectué plusieurs transactions'
                        this.launchModal()
                        return
                    }
                window.models.Exportateur.deleteOne({
                        _id: exp._id
                    })
                    .then((res) => {

                        console.log(res)
                        this.alertMessage = 'Exportateur supprimé avec succès.'
                        this.operation.status = true
                        this.operation.nom = 'delete'
                        this.getExportateurList()
                    })
                    .catch((err) => {
                        this.alertMessage = "Impossible de supprimer le Exportateur une erreur s'est produite."
                        console.log(err)
                        this.operation.status = false
                        this.operation.nom = 'delete'
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

.btn-outline-secondary {
    border: 1px solid rgb(185, 183, 183) !important;
}
</style>
