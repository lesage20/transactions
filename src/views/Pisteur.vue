<template>
<div>
    <div class="row bg-white p-4  rounded-top shadow-sm">
        <h5 class="text-center" v-if="action == 'ajouter'">Ajouter un Pisteur</h5>
        <h5 class="text-center" v-else>Liste des pisteurs</h5>
        <div class="d-flex justify-content-center">
            <div class="btn-group text-center">
                <button @click="editAction('lister')" class="btn btn-primary">  Lister </button>
                <button @click="editAction('ajouter')" class="btn btn-success"> Ajouter </button> <!-- data-bs-toggle='collapse' data-bs-target='#Ajout' -->
            </div>
        </div>

    </div>

    <transition mode="out-in" enter-active-class="animate__animated animate__fadeIn animate__fast" leave-active-class="animate__animated animate__fadeOut animate__faster" >
        <div id="Ajout" class=" row bg-white shadow-sm rounded-bottom" v-if="action == 'ajouter'">
            <CreatePisteur />
        </div>

        <div id="Lister" class=" row bg-white shadow-sm rounded-bottom p-2" v-else>
            <ListPisteur />
        </div>
    </transition>
</div>
</template>

<script>
const bootstrap = require('bootstrap')
import CreatePisteur from '@/components/CreatePisteur.vue'
import ListPisteur from '@/components/ListPisteur.vue'
const ListsMixin
 = require('../mixins/lists').default
export default {
    /* eslint-env mongoose */
    name: 'Pisteur',
    mixins: [ListsMixin
],
    components: {
        CreatePisteur,
        ListPisteur
    },
    data() {
        return {
            nom: null,
            prenom: null,
            nb_cni: null,
            telephone: null,
            statut: "independant",
            magasin: null,
            magasins: [],
            modalText: null,
            action: 'lister'

        }
    },
    mounted() {
        this.getMagasinList()
        // console.log(this.magasins)
    },
    methods: {
        editAction(action) {
            this.action = action
        },
        createPisteur() {
            if (this.magasin != null || Object.keys(this.magasin).length != 0) {
                window.models.Magasin.findOne({
                        nom: this.magasin
                    })
                    .then((doc) => {
                        doc.pisteurs.push({
                            nom: this.nom,
                            prenom: this.prenom,
                            statut: this.statut,
                            nb_cni: this.nb_cni,
                            telephone: this.telephone
                        })
                        doc.save()
                            .then((res) => {
                                console.log(res)
                                this.modalText = 'Pisteur ajouté avec succès'
                                this.launchModal('succes')
                                this.nom = ''
                                this.prenom = ''
                                this.statut = ''
                                this.nb_cni = ''
                                this.telephone = ''

                            }).catch((err) => {
                                console.log(err)
                                this.modalText = "Le pisteur n'a pas pu être ajoutée . veuillez vérifier les informations renseignées et reessayez"
                                this.launchModal('echec')
                            })
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            } else {
                window.models.Pisteur.create({
                    nom: this.nom,
                    prenom: this.prenom,
                    statut: this.statut,
                    nb_cni: this.nb_cni,
                    telephone: this.telephone
                }).then((res) => {
                    console.log(res)

                    this.modalText = 'Pisteur ajouté avec succès'
                    this.launchModal('succes')
                    this.nom = ''
                    this.prenom = ''
                    this.statut = ''
                    this.nb_cni = ''
                    this.telephone = ''

                }).catch((err) => {
                    console.log(err)
                    this.modalText = "Le pisteur n'a pas pu être ajoutée . veuillez vérifier les informations renseignées et reessayez"
                    this.launchModal('echec')
                })
            }

        },
        launchModal(status) {
            var myModal = document.getElementById('pisteurModal')
            if (status == 'echec') {
                myModal.classList.add('text-danger')
                myModal.classList.remove('text-success')
            } else {
                myModal.classList.add('text-success')
                myModal.classList.remove('text-danger')
            }
            const PisteurModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            PisteurModal.show()

        }
    }

}
</script>
