<template>
<div class="row bg-white p-4   shadow-sm">
    <h5 class="text-center" v-if="action == 'ajouter'">Ajouter un produit</h5>
    <h5 class="text-center" v-else>Liste des produits</h5>
    <div class="d-flex justify-content-center">
        <div class="btn-group text-center  ">
            <button @click="editAction('lister')" class="btn btn-primary">Lister</button><button @click="editAction('ajouter')" class="btn btn-success">Ajouter</button>
        </div>
    </div>
    <transition mode="out-in" enter-active-class="animate__animated animate__fadeIn animate__fast" leave-active-class="animate__animated animate__fadeOut animate__faster" >

        <div v-if="action == 'ajouter'">
            <CreateProduit />
        </div>
        <div v-else>
            <ListProduit />
        </div>
    </transition>
</div>
</template>

<script>
// const bootstrap = require('bootstrap')
import CreateProduit from '@/components/CreateProduit.vue'
import ListProduit from '@/components/ListProduit.vue'
export default {
    name: "Produit",
    data() {
        return {
            action: 'lister'
        }
    },
    components: {
        CreateProduit,
        ListProduit
    },
    methods: {
        editAction(action) {
            this.action = action
        },
    }

}
</script>
