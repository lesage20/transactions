<template>
<div class="col-md-12 ">
    <div>
        
    </div>
    <div class="row d-flex justify-content-center my-2 g-2">
        <div class="card col-md-5 mx-1">
            <div class="card-title text-center fs-5"> 
                <h1 class="h5 fs-5"> Montant total dans la caisse
                </h1> 
                <hr>
            </div>
            <div class="card-body text-center animate__animated animate__bounce">
                <h1 class="text-success">{{$store.state.solde_principal}} FCFA</h1>
            </div>
        </div>
        <div class="card col-md-5 mx-1 text-center">
            <div class="card-title text-center fs-5"> 
                <h1 class="h5 fs-5"> Montant total reçu
                </h1> 
                <hr>
            </div>
            <div class="card-body text-center ">
                <h1 class="text-muted">{{$store.state.montant_total_recu}} FCFA</h1>
            </div>
            <div class="card-footer bg-white">
                <router-link to="/recevoir" class="text-muted">Historique des sommes recu</router-link>
            </div>
        </div>
        <div class="card col-md-5 mx-1 text-center">
            <div class="card-title text-center fs-5"> 
                <h1 class="h5 fs-5"> Montant total depensé
                </h1> 
                <hr>
            </div>
            <div class="card-body text-center ">
                <h1 class="text-muted">{{$store.state.montant_total_depense}} FCFA</h1>
            </div>
            <div class="card-footer bg-white">
                <router-link to="/depense" class="text-muted">Historique des depenses </router-link>
            </div>
        </div>
        <div class="card col-md-5 mx-1">
            <div class="card-title text-center fs-5"> 
                <h1 class="h5 fs-5"> Bénéfice total 
                </h1> 
                <hr>
            </div>
            <div class="card-body text-center animate__animated animate__bounce">
                <h1 class="text-primary">{{$store.state.benefice_total}} FCFA</h1>
            </div>
        </div>
    </div>


</div>
</template>

<script>
// @ is an alias to /src
// import Chargement from '@/components/Chargement.vue'
// import Magasin from '@/components/Magasin.vue'
// import Depense from '@/components/Depense.vue'

export default {
    name: 'Home',
    components: {
        //Chargement, //Magasin,
        //Depense,

    }
}
</script>
