<template>
<div class="row bg-white p-4 my-2 rounded shadow-sm">
    <h5 class="text-center" >Ajouter un Gerant</h5>
    <!-- <h5 class="text-center" v-else>Liste des Gerant</h5> -->
    <!-- <div class="d-flex justify-content-center">
        <div class="btn-group text-center  ">
            <button @click="editAction('lister')" class="btn btn-primary">Lister</button><button @click="editAction('ajouter')" class="btn btn-success">Ajouter</button>
        </div>
    </div > -->
    <div >
        <CreateGerant />
    </div>
    <!-- <div v-if="action == 'lister'">
        <ListGerant />
    </div> -->
</div>
</template>


<script>
// const bootstrap = require('bootstrap')
import CreateGerant from '@/components/CreateGerant.vue'
// import ListGerant from '@/components/ListGerant.vue'
export default {
    name: "Gerant",
    data(){
        return {
            
        }
    },
    components: {
        CreateGerant,//ListGerant
    }
}
</script>