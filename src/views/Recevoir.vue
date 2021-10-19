<template>
<div>
    <div class="row bg-white p-4  shadow-sm">
        <h5 class="text-center" v-if="action == 'ajouter'">Recevoir de l'argent d'un exportateur</h5>
        <h5 class="text-center" v-else>Liste des sommes recues</h5>
        <div class="d-flex justify-content-center">
            <div class="btn-group text-center  ">
                 <button @click="editAction('lister')" class="btn btn-primary"> Lister </button>
                <button @click="editAction('ajouter')" class="btn btn-success"> Recevoir </button> <!-- data-bs-toggle='collapse' data-bs-target='#Ajout' -->
            </div>
        </div>
    </div>
    <transition mode="out-in" enter-active-class="animate__animated animate__fadeIn animate__faster" leave-active-class="animate__animated animate__fadeOut animate__faster" >
        <div id="Ajout" class=" row bg-white shadow-sm rounded-bottom" v-if="action == 'ajouter'">
            <CreateRecevoir />
        </div>
    
        <div id="Lister" class=" row bg-white shadow-sm rounded-bottom " v-else>
            <ListRecevoir />
        </div>
    </transition>
</div>
</template>

<script>
// const bootstrap = require('bootstrap')
import CreateRecevoir from '@/components/CreateRecevoir.vue'
import ListRecevoir from '@/components/ListRecevoir.vue'
export default {
    /* eslint-env mongoose */
    name: 'Recevoir',
    components: {
        CreateRecevoir,
       ListRecevoir,
    },
    data() {
        return {
            action: 'lister'
        }
    },

    methods: {
        editAction(action) {
            this.action = action
        },

    }

}

</script>

