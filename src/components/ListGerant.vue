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
                            <input v-model="currentGer.nom" type="text" class="form-control" id="nom" aria-describedby="nameHelp" placeholder="Entrez le nom de l'exportateur">
                        </div>
                        <div class="form-group p-2">
                            <label for="prenom">Prenoms</label>
                            <input v-model="currentGer.prenom" type="text" class="form-control" id="prenom" placeholder="Entrez le/les prenom(s) de l'exportateur">
                        </div>
                        <div class="form-group p-2">
                            <label for="addresse">Addresse de l'exportateur</label>
                            <input v-model="currentGer.addresse" type="text" class="form-control" id="addresse" placeholder="Entrez  l'addresse de l'exportateur">
                        </div>
                        <div class="form-group p-2">
                            <label for="telephone">Numero de telephone de l'exportateur</label>
                            <input v-model="currentGer.telephone" type="text" class="form-control" id="telephone" placeholder="Entrez le numero de telephone de l'exportateur">
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
    <div class="modal fade" tabindex="-1" id="gerantModal">
        <div class="modal-dialog modal-dialog-centered modal-lg">

            <div class="modal-content">
                <div class="modal-header ">
                    <h4 class="modal-title  text-center text-primary" v-if="modalAction=='detail'"> <i class="bi bi-info-circle-fill text-info"></i> Détails Pisteur: {{currentGer.nom}} {{currentGer.prenom}} </h4>
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
                                N° CNI : {{currentGer.nb_cni}}
                            </div>
                            <div>
                                Telephone : {{currentGer.telephone}}
                            </div>
                            <div>
                                Statut : {{currentGer.statut}}
                            </div>
                            <div v-if="currentGer.statut == 'dependant'">
                                magasin: {{currentGer.magasin}}
                            </div>
                            <div>
                                Solde: {{currentGer.solde}} FCFA
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
                    <button type="button" @click="deletePisteur(currentGer)" data-bs-dismiss="modal" class="btn btn-danger px-2">Supprimer <i class="bi bi-trash-fill"></i> </button>
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
        <div class="d-flex justify-content-between m-0 pe-5 py-0">
                <div class="col-md-3">
                    <div>
                    <small >Rechechez un exportateur par son nom, prenom, addresse ou numero de telephone</small>
                        <input @keyup="getExportateurList(search)" v-model="search" type="text" name="search" id="search" class="form-control " placeholder="Rechercher un exportateur ...">

                    </div>

                </div>
                <div class="col-md-3">
                    <small >Rechechez un exportateur selon la date a laquelle vous l'avez ajouter</small>
                    <input @change="getExportateurList(searchDate)" v-model="searchDate" type="date" name="search-by-date" id="search-by-date" class="form-control " placeholder="Rechercher un exportateur ..">

                </div>
                <div>
                    <p>
                        Total: {{gerantCounter}}
                    </p>
                </div>
            </div>

        <ol class="list-group list-group-flush mt-2 ">

            <li class="list-group-item d-flex justify-content-between align-items-start bg-light" v-for="pist in gerants" :key="pist.nom">
                <div class="p-3 me-auto">
                    {{pist.nom}} {{pist.prenom}}

                </div>
                <div class="d-flex p-2">
                    <div class="mx-1">
                        <button @click="infoPisteur(pist)" class="btn text-info">
                            <i class="bi bi-info-circle"></i>
                        </button>
                    </div>
                    <div class="mx-1">
                        <button class="btn text-primary">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                    </div>
                    <div class="mx-1">
                        <button @click="deletePisteur(pist, 'warnDeletion')" class="btn text-danger">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </li>

        </ol>
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
            currentGer: {},
            gerants: [],
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
        setTimeout(() => {
        this.getGerantList()
        },150)
    },
    computed: {
        gerantCounter() {
            return this.gerants.length
        }
    },
    methods: {
        getGerantList() {            
                 this.magasins.forEach((el) => {
                    el.gerants.forEach((ger) => {
                        this.gerants.push(ger)
                    })
                    
                })
                this.gerants.forEach((el) => {
                    console.log(el)
                })
            

        },
        launchModal() {
            var myModal = document.getElementById('gerantModal')

            const gerantModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            gerantModal.show()

        },
        hideModal() {
            var myModal = document.getElementById('gerantModal')

            const gerantModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            gerantModal.hide()

        },
        infoPisteur(pist) {
            this.modalAction = 'detail'

            this.currentGer = pist
            this.launchModal()
        },
        deletePisteur(pist, msg) {
            this.modalAction = 'delete'

            if (msg == 'warnDeletion') {
                this.modalText = 'Vous êtes sur le point de supprimer un pisteur. êtes vous sur de vouloir le faire? cette action est irreversible'
                this.currentGer = pist
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
                            this.getGerantList()
                        })
                        .catch((err) => {
                            this.alertMessage = "Impossible de supprimer le pisteur une erreur s'est produite."
                            console.log(err)
                            this.operation.status = true
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
                                    this.getGerantList()
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
