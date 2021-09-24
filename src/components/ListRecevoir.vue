<template>
<div>
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
                            <input v-model="currentRecep.montant" type="number" class="form-control" id="nom" aria-describedby="nameHelp" placeholder="Entrez le nom du magasin">
                        </div>

                        <div class="form-group p-2">
                            <label for="code">code du magasin</label>
                            <input v-model="currentRecep.date" type="date" class="form-control" id="code" placeholder="Entrez  le code du magasin">
                        </div>

                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
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
                                exportateur: {{currentRecep.export}} <br>
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
                <div class="d-flex justify-content-between m-0 pe-5 py-0">
                    <div class="col-md-4">
                        <div>
                            <small>Rechechez un magasin par son nom, code, gerant (nom, prenom, numero) ou pisteur (nom, prenom, numero)</small>
                            <input @keyup.enter="getReceptionList(search)" v-model="search" type="text" name="search" id="search" class="form-control " placeholder="Rechercher un exportateur ...">

                        </div>

                    </div>
                    <div class="col-md-4">
                        <small>Rechechez un magasin selon la date a laquelle vous l'avez ajouter ou modifier</small>
                        <input @change="getReceptionList(searchDate)" v-model="searchDate" type="date" name="search-by-date" id="search-by-date" class="form-control " placeholder="Rechercher un exportateur ..">

                    </div>
                    <div class="col-md-2">

                        <button class="btn btn-outline-secondary mt-5" @click="printReceptionList()">
                            annuler
                        </button>
                    </div>
                    <div class="mt-5">
                        <p class="mt-3">
                            Total: {{ReceptionCounter}}
                        </p>
                    </div>
                </div>
            </div>
            <div id="list">

                <li class="list-group-item d-flex justify-content-between align-items-start bg-light">
                    <div class="p-3 me-auto d-flex col-md-10 justify-content-start text-start">
                        <div class="col-md-4 border-end px-2 fs-5 border-end">Nom et Prenom exp</div>

                        <div class="col-md-3 px-2 fs-5 border-end">Montant</div>

                        <div class="col-md-3 px-2 fs-5 border-end">Date</div>

                    </div>
                    <div class="p-3 col-md-2 ">
                        <div class="text-center px-2 fs-5">
                            Actions
                        </div>

                    </div>
                </li>
                <transition-group tag="ul" mode="out-in" name="slide" class="list-group list-group-flush mt-2 border rounded">

                    <li class="list-group-item d-flex justify-content-between align-items-start " v-for="recep in receptions" :key="recep._id" @dblclick="infoRecep(recep)">
                        <div class="p-3 me-auto d-flex col-md-10 justify-content-start text-start">
                            <div class="col-md-4  px-2 fs-5 ">{{ recep.export }} </div>

                            <div class="col-md-3 px-2 fs-5 ">{{recep.montant}}</div>

                            <div class="col-md-3 px-2 fs-5 ">{{recep.date.toLocaleDateString()}}</div>
                        </div>
                        <div class="d-flex p-2">
                            <div class="mx-1">
                                <button @click="infoRecep(recep)" class="btn text-info">
                                    <i class="bi bi-info-circle"></i>
                                </button>
                            </div>
                            <div class="mx-1">
                                <button @click="launchModal(recep, 'update')" class="btn text-primary">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                            </div>
                            <div class="mx-1">
                                <button @click="deleteReception(recep, 'warnDeletion')" class="btn text-danger">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </li>
                </transition-group>
            </div>

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
            currentRecep: {},
            modalAction: 'detail',
            modalText: '',
            operationSucceded: false,
            alertMessage: null,
            operation: {
                name: '',
                status: false
            },
            receptions: [],
        }
    },
    created() {
        this.getReceptionList()
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
        }
    },
    methods: {
        printReceptionList() {
            var prtContent = document.getElementById("list");
            var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
            WinPrint.document.write(prtContent.innerHTML);
            WinPrint.document.close();
            WinPrint.focus();
            WinPrint.print();
            WinPrint.close();
        },
        getReceptionList(searchString) {
            if (!searchString) {
                window.models.Transaction.find({
                        type: "reception"
                    })
                    .populate({
                        path: 'exportateur',
                        model: window.models.Exportateur
                    })
                    .exec((err, docs) => {
                        if (err) {
                            console.log(err)
                            return
                        }
                        docs.forEach(element => {
                            element.export = docs[0].exportateur.nom + ' ' + docs[0].exportateur.prenom
                        });
                        this.receptions = docs
                        console.log("liste d'receptions recuperée avec succès", docs[0])
                    })

            } else {
                let isDate = "Invalid Date"
                if (searchString.length > 4) {
                    isDate = new Date(searchString)
                }

                if (isDate != "Invalid Date") {

                    let DateStart = new Date(searchString + "T00:00:00.015Z").toISOString()
                    let DateEnd = new Date(searchString + "T23:59:59.999Z").toISOString()
                    window.models.Transaction.find({
                            date: {
                                "$gte": DateStart,
                                "$lte": DateEnd
                            },
                            type: "reception"
                        })
                        .then((res) => {
                            if (res.length) {
                                this.receptions = res

                                console.log("liste de receptions récupérée")
                            } else {
                                alert("Aucune somme recue le " + isDate.toLocaleDateString())
                            }

                        })
                        .catch((err) => {
                            console.log(err)

                        })
                } else {
                    window.models.Transaction.find({
                            $text: {
                                $search: searchString
                            },

                        })
                        .then((res) => {
                            this.exportateurs = res
                            console.log("liste d'exportateurs recuperée avec succès")

                        })
                        .catch((err) => {
                            console.log(err)

                        })
                }
            }
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
