<template>
<div>
    <div class="row bg-white p-4   shadow-sm">
        <h5 class="text-center" v-if="action=='ajouter'">Ajouter une Depense</h5>
        <h5 class="text-center" v-else>Historique de Depenses</h5>
        <div class="d-flex justify-content-center">
            <div class="btn-group text-center  ">
                <button @click="editAction('lister')" class="btn btn-primary">Lister</button><button @click="editAction('ajouter')" class="btn btn-success">Ajouter</button>
            </div>
        </div>
    </div>

    <transition mode="out-in" enter-active-class="animate__animated animate__fadeIn animate__fast" leave-active-class="animate__animated animate__fadeOut animate__faster" duration="300">
        <div id="Ajout" class=" row bg-white shadow-sm rounded-bottom" v-if="action == 'ajouter'">
            <CreateDepense />
        </div>
       
        <div id="Lister" class=" row bg-white shadow-sm rounded-bottom p-2" v-else-if="action == 'lister'">
            <ListDepense />
        </div>
    </transition>
</div>
</template>

<script>
import CreateDepense from '@/components/CreateDepense.vue'
import ListDepense from '@/components/ListDepense.vue'
export default {
    name: "Depense",
    data() {
        return {
            action: 'lister'
        }
    },
    components: {
        CreateDepense,
        ListDepense
    },
    methods: {
        editAction(action) {
            this.action = action
        },
    }
}
</script>
