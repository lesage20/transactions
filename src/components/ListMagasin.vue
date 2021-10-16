<template>
<div>
     <div id="context-menu" >
        <div class="context-title text-center mb-2">
            <strong>Actions</strong>
            <hr style="padding: 2px; margin:1px">
        </div>
        <div class="item" @click="infoMag(currentMag)">
            <i class="bi bi-info-circle-fill"></i>  Info
        </div>
        <div class="item" @click="launchModal(currentMag, 'update')">
            <i class="bi bi-pencil-fill"></i>  Modifier
        </div>
        <div class="item" @click="deleteMagasin(currentMag, 'warnDeletion')">
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
                            <label for="nom">Nom </label>
                            <input v-model="currentMag.nom" type="text" class="form-control" id="nom" aria-describedby="nameHelp" placeholder="Entrez le nom du magasin">
                        </div>

                        <div class="form-group p-2">
                            <label for="code">code du magasin</label>
                            <input v-model="currentMag.code" type="text" class="form-control" id="code" placeholder="Entrez  le code du magasin">
                        </div>
                        <div class="form-group p-2">
                            <label for="ville">Ville du Magasin</label>
                            <input v-model="currentMag.ville" type="text" class="form-control" id="ville" placeholder="Entrez la ville ou le magasin se situe">
                        </div>
                        <div class="form-group p-2">
                            <label for="addresse">Addresse du Magasin</label>
                            <input v-model="currentMag.addresse" type="text" class="form-control" id="addresse" placeholder="Entrez l'addresse du magasin">
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" @click.prevent="editMag(currentMag)" class="btn btn-primary">Modifier <i class="bi bi-pencil-square"></i></button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" tabindex="-1" id="magasinModal">
        <div class="modal-dialog modal-dialog-centered modal-lg">

            <div class="modal-content">
                <div class="modal-header ">
                    <h4 class="modal-title ps-5 text-center" v-if="modalAction=='detail'">Détails "{{currentMag.nom}}" </h4>
                    <h4 class="modal-title  text-center text-warning" v-if="modalAction=='delete'"> <i class="bi bi-exclamation-octagon-fill text-warning"></i> Supprimer un Magasin </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row d-flex justify-content-start" v-if="modalAction=='detail'">
                        <div class="p-2   bg-half-transparent border-primary border-start border-4  mb-3 rounded-end fs-4">
                            <h5 class="mt-1">
                                Informations basics
                            </h5>
                            <hr>
                            <p>
                                Nom : {{currentMag.nom}} <br>
                                Code : {{currentMag.code}}<br>
                                Addresse: {{currentMag.addresse}} <br>
                                Ville: {{currentMag.ville}} <br>
                                Nombre de pisteurs : {{currentMag.pisteurs.length}} <br>
                                Nombre de gerant : {{currentMag.gerants.length}}<br>
                                Solde: {{currentMag.solde}} FCFA <br>
                            </p>
                        </div>

                        <div class="    text-start  p-2 rounded col-md-5 ">
                            <h5 class=" text- mt-1">
                                Informations Gerant
                            </h5>
                            <hr>
                            <p v-for="gerant in currentMag.gerants" :key='gerant.nom'>
                                Nom : {{gerant.nom}} <br>
                                prenom : {{gerant.prenom}}<br>
                                Telephone : {{gerant.telephone}} <br>

                            </p>
                        </div>
                        <div class="p-2 text-start   rounded col-md-6 ">
                            <h5 class=" mt-1 ">
                                Liste des pisteurs
                            </h5>
                            <hr>
                            <ol class="list-group list-group-flush mt-2 text-center">
                                <li class="list-group-item d-flex justify-content-center align-items-start   " v-for="pisteur in currentMag.pisteurs" :key='pisteur.nom'>
                                    <div class="">
                                        {{pisteur.nom}} {{pisteur.prenom}} {{pisteur.telephone}}
                                    </div>
                                </li>
                            </ol>
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
                    <button type="button" @click="deleteMagasin(currentMag)" data-bs-dismiss="modal" class="btn btn-danger px-2">Supprimer <i class="bi bi-trash-fill"></i> </button>
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
                <button @click="printDocument('list', 'magasins')" class="btn btn-secondary"><i class="bi bi-printer"></i></button>
                <button class="btn btn-warning" @click="refresh()">
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button class="btn btn-light ">
                    Total: {{MagasinCounter}}
                </button>
            </div>
        </div>
        <div>
            <div>
                <div class="d-flex justify-content-center m-0 p pb-2">
                    <div class="col-md-8  pe-0">
                        <transition enter-active-class="animate__animated animate__fadeInDown animate__faster" leave-active-class="animate__animated animate__fadeOutUp animate__faster" mode="out-in">
                            <div v-if="searchBool">
                                <!-- <small>Rechechez un magasin par son nom, code, gerant (nom, prenom, numero) ou pisteur (nom, prenom, numero)</small> -->
                                <input @keyup.enter="getMagasinList(search)" v-model="search" type="text" name="search" id="search" class="form-control " placeholder="Rechechez un magasin par son nom, code, gerant (nom, prenom, numero) ou pisteur (nom, prenom, numero)">
                            </div>
                        </transition>
                    </div>
                </div>
            </div>

            <div id="list">
                <table class="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nom</th>
                            <th scope="col">Code</th>
                            <th scope="col">Ville</th>
                            <th scope="col">Addresse</th>
                            <th scope="col">Solde</th>
                            
                        </tr>
                    </thead>
                    <transition-group tag="tbody" mode="out-in" name="slide">
                        <tr v-for="(mag, index) in magasins" :key="mag.nom" @dblclick="infoMag(mag)"  @contextmenu="contextMenu($event, mag)">
                            <th scope="row">{{index+1}}</th>
                            <td class="col-md-3">{{mag.nom}}</td>
                            <td class="col-md-2">{{mag.code}}</td>
                            <td class="col-md-2">{{mag.ville}}</td>
                            <td class="col-md-2">{{mag.addresse}}</td>
                            <td class="col-md-2">{{mag.solde}} FCFA</td>
                            
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
            currentMag: {
                pisteurs: [],
                gerants: []
            },
            searchBool: false,
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
        this.getMagasinList()
        window.addEventListener('click', ()=>{
            document.getElementById("context-menu").classList.remove('active')
        })
    },
    computed: {
        currentMagPistCounter() {
            if (this.currentMag) {
                return this.currentMag.pisteurs.length
            } else {
                return 0
            }
        },
        MagasinCounter() {
            return this.magasins.length
        }
    },
    methods: {
        contextMenu(event, mag) {

            this.currentMag = mag
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
            this.getMagasinList()
        },
        editMag(mag) {
            window.models.Magasin.findOne({
                _id: mag._id
            }, (err, doc) => {
                if (err) {
                    console.log(err)
                    return
                }
                doc.nom = this.currentMag.nom
                doc.prenom = this.currentMag.code
                doc.save((err) => {
                    if (err) {
                        console.log(err)
                        return

                    }
                    console.log('modifier avec succes')
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
                this.currentMag = mag
                updateModal.show()

            }

        },

        infoMag(mag) {
            this.modalAction = 'detail'
            this.currentMag = mag
            this.launchModal()
        },
        deleteMagasin(mag, msg) {
            this.modalAction = 'delete'

            if (msg == 'warnDeletion') {
                this.modalText = 'Vous êtes sur le point de supprimer un magasin. êtes vous sur de vouloir le faire? cette action est irreversible'
                this.currentMag = mag
                this.launchModal()
            } else if (!msg) {
                
                if (mag.nom) {
                    if (mag.util) {
                        this.modalText = 'Ce Magasin ne peut être supprimé une ou plusieurs operations dépendent   de ce magasin'
                        
                        this.launchModal()
                        return
                    }
                    this.operation.nom = 'delete'
                    window.models.Magasin.deleteOne({
                            _id: mag._id
                        })
                        .then(() => {

                            this.alertMessage = 'Magasin supprimé avec succès.'
                            this.operation.status = true
                            this.getMagasinList()
                        })
                        .catch((err) => {
                            this.alertMessage = "Impossible de supprimer le magasin une erreur s'est produite."
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
    transition: all 0.8s ease;
    transform-origin: center;

}

.slide-leave-active {
    transform-origin: right;
    transition: all 0.8s ease;
    position: absolute;
}

.slide-move {
    transition: all 0.5s ease;
}
</style>
