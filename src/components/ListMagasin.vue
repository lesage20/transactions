<template>
<div>
    <div class="modal fade" tabindex="-1" id="magasinModal">
        <div class="modal-dialog modal-dialog-centered modal-lg">

            <div class="modal-content">
                <div class="modal-header ">
                    <h4 class="modal-title ps-5 text-center" v-if="modalAction=='detail'">Détails "{{currentMag.nom}}" </h4>
                    <h4 class="modal-title  text-center text-warning" v-if="modalAction=='delete'"> <i class="bi bi-exclamation-octagon-fill text-warning"></i> Supprimer un Magasin </h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row d-flex justify-content-around" v-if="modalAction=='detail'">
                        <div class="p-2  bg-gray  text-center rounded col-md-5">
                            <h5 class="text-center mt-1">
                                Informations basics
                            </h5>
                            <hr>
                            <p>
                                Nom : {{currentMag.nom}} <br>
                                Code : {{currentMag.code}}<br>
                                Nombre de pisteurs : {{currentMag.pisteurs.length}} <br>
                                Nombre de gerant : {{currentMag.gerants.length}}<br>
                                Solde: {{currentMag.solde}} FCFA
                            </p>
                        </div>

                        <div class="  text-center bg-gray p-2 rounded col-md-5 ">
                            <h5 class="text-center text- mt-1">
                                Informations Gerant
                            </h5>
                            <hr>
                            <p v-for="gerant in currentMag.gerants" :key='gerant.nom'>
                                Nom : {{gerant.nom}} <br>
                                prenom : {{gerant.prenom}}<br>
                                Telephone : {{gerant.telephone}} <br>

                            </p>
                        </div>
                        <div class="p-2 text-center bg-gray  rounded col-md-11 my-2">

                            <h5 class="text-center  mt-1 ">
                                Liste des pisteurs
                            </h5>
                            <hr>
                            <ol class="list-group list-group-flush mt-2 text-center">

                                <li class="list-group-item d-flex justify-content-center align-items-start bg-gray  " v-for="pisteur in currentMag.pisteurs" :key='pisteur.nom'>
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
        <div>
            <div class="d-flex justify-content-end m-0 px-5 py-0">
                <div>
                    Total: {{MagasinCounter}}
                </div>
            </div>
            <ol class="list-group list-group-flush mt-2 ">

                <li class="list-group-item d-flex justify-content-between align-items-start bg-light" v-for="mag in magasins" :key="mag.nom">
                    <div class="p-3 me-auto">
                        {{mag.nom}}

                    </div>
                    <div class="d-flex p-2">
                        <div class="mx-1">
                            <button @click="infoMagasin(mag)" class="btn text-info">
                                <i class="bi bi-info-circle"></i>
                            </button>
                        </div>
                        <div class="mx-1">
                            <button class="btn text-primary">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </div>
                        <div class="mx-1">
                            <button @click="deleteMagasin(mag, 'warnDeletion')" class="btn text-danger">
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
            currentMag: {
                pisteurs: [],
                gerants: []
            },
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
        launchModal() {
            var myModal = document.getElementById('magasinModal')

            const magasinModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            magasinModal.show()

        },
        hideModal() {
            var myModal = document.getElementById('magasinModal')

            const magasinModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            magasinModal.hide()

        },
        infoMagasin(mag) {
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
                    this.operation.nom = 'delete'
                    window.models.Magasin.deleteOne({
                            nom: mag.nom
                        })
                        .then((res) => {
                            this.hideModal()
                            console.log(res)
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

<style lang="css" scoped>
.list-group-item {
    text-align: center !important;
}

.bg-gray {
    background-color: rgb(238, 236, 236) !important;
}
</style>
