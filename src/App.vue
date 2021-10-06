<template>
<div class="row ">
    <div class="btn-group col-md-12 p-0  px-0" id="nav" role="group" aria-label="nav">
        <router-link to="/" id='home' class="btn btn-dark text-gray fs-6 rounded-0" style="font-weight: 100"> Accueil</router-link>
        <router-link to="/magasin" id='magasin' class="btn btn-dark text-gray fs-6 rounded-0" style="font-weight: 100">Magasin</router-link>
        <router-link to="/gerant" id='gerant' class="btn btn-dark text-gray fs-6 rounded-0" style="font-weight: 100"> Gerant</router-link>
        <router-link to="/pisteur" id='pisteur' class="btn btn-dark text-gray fs-6 rounded-0" style="font-weight: 100"> Pisteur</router-link>
        <router-link to="/exportateur" id='exportateur' class="btn btn-dark text-gray fs-6 rounded-0" style="font-weight: 100"> Exportateur</router-link>
        <router-link to="/recevoir" id='recevoir' class="btn btn-dark text-gray fs-6 rounded-0 " style="font-weight: 100">Recevoir</router-link>
        <router-link to="/depense" id='depense' class="btn btn-dark text-gray fs-6 rounded-0" style="font-weight: 100"> Depense</router-link>
        <router-link to="/produit" id='produit' class="btn btn-dark text-gray fs-6 rounded-0" style="font-weight: 100"> Produit</router-link>
        <router-link to="/chargement" id='chargement' class="btn btn-dark text-gray fs-6 rounded-0" style="font-weight: 100">Chargement</router-link>
        <router-link to="/livraison" id='livraison' class="btn btn-dark text-gray fs-6 rounded-0" style="font-weight: 100"> Livraison</router-link>
    </div>

</div>
<div class="page">
    <transition mode="out-in" enter-active-class="animate__animated animate__fadeIn " leave-active-class="animate__animated animate__fadeOut" appear>
        <router-view />

    </transition>
</div>
</template>

<script>
const $ = require('jquery')
const dburl = process.env.VUE_APP_DBURL || "mongodb://localhost:27017/Transactions"
export default {
    /* eslint-env jQuery */
    name: "Main",
    data() {
        return {
            printers: [],
        }
    },
    created() {
        console.log(window.models)
        window.mongoose.connect(dburl, {
                useNewUrlParser: true
            })
            .then(() => {
                console.log('db connected successfully')
        
            })
            .catch((err) => {
                console.log(err)
            })
        

    },
    mounted() {

        this.activeRightButton()
        window.addEventListener('DOMContentLoaded', () => {
            $(".router-link-active.router-link-exact-active").addClass('active').addClass('text-white')
        })

    },
    methods: {
        
        activeRightButton() {
            $('#nav .btn').on('click', () => {
                $('#nav .btn').removeClass('active').removeClass('text-white')
                $(".router-link-active.router-link-exact-active").removeClass('text-gray').addClass('text-white').addClass('active')
            })

        }
    },
    unmounted() {
        window.mongoose.connection.close()
            .then(() => {
                console.log('db closed successfully')
            })
            .catch((error) => {
                console.log(error)
            })
    },
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    color: #2c3e50;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}

.btn-dark {
    background: rgb(56, 56, 56) !important;
    outline: none !important;
    outline-style: none !important;
}

.active {
    /* border-bottom: 5px solid rgb(42, 42, 235) !important; */
    background: rgb(29, 29, 29) !important;
    font-weight: 700 !important;
}

.text-gray {
    color: rgb(185, 184, 184) !important;
}

ol li:hover {
    background: rgb(240, 239, 239);
}
</style>
