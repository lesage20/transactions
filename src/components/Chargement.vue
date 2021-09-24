<template>
<div class="row bg-white p-4   shadow-sm">
    <div class="modal" tabindex="-1" id="ChargementModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Ajout de Chargement</h5>
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

    <h5 class="text-center">Ajouter un Chargement</h5>
    <div class="d-flex justify-content-center">
        <div class="btn-group text-center  ">
            <button class="btn btn-primary">Ajouter</button><button class="btn btn-success">Historique</button>
        </div>
    </div>
    <form @submit.prevent="createChargement">
        <div class="form-group p-2">
            <label for="nb_fiche">N° fiche de chargement </label>
            <input v-model="nb_fiche"  type="text" class="form-control" id="nb_fiche" placeholder="Entrez le numero de la fiche de chargement">
        </div>
        <div class="form-group p-2">
            <label for="date">Date de chargement</label>
            <input v-model="date" type="date" class="form-control" id="date" placeholder="Entrez la date de chargement">
        </div>
        <div class="form-group p-2">
            <label for="poid_brut">Poids brut du chargement (Kg)</label>
            <input v-model="poid_brut" type="number" class="form-control" id="poid_brut" placeholder="Entrez le poids brut du chargement en Kg">
        </div>
        <div class="form-group p-2">
            <label for="nb_sac">Nombre de sacs</label>
            <input v-model="nb_sac" type="number" class="form-control" id="nb_sac" placeholder="Entrez le nombre de sacs">
        </div>
        <div class="form-group p-2">
            <label for="poid_net">Poids net du chargement (Kg)</label>
            <input v-model="poid_net" type="number" class="form-control" id="poid_net" placeholder="Entrez le poids net du chargement en Kg">
        </div>
        <div class="form-group p-2">
            <label for="prix_kg">Prix par Kg (FCFA)</label>
            <input v-model="prix_kg" type="number" class="form-control" id="prix_kg" placeholder="Entrez le prix pour 1 Kg  en FCFA">
        </div>
        

        <div class="form-group p-2 d-flex justify-content-end">
            <div>
                <button type="submit" class="btn btn-success">Enregistrer Le chargement</button>
            </div>

        </div>
    </form>
</div>
</template>

<script>
const bootstrap = require('bootstrap')
export default {
    /* eslint-env mongoose */
    name: 'Chargement',
    data() {
        return {
            nb_fiche: null,
            date: null,
            poid_brut: null,
            nb_sac: null,
            poid_net: null,
            prix_kg: null,
            modalText: null,

        }
    },
    computed: {
        total () {
            return this.prix_kg * this.poid_net
        }
    },
    methods: {
        createChargement() {
            if ((this.poid_brut == 0) || (this.poid_brut == 0) || (this.nb_sac == 0) || 
                (this.poid_net == 0) || (this.prix_kg == 0)) {
                    this.modalText = 'Aucun champs ne peut contenir zero(0). Veuillez vérifier les informations renseignées et reessayez'
                    this.launchModal('echec')
                    return
                }

            window.models.Chargement.create({
                nb_fiche: this.nb_fiche,
                date: this.date,
                poid_brut: this.poid_brut ,
                nb_sac: this.nb_sac,
                poid_net: this.poid_net,
                prix_kg: this.prix_kg,
                prix_total: this.total
            }).then((res) => {
                console.log(res)

                this.modalText = 'Chargement crée avec succès'
                this.launchModal('succes')
                this.nb_fiche = null
                this.date = null
                this.poid_brut = 0
                this.nb_sac = 0
                this.poid_net = 0
                this.prix_kg = 0
                

            }).catch((err) => {
                console.log(err)
                this.modalText = 'Chargement non enregistré. Veuillez vérifier les informations renseignées et reessayez'
                this.launchModal('echec')
            })
        },
        launchModal(status) {
            var myModal = document.getElementById('ChargementModal')
            if (status == 'echec') {
                myModal.classList.add('text-danger')
                myModal.classList.remove('text-success')
            } else {
                myModal.classList.add('text-success')
                myModal.classList.remove('text-danger')
            }
            const ChargementModal = new bootstrap.Modal(myModal, {
                keyboard: false
            })
            ChargementModal.show()

        }
    }

}
</script>

<style scoped>
   
</style>