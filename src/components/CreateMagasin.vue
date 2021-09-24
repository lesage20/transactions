<template>
<div >
    <div class="modal" tabindex="-1" id="magasinModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajout de Magasin</h5>
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
    <form @submit.prevent>
        <div class="form-group p-2">
            <label for="name">Nom </label>
            <input v-model="nom" type="text" class="form-control" id="name" aria-describedby="nameHelp" placeholder="Entrez le nom du magazin">
        </div>
        <div class="form-group p-2">
            <label for="code">Code du Magasin</label>
            <input v-model="code" type="text" class="form-control" id="code" placeholder="Entrez le code du magasin">
        </div>
        <div class="form-group p-2">
            <label for="ville">Ville du Magasin</label>
            <input v-model="ville" type="text" class="form-control" id="ville" placeholder="Entrez la ville ou le magasin se situe">
        </div>
        <div class="form-group p-2">
            <label for="addresse">Addresse du Magasin</label>
            <input v-model="addresse" type="text" class="form-control" id="addresse" placeholder="Entrez l'addresse du magasin">
        </div>

        <div class="form-group p-2 d-flex justify-content-end">
            <div>
                <button @click.prevent="createMagasin" type="submit"  class="btn btn-success">Enregistrer le magasin</button>
            </div>

        </div>
    </form>
</div>
</template>

<script>
const bootstrap = require('bootstrap')
export default {
    /* eslint-env mongoose */
    name: 'CreateMagasin',
    data() {
        return {
            nom: null,
            code: null,
            ville: null,
            addresse: null,
            // nb_pisteur: 0,
            modalText: null,
            

        }
    },

    methods: {
        
        createMagasin() {

            window.models.Magasin.create({
                nom: this.nom,
                ville: this.ville,
                code: this.code,
                addresse: this.addresse,
                solde: 0
            }).then((res) => {
                console.log(res)

                this.modalText = 'Magasin crée avec succès'
                this.launchModal('succes')
                this.nom = ''
                this.code = ''


            }).catch((err) => {
                console.log(err)
                this.modalText = 'La creation du magasin a echoué. veuillez verifier les informations renseignées et reessayez'
                this.launchModal('echec')
            })
        },
        launchModal(status) {
            var myModal = document.getElementById('magasinModal')
            if (status=='echec') {
                myModal.classList.add('text-danger')
                myModal.classList.remove('text-success')
            }
            else {
                myModal.classList.add('text-success')
                myModal.classList.remove('text-danger')
            }
            const magasinModal = new bootstrap.Modal(myModal, {
            keyboard: false
            })
            magasinModal.show()
            
        }
    }

}
</script>
