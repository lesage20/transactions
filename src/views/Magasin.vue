<template>
<div>
    <div class="row bg-white p-4  shadow-sm">
        <h5 class="text-center" v-if="action == 'ajouter'" id="titlle">Ajouter un Magasin</h5>
        <h5 class="text-center" v-else id="titlle">Liste des magasin</h5>
        <div class="d-flex justify-content-center">
            <div class="btn-group text-center  ">
                 <button @click="editAction('lister')" class="btn btn-primary"> <i class="bi bi-list"></i> Lister </button>
                <button @click="editAction('ajouter')" class="btn btn-success"> <i class="bi bi-plus-lg"></i> Ajouter </button> <!-- data-bs-toggle='collapse' data-bs-target='#Ajout' -->
            </div>
        </div>
    </div>
    <transition mode="out-in" enter-active-class="animate__animated animate__slideInLeft animate__fast" leave-active-class="animate__animated animate__slideOutRight animate__faster" >
        <div id="Ajout" class=" row bg-white shadow-sm rounded-bottom" v-if="action == 'ajouter'">
            <CreateMagasin />
        </div>

        <div id="Lister" class=" row bg-white shadow-sm rounded-bottom " v-else>
            <ListMagasin />
        </div>
    </transition>
</div>
</template>

<script>
// const bootstrap = require('bootstrap')
import CreateMagasin from '@/components/CreateMagasin.vue'
import ListMagasin from '@/components/ListMagasin.vue'
export default {
    /* eslint-env mongoose */
    name: 'Magasin',
    components: {
        CreateMagasin,
        ListMagasin,
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

