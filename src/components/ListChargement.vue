<template>
<div>
    <div id="context-menu">
        <div class="context-title text-center mb-2">
            <strong>Actions</strong>
            <hr style="padding: 2px; margin:1px">
        </div>
        <div class="item" @click="infoChgt(currentChgt)">
            <i class="bi bi-info-circle-fill"></i> Info
        </div>
        <div class="item" @click="launchModal(currentChgt, 'update')">
            <i class="bi bi-pencil-fill"></i> Modifier
        </div>
        <div class="item" @click="deleteChgt(currentChgt, 'warnDeletion')">
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
                    <form @submit.prevent>
                        <div class="form-group p-2">
                            <label for="nom">Nom </label>
                            <input v-model="currentChgt.nom" type="text" class="form-control" id="nom" aria-describedby="nameHelp" placeholder="Entrez le nom du magasin">
                        </div>

                        <div class="form-group p-2">
                            <label for="code">code du magasin</label>
                            <input v-model="currentChgt.code" type="text" class="form-control" id="code" placeholder="Entrez  le code du magasin">
                        </div>
                        <div class="form-group p-2">
                            <label for="ville">Ville du Magasin</label>
                            <input v-model="currentChgt.ville" type="text" class="form-control" id="ville" placeholder="Entrez la ville ou le magasin se situe">
                        </div>
                        <div class="form-group p-2">
                            <label for="addresse">Addresse du Magasin</label>
                            <input v-model="currentChgt.addresse" type="text" class="form-control" id="addresse" placeholder="Entrez l'addresse du magasin">
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
    <div class="modal fade" tabindex="-1" id="chargementModal">
        <div class="modal-dialog modal-dialog-centered ">
            <div class="modal-content">
                <div class="modal-header ">
                    <h4 class="modal-title ps-5 text-center text-info" v-if="modalAction=='detail'"><i class="bi bi-info-circle-fill text-info"></i> Détails </h4>
                    <h4 class="modal-title  text-center text-warning" v-if="modalAction=='delete'"> <i class="bi bi-exclamation-octagon-fill text-warning"></i> Supprimer </h4>
                    <h4 class="modal-title  text-center text-warning" v-if="modalAction=='avertissement'"> <i class="bi bi-exclamation-octagon-fill text-warning"></i> Avertissement </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row d-flex justify-content-around" v-if="modalAction=='detail'">
                        <div class="p-2  fs-3   rounded col-md-10">

                            <div class=" justify-content-center ">
                                <div class="">
                                    N° Fiche : {{currentChgt.nb_fiche}}
                                </div>

                                <div class="">
                                    Date : {{currentChgt.date.toLocaleDateString()}}
                                </div>
                                <div class="">
                                    Poid Brut : {{currentChgt.poid_brut}} Kg
                                </div>
                                <div class="">
                                    Poid Net : {{currentChgt.poid_net}} Kg
                                </div>
                                <div class="">
                                    Nombre de Sacs: {{currentChgt.nb_sac}}
                                </div>
                                <div class="" v-if="currentChgt.magasin">
                                    Magasin : {{currentChgt.magasin.nom}}
                                </div>
                                <div class="" v-if="currentChgt.pisteur">
                                    Pisteur: {{currentChgt.pisteur.nom}} {{currentChgt.pisteur.prenom}}
                                </div>
                                <div class="">
                                    Prix Total : {{currentChgt.prix_total}} FCFA
                                </div>
                                <div class="">
                                    benefice : {{currentChgt.benefice || 0}} FCFA
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
                    <button type="button" @click="deleteChgt(currentChgt)" data-bs-dismiss="modal" class="btn btn-danger px-2">Supprimer <i class="bi bi-trash-fill"></i> </button>
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
                <button @click="printDocument('list', 'chargements')" class="btn btn-secondary"><i class="bi bi-printer"></i></button>
                <button class="btn btn-warning" @click="refresh()">
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
                <button class="btn btn-light ">
                    Total: {{chargementCounter}}
                </button>
            </div>
        </div>
        <div>
            <div class="d-flex justify-content-center m-0 p pb-2">
                <div class="col-md-8  pe-0">
                    <transition enter-active-class="animate__animated animate__fadeInDown animate__faster" leave-active-class="animate__animated animate__fadeOutUp animate__faster" mode="out-in">
                        <div v-if="searchBool">
                            <input @keyup.enter="searchChargement(search)" v-model="search" type="text" name="search" id="search" class="form-control " placeholder="Rechechez un exportateur par son nom, prenom, addresse ou numero de telephone">
                        </div>
                    </transition>
                </div>
            </div>
            <div id="list">
                <table class="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>N° Fiche</th>
                            <th>Produit</th>
                            <th>Poid Net</th>
                            <th>Prix Total</th>
                            <th>Bénéfice</th>
                            <th>Magasin/Pisteur</th>
                            <th>Date</th>
                            <th>Status</th>

                        </tr>
                    </thead>
                    <transition-group tag="tbody" mode="out-in" name="slide">
                        <tr class="" v-for="(chgt, index) in chargements" :key="chgt.id" @dblclick="infoChgt(chgt)" @contextmenu="contextMenu($event, chgt)">
                            <th> {{index+1}}</th>
                            <td class="px-2">{{chgt.nb_fiche}} </td>
                            <td class="px-2">{{chgt.produit}} </td>
                            <td class="px-2">{{chgt.poid_net}} Kg</td>
                            <td class="px-2">{{chgt.prix_total}} FCFA</td>
                            <td class="px-2">{{chgt.benefice || 0}} FCFA</td>
                            <td class="px-2" v-if="chgt.magasin != undefined && chgt.magasin != null">{{chgt.magasin.nom}} (magasin) </td>
                            <td class="px-2" v-else>{{chgt.pisteur.nom}} {{chgt.pisteur.prenom}} (pisteur)</td>
                            <td class="px-2">{{chgt.date.toLocaleDateString()}}</td>
                            <td class="px-2">{{chgt.status}}</td>

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
            currentChgt: {
                date: new Date()
            },
            chargements: [],
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
        this.getChargementList()
        window.addEventListener('click', () => {
            document.getElementById("context-menu").classList.remove('active')
        })

    },
    computed: {
        chargementCounter() {
            return this.chargements
                .length
        },
        allChargement() {
            return this.chgtsForSearch
        }
    },
    methods: {
        contextMenu(event, chgt) {
            this.currentChgt = chgt
            //    this.context = true
            const context_menu = document.getElementById("context-menu")

            context_menu.style.top = event.target.getBoundingClientRect().top + event.offsetY + "px"
            context_menu.style.left = event.target.getBoundingClientRect().left + event.offsetX + "px"
            context_menu.classList.add('active')

        },
        refresh() {
            this.searchBool = false
            this.search = null
            this.getChargementList()

        },
        searchChargement(searchString) {
            console.log(searchString)
            let chgts = this.allChargement
            this.chargements = []
            chgts.forEach((el) => {
                console.log(el)
                if (el.nb_fiche.toLowerCase().includes(searchString.toLowerCase())) {
                    this.chargements.push(el)
                } else if (el.produit.toLowerCase().includes(searchString.toLowerCase())) {
                    this.chargements.push(el)
                } else if (el.status.toLowerCase().includes(searchString.toLowerCase())) {
                    this.chargements.push(el)
                } else if (el.poid_net.toString().includes(searchString.toLowerCase())) {
                    this.chargements.push(el)
                } else if (el.poid_brut.toString().includes(searchString.toLowerCase())) {
                    this.chargements.push(el)
                } else if (el.prix_total.toString().includes(searchString.toLowerCase())) {
                    this.chargements.push(el)
                } else if (el.benefice.toString().includes(searchString.toLowerCase())) {
                    this.chargements.push(el)
                }

                if (this.chargements.indexOf(el) == -1) {
                    if (el.magasin) {
                        if (el.magasin.nom.toLowerCase().includes(searchString.toLowerCase())) {
                            this.chargements.push(el)
                        }
                    }
                }
                if (this.chargements.indexOf(el) == -1) {

                    if (el.pisteur) {
                        if (el.pisteur.nom.toLowerCase().includes(searchString.toLowerCase())) {
                            this.chargements.push(el)
                        }
                    }
                }

            })
        },
        launchModal(chgt, name) {
            if (!name) {
                let myModal = document.getElementById('chargementModal')

                const produitModal = new bootstrap.Modal(myModal, {
                    keyboard: false
                })
                produitModal.show()

            } else {
                let myModal = document.getElementById('updateModal')
                const updateModal = new bootstrap.Modal(myModal, {
                    keyboard: false
                })
                this.currentChgt = chgt
                updateModal.show()

            }

        },

        infoChgt(chgt) {
            this.modalAction = 'detail'
            this.currentChgt = chgt
            if (this.currentChgt.magasin) {
                this.currentChgt.populate('magasin')
                    .then((res) => {
                        console.log(res)
                    })

            }
            this.launchModal()
        },
        deleteChgt(chgt, msg) {
            this.modalAction = 'delete'

            if (msg == 'warnDeletion') {
                this.modalText = 'Vous êtes sur le point de supprimer un chargement. êtes vous sur de vouloir le faire? cette action est irreversible'
                this.currentChgt = chgt
                this.launchModal()
            } else if (!msg) {
                if (chgt) {
                    if (chgt.status == 'livré') {
                        this.modalText = 'Ce chargement ne peut être supprimé car il a deja été livré'
                        this.launchModal()
                        return
                    }
                    this.operation.nom = 'delete'
                    window.models.Chargement.deleteOne({
                            _id: chgt._id
                        })
                        .then((res) => {

                            console.log(res)
                            this.alertMessage = 'Chargement supprimé avec succès.'
                            this.operation.status = true
                            this.getChargementList()
                        })
                        .catch((err) => {
                            this.alertMessage = "Impossible de supprimer le chargement une erreur s'est produite."
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

<style lang="css">
.list-group-item {
    text-align: center !important;
}

.bg-gray {
    background-color: rgb(238, 236, 236) !important;
}

#context-menu {
    position: fixed;
    width: 150px;
    z-index: 1000;
    background: rgba(44, 44, 44, 0.7);
    color: rgb(165, 165, 165);
    border-radius: 5px;
    padding: 5px;
    transform: scale(0);
    transform-origin: center;
    transition: position 100ms ease-in-out;

}

#context-menu.active {
    transform: scale(1);
    transition: transform 200ms ease-in-out;
}

#context-menu .item:hover {
    background: rgba(70, 69, 69, 0.9);
    cursor: pointer;
}
</style>
