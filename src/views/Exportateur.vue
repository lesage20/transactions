<template>
<div>
    <div class="row bg-white p-2 shadow-sm">
        <h5 class="text-center" v-if="action == 'ajouter'">Ajouter un Exportateur</h5>
        <h5 class="text-center" v-else>Liste des Exportateurs</h5>
        <div class="d-flex justify-content-center">
            <div class="btn-group text-center  ">
                <button @click="editAction('lister')" class="btn btn-primary">  Lister </button>
                <button @click="editAction('ajouter')" class="btn btn-success"> Ajouter </button> <!-- data-bs-toggle='collapse' data-bs-target='#Ajout' -->

            </div>
        </div>
    </div>

    <transition mode="out-in" enter-active-class="animate__animated animate__fadeIn animate__fast" leave-active-class="animate__animated animate__fadeOut animate__faster" >
        <div id="Lister" class=" row bg-white shadow-sm rounded-bottom p-2" v-if="action == 'lister'">
            <ListExportateur />
        </div>
        <div id="Ajout" class=" row bg-white shadow-sm rounded-bottom" v-else>
            <CreateExportateur />
        </div>
    </transition>

</div>
</template>

<script>
const bootstrap = require('bootstrap')
// const $ = require('jquery')
import CreateExportateur from '@/components/CreateExportateur.vue'
import ListExportateur from '@/components/ListExportateur.vue'
const ListsMixin
 = require('../mixins/lists').default

export default {
    /* eslint-env jQuery */
    name: 'Exportateur',
    mixins: [ListsMixin
],
    components: {
        CreateExportateur,
        ListExportateur,

    },
    data() {
        return {
            action: 'lister',
            show: false
        }
    },
    mounted() {
        this.getMagasinList()

    },
    methods: {

        editAction(action) {
            this.action = action
        },
        createExportateur() {
            if (this.magasin != null || Object.keys(this.magasin).length != 0) {
                window.models.Magasin.findOne({
                        nom: this.magasin
                    })
                    .then((doc) => {
                        doc.Exportateurs.push({
                            nom: this.nom,
                            prenom: this.prenom,
                            statut: this.statut,
                            nb_cni: this.nb_cni,
                            telephone: this.telephone
                        })
                        doc.save()
                            .then((res) => {
                                console.log(res)
                                this.modalText = 'Exportateur ajouté avec succès'
                                this.launchModal('succes')
                                this.nom = ''
                                this.prenom = ''
                                this.statut = ''
                                this.nb_cni = ''
                                this.telephone = ''

                            }).catch((err) => {
                                console.log(err)
                                this.modalText = "Le Exportateur n'a pas pu être ajoutée . veuillez vérifier les informations renseignées et reessayez"
                                this.launchModal('echec')
                            })
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            } else {
                window.models.Exportateur.create({
                    nom: this.nom,
                    prenom: this.prenom,
                    statut: this.statut,
                    nb_cni: this.nb_cni,
                    telephone: this.telephone
                }).then((res) => {
                    console.log(res)

                    this.modalText = 'Exportateur ajouté avec succès'
                    this.launchModal('succes')
                    this.nom = ''
                    this.prenom = ''
                    this.statut = ''
                    this.nb_cni = ''
                    this.telephone = ''

                }).catch((err) => {
                    console.log(err)
                    this.modalText = "Le Exportateur n'a pas pu être ajoutée . veuillez vérifier les informations renseignées et reessayez"
                    this.launchModal('echec')
                })
            }

        },
        launchModal(status) {
            var myModal = document.getElementById('ExportateurModal')
            if (status == 'echec') {
                myModal.classList.add('text-danger')
                myModal.classList.remove('text-success')
            } else {
                myModal.classList.add('text-success')
                myModal.classList.remove('text-danger')
            }
            const ExportateurModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            ExportateurModal.show()

        }
    }

}
</script>


<style>
.animate__animated.animate__zoomIn{
    animation-duration: 1s;
}
.animate__animated.animate__fadeOutDown{
    animation-duration: .7s;
}
</style>