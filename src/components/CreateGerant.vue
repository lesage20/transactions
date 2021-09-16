<template>
<div >
    <div class="modal" tabindex="-1" id="gerantModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajouter un gerant</h5>
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
   
    <form @submit.prevent="createGerant">
        <div class="form-group p-2">
            <label for="nom">Nom </label>
            <input v-model="nom" type="text" class="form-control" id="nom" aria-describedby="nameHelp" placeholder="Entrez le nom du partenaire">
        </div>
        <div class="form-group p-2">
            <label for="prenom">Prenoms</label>
            <input v-model="prenom" type="text" class="form-control" id="prenom" placeholder="Entrez le/les prenom(s) du gerant">
        </div>
       
        <div class="form-group p-2">
            <label for="telephone">Numero de telephone du gerant</label>
            <input v-model="telephone" type="text" class="form-control" id="telephone" placeholder="Entrez le numero de telephone du gerant">
        </div>
        <div class="form-group p-2">

            <label for="magasin">Magasin</label>
            <select v-model="magasin" name="magasin" id="magasin" class="form-select text-muted">
                <option :value="mag.nom" v-for="mag in magasins" :key="mag.id">{{ mag.nom }}</option>
            </select>
        </div>
 


        <div class="form-group p-2 d-flex justify-content-end">
            <div>
                <button type="submit" class="btn btn-success">Enregistrer</button>
            </div>
        </div>
    </form>
</div>
</template>

<script>
const bootstrap = require('bootstrap')
const MagasinMixin = require('../mixins/magasin').default
export default {
    /* eslint-env mongoose */
    name: 'gerant',
    mixins: [MagasinMixin],
    data() {
        return {
            nom: null,
            prenom: null,
            magasin: null,
            telephone: null,
            statut: "independant",
            magasins: [],
            modalText: null,

        }
    },
    mounted() {
        this.getMagasinList()
        // console.log(this.magasins)
    },
    methods: {

        createGerant() {
                window.models.Magasin.findOne({
                        nom: this.magasin
                    })
                    .then((doc) => {
                        doc.gerants.push({
                                nom: this.nom,
                                prenom: this.prenom,
                                telephone: this.telephone
                            })
                            doc.save()
                            .then((res) => {
                                console.log(res)
                                this.modalText = 'Gerant ajouté avec succès'
                                this.launchModal('succes')
                                this.nom = ''
                                this.prenom = ''
                                this.statut = ''
                                this.nb_cni = ''
                                this.telephone = ''

                            }).catch((err) => {
                                console.log(err)
                                this.modalText = "Le gerant n'a pas pu être ajoutée . veuillez vérifier les informations renseignées et reessayez"
                                this.launchModal('echec')
                            })
                    })
                    .catch((error)=>{
                        console.log(error)
                    })

            
        },
        launchModal(status) {
            var myModal = document.getElementById('gerantModal')
            if (status == 'echec') {
                myModal.classList.add('text-danger')
                myModal.classList.remove('text-success')
            } else {
                myModal.classList.add('text-success')
                myModal.classList.remove('text-danger')
            }
            const gerantModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            gerantModal.show()

        }
    }

}
</script>
