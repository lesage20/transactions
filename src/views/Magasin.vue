<template>
<div>
    <div class="row bg-white p-4 my-2 rounded-top shadow-sm">
        <h5 class="text-center" v-if="action == 'ajouter'">Ajouter un Magasin</h5>
        <h5 class="text-center" v-else>Liste des magasin</h5>
        <div class="d-flex justify-content-center">
            <div class="btn-group text-center  ">
                <button @click="editAction('lister')" class="btn btn-primary">Lister</button><button @click="editAction('ajouter')" class="btn btn-success">Ajouter</button>
            </div>
        </div>
    </div>
    <transition enter-to-class="animate__animated animate__zoomIn" leave-to-class="animate__animated animate__zoomOut ">
        <div id="Ajout" class=" row bg-white shadow-sm rounded-bottom" v-show="action == 'ajouter'">
            <CreateMagasin />
        </div>
    </transition>

    <transition enter-to-class="animate__animated animate__zoomIn" leave-to-class="animate__animated animate__zoomOut">
        <div id="Lister" class=" row bg-white shadow-sm rounded-bottom p-2" v-show="action == 'lister'">
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
