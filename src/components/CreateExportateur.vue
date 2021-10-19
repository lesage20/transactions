<template>
<div id='Ajout' class="d-flex justify-content-center">
    <div class="modal" tabindex="-1" id="exportateurModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajout un Exportateur</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="alert">
                        {{modalText}}
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary px-2" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>

    <form @submit.prevent="createExportateur" class="d-flex justify-content-center flex-wrap col-md-5" >
        <div class="form-group p-2 col-md-12">
            <label for="nom">Nom </label>
            <input v-model="nom" type="text" class="form-control" id="nom" aria-describedby="nameHelp" placeholder="Entrez le nom du partenaire">
        </div>
        <div class="form-group p-2 col-md-12">
            <label for="prenom">Prenoms</label>
            <input v-model="prenom" type="text" class="form-control" id="prenom" placeholder="Entrez le/les prenom(s) du Exportateur">
        </div>
        <div class="form-group p-2 col-md-12">
            <label for="addresse">Addresse de l'exportateur</label>
            <input v-model="addresse" type="text" class="form-control" id="addresse" placeholder="Entrez  l'addresse de l'exportateur">
        </div>
        <div class="form-group p-2 col-md-12">
            <label for="telephone">Numero de telephone de l'exportateur</label>
            <input v-model="telephone" type="text" class="form-control" id="telephone" placeholder="Entrez le numero de telephone de l'exportateur">
        </div>

        <div class="form-group p-2 col-md-12 d-flex justify-content-end">
            <div>
                <button type="submit" class="btn btn-primary">Enregistrer <i class="bi bi-save2"></i></button>
            </div>

        </div>
    </form>
</div>
</template>

<script>
const bootstrap = require('bootstrap')
const ListsMixin
 = require('../mixins/lists').default
export default {
    /* eslint-env mongoose */
    name: 'Exportateur',
    mixins: [ListsMixin
],
    data() {
        return {
            nom: null,
            prenom: null,
            addresse: null,
            telephone: null,
            
            modalText: null,

        }
    },
    mounted() {
        this.getMagasinList()
        // console.log(this.magasins)
    },
    methods: {

        createExportateur() {

            window.models.Exportateur.create({
                nom: this.nom,
                prenom: this.prenom,
                solde: 0,
                addresse: this.addresse,
                telephone: this.telephone,
                util: false
            }).then((res) => {
                console.log(res)

                this.modalText = 'Exportateur ajouté avec succès'
                this.launchModal('succes')
                this.nom = ''
                this.prenom = ''
                this.addresse = ''
                this.telephone = ''

            }).catch((err) => {
                console.log(err)
                this.modalText = "L'exportateur n'a pas pu être ajoutée . veuillez vérifier les informations renseignées et reessayez"
                this.launchModal('echec')
            })

        },
        launchModal(status) {
            var myModal = document.getElementById('exportateurModal')
            if (status == 'echec') {
                myModal.classList.add('text-danger')
                myModal.classList.remove('text-success')
            } else {
                myModal.classList.add('text-success')
                myModal.classList.remove('text-danger')
            }
            const exportateurModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            exportateurModal.show()

        }
    }

}
</script>
