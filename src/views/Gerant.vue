<template>
<div class="row bg-white p-4   shadow-sm">
    <h5 class="text-center" v-if="action == 'ajouter'">Ajouter un Gerant</h5>
    <h5 class="text-center" v-else>Liste des Gerants</h5>
    <div class="d-flex justify-content-center">
        <div class="btn-group text-center  ">
            <button @click="editAction('lister')" class="btn btn-primary">Lister</button><button @click="editAction('ajouter')" class="btn btn-success">Ajouter</button>
        </div>
    </div>
    <transition mode="out-in" enter-active-class="animate__animated animate__fadeIn animate__fast" leave-active-class="animate__animated animate__fadeOut animate__faster" >

        <div v-if="action == 'ajouter'">
            <CreateGerant />
        </div>
        <div v-else>
            <ListGerant />
        </div>
    </transition>
</div>
</template>

<script>
// const bootstrap = require('bootstrap')
import CreateGerant from '@/components/CreateGerant.vue'
import ListGerant from '@/components/ListGerant.vue'
export default {
    name: "Gerant",
    data() {
        return {
            action: 'lister'
        }
    },
    components: {
        CreateGerant,
        ListGerant
    },
    methods: {
        editAction(action) {
            this.action = action
        },
    }

}
</script>
