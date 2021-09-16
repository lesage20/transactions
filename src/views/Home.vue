<template>
<div class="home col-md-12 my-auto py-auto">
    <div>
        <h1 class="text-center animate__animated animate__slideInLeft">
            Montant Total : {{$store.state.solde_principal}} FCFA
        </h1>
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
