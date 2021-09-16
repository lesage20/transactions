<template>
<div >
    

    <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modifier</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="recipient-name" class="col-form-label">Recipient:</label>
                            <input type="text" class="form-control" id="recipient-name">
                        </div>
                        <div class="mb-3">
                            <label for="message-text" class="col-form-label">Message:</label>
                            <textarea class="form-control" id="message-text"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Send message</button>
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
        <div>
            <div class="d-flex justify-content-end m-0 px-5 py-0">
                <div>
                    <p>
                        Total: {{exportateurCounter}}
                    </p>
                </div>
            </div>
            <ol class="list-group list-group-flush mt-2 ">

                <li class="list-group-item d-flex justify-content-between align-items-start bg-light" v-for="exp in exportateurs" :key="exp.nom">
                    <div class="p-3 me-auto">
                        {{exp.nom}} {{exp.prenom}}

                    </div>
                    <div class="d-flex p-2">
                        <div class="mx-1">
                            <button @click="infoExportateur(exp)" class="btn text-info">
                                <i class="bi bi-info-circle"></i>
                            </button>
                        </div>
                        <div class="mx-1">
                            <button class="btn text-primary">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </div>
                        <div class="mx-1">
                            <button @click="deleteExportateur(exp, 'warnDeletion')" class="btn text-danger">
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
    created() {
        this.getExportateurList()
    },
    computed: {
        exportateurCounter() {
            return this.exportateurs.length
        }
    },
    methods: {

        launchModal(name) {
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
                window.models.Exportateur.deleteOne({
                        nom: exp.nom
                    })
                    .then((res) => {
                        this.hideModal()
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
</style>
