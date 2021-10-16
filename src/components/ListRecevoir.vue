<template>
<div>
     <div id="context-menu" >
        <div class="context-title text-center mb-2">
            <strong>Actions</strong>
            <hr style="padding: 2px; margin:1px">
        </div>
        <div class="item" @click="infoRecep(currentRecep)">
            <i class="bi bi-info-circle-fill"></i>  Info
        </div>
        <div class="item" @click="launchModal(currentRecep, 'update')">
            <i class="bi bi-pencil-fill"></i>  Modifier
        </div>
        <div class="item" @click="deleteRecep(currentRecep, 'warnDeletion')">
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
                    <form @submit.prevent>
                        <div class="form-group p-2">
                            <label for="montant">Montant </label>
                            <input v-model="currentRecep.montant" type="number" class="form-control" id="montant" aria-describedby="nameHelp" placeholder="Entrez le montant recu">
                        </div>

                        <div class="form-group p-2">
                            <label for="date">Date de reception</label>
                            <input v-model="currentRecep.date" type="date" class="form-control" id="date" placeholder="Entrez  le date de reception de l'argent">
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">J'ai Fini</button>
                    <button type="submit" @click.prevent="editRecep(currentRecep)" class="btn btn-primary">Modifier <i class="bi bi-pencil-square"></i></button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" tabindex="-1" id="magasinModal">
        <div class="modal-dialog modal-dialog-centered ">

            <div class="modal-content">
                <div class="modal-header ">
                    <h4 class="modal-title ps-5 text-center" v-if="modalAction=='detail'">Détails </h4>
                    <h4 class="modal-title  text-center text-warning" v-if="modalAction=='delete'"> <i class="bi bi-exclamation-octagon-fill text-warning"></i> Supprimer un Magasin </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row d-flex justify-content-start" v-if="modalAction=='detail'">
                        <div class="p-2    mb-3 rounded-end fs-4">
                            <p>
                                exportateur: {{currentRecep.exportateur}} <br>
                                Montant : {{currentRecep.montant}} FCFA<br>
                                Date : {{ date }}

                            </p>
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
                    <button type="button" @click="deleteReception(currentRecep)" data-bs-dismiss="modal" class="btn btn-danger px-2">Supprimer <i class="bi bi-trash-fill"></i> </button>
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
            <div>
                <div class="d-flex justify-content-end my-1">
                    <div class="btn-group text-center  shadow-sm rounded">
                        <button @click="searchBool = !searchBool" class="btn btn-primary"> <i class="bi bi-search"></i> </button>
                        <button @click="printDocument('list', 'receptions')" class="btn btn-secondary"><i class="bi bi-printer"></i></button>
                        <button class="btn btn-warning" @click="refresh()">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                        <button class="btn btn-light ">
                            Total: {{ReceptionCounter}}
                        </button>
                    </div>
                </div>
                <div class="d-flex justify-content-center m-0 p pb-2">
                    <div class="col-md-8  pe-0">
                        <transition enter-active-class="animate__animated animate__fadeInDown animate__faster" leave-active-class="animate__animated animate__fadeOutUp animate__faster">
                            <div v-if="searchBool">
                                <div class="input-group my-1" v-if="searchBoolStr">
                                    <input @keyup.enter="searchRecevoir(search)" v-model="search" type="text" name="search" id="search" class=" form-control " placeholder="Rechechez un recu selon l'exportateur ou le montant">
                                    <div class="input-group-append">
                                        <input type="submit" class="btn btn-secondary rounded-0 rounded-end" value="Rechercher par date" @click.prevent="searchByDate">
                                    </div>
                                </div>
                                <div class="input-group my-1" v-else-if="searchBoolDate">
                                    <input @change="getReceptionList(searchDate)" v-model="searchDate" type="date" name="search-by-date" id="search-by-date" class="form-control " placeholder="Rechercher un exportateur ..">
                                    <div class="input-group-append">
                                        <input type="submit" class="btn btn-secondary rounded-0 rounded-end" value="Rechercher par exportateur" @click.prevent="searchByDate">
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>

            </div>
            <div id="list">
                <table class="table table-bordered table-hover table-striped">

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nom et Prenom exp</th>
                            <th>Montant</th>
                            <th>Date</th>
                           

                        </tr>
                    </thead>

                    <transition-group tag="tbody" mode="out-in" name="slide" >
                        <tr class="" v-for="(recep, index) in receptions" :key="recep._id" @dblclick="infoRecep(recep)" @contextmenu="contextMenu($event, recep)">
                            <td class="col-md-1  px-2 fs-5 ">{{ index + 1 }} </td>
                            <td class="col-md-4  px-2 fs-5 ">{{ recep.exportateur.nom }} {{ recep.exportateur.prenom }} </td>
                            <td class="col-md-3 px-2 fs-5 ">{{recep.montant}}</td>
                            <td class="col-md-2 px-2 fs-5 ">{{recep.date.toLocaleDateString()}}</td>

                            
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
    name: 'ListRecevoir',
    mixins: [ListsMixin, printMixin],
    data() {
        return {
            currentRecep: {},
            searchBool: false,
            searchBoolStr: true,
            searchBoolDate: false,
            modalAction: 'detail',
            modalText: '',
            operationSucceded: false,
            alertMessage: null,
            operation: {
                name: '',
                status: false
            },

        }
    },
    created() {
        this.getReceptionList()
        window.addEventListener('click', ()=>{
            document.getElementById("context-menu").classList.remove('active')
        })
    },
    computed: {
        date() {
            if (Object.keys(this.currentRecep).length != 0) {
                return this.currentRecep.date.toLocaleDateString()

            }
            return null
        },
        ReceptionCounter() {
            return this.receptions.length
        },
        allRecevoir(){
            return this.receptionsForSearch
        }
    },
    methods: {
        contextMenu(event, recep) {

            this.currentRecep = recep
            //    this.context = true
            const context_menu = document.getElementById("context-menu")
            context_menu.classList.remove('active')
            context_menu.style.top = event.target.getBoundingClientRect().top + event.offsetY + "px"
            context_menu.style.left = event.target.getBoundingClientRect().left + event.offsetX + "px"
            context_menu.classList.add('active')

        },
        searchRecevoir(searchString){
            console.log(searchString)
            let receptions = this.allRecevoir
            this.receptions = []
            receptions.forEach((el)=>{
                console.log(el)
                if (el.exportateur.nom.toLowerCase().includes(searchString.toLowerCase())){
                    this.receptions.push(el)
                } 
                else if (el.montant.toString() == searchString) {
                     this.receptions.push(el)
                }
                else if (el.exportateur.prenom.toLowerCase().includes(searchString.toLowerCase())){
                    this.receptions.push(el)
                } 
                else if (el.exportateur.telephone.toLowerCase().includes(searchString.toLowerCase())){
                    this.receptions.push(el)
                } 
                else if (el.exportateur.addresse.toLowerCase().includes(searchString.toLowerCase())){
                    this.receptions.push(el)
                } 
            })
        },
       refresh() {
            this.searchBool = false
            this.search = null
            this.getReceptionList()
        },
        searchByDate() {
            this.searchBoolStr = !this.searchBoolStr
            this.searchBoolDate = !this.searchBoolDate

        },
        cancelSearch() {

        },
        editRecep(recep) {
            console.log(recep)
            window.models.Transaction.findOne({
                _id: recep._id
            }, (err, doc) => {
                if (err) {
                    console.log(err)
                    return
                }
                doc.montant = this.currentRecep.montant
                doc.date = this.currentRecep.date
                doc.save((err, doc) => {
                    if (err) {
                        console.log(err)
                        return

                    }
                    console.log('modifier avec succes')
                    console.log(doc)
                })
            })
        },
        launchModal(mag, name) {

            if (!name) {
                let myModal = document.getElementById('magasinModal')
                const magasinModal = new bootstrap.Modal(myModal, {
                    keyboard: false
                })
                magasinModal.show()

            } else {
                let myModal = document.getElementById('updateModal')
                const updateModal = new bootstrap.Modal(myModal, {
                    keyboard: false
                })
                this.currentRecep = mag
                console.log(this.currentRecep)
                updateModal.show()

            }

        },

        infoRecep(recep) {
            this.modalAction = 'detail'
            this.currentRecep = recep
            this.launchModal()
        },
        deleteReception(recep, msg) {
            this.modalAction = 'delete'

            if (msg == 'warnDeletion') {
                this.modalText = "Vous êtes sur le point de supprimer une reception d'argent enregistré. êtes vous sur de vouloir le faire? cette action est irreversible"
                this.currentRecep = recep
                this.launchModal()
            } else if (!msg) {
                if (recep.exportateur) {
                    
                    this.operation.nom = 'delete'
                    window.models.Transaction.deleteOne({
                            _id: recep._id
                        })
                        .then((res) => {

                            console.log(res)
                            this.alertMessage = 'Reception supprimé avec succès.'
                            this.operation.status = true
                            this.getReceptionList()
                        })
                        .catch((err) => {
                            this.alertMessage = "Impossible de supprimer le reception une erreur s'est produite."
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
/* #list ul {
        position: relative;
} */
.list-group-item {
    text-align: center !important;
}

.bg-gray {
    background-color: rgb(238, 236, 236) !important;
}

.bg-half-transparent {
    background: linear-gradient(rgba(0, 0, 0, .03), rgba(0, 0, 0, .03)) !important;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: scale(0.6)
}

.slide-enter-to,
.slide-leave-from {
    transform: scale(1);
    opacity: 1;
}

.slide-enter-active {
    transition: all 0.5s ease;
    transform-origin: center;

}

.slide-leave-active {
    transform-origin: right;
    transition: all 0.5s ease;
    position: absolute;
}

.slide-move {
    transition: all 0.5s ease;

}
</style>
