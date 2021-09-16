<template>
<div class="row ">
    <div class="btn-group col-md-12 py-3 px-0" id="nav" role="group" aria-label="nav">
        <router-link to="/" id='home' class="btn btn-outline-secondary">Accueil</router-link>
        <router-link to="/magasin" id='magasin' class="btn btn-outline-secondary">Magasin</router-link>
        <router-link to="/gerant" id='gerant' class="btn btn-outline-secondary ">Gerant</router-link>
        <router-link to="/exportateur" id='exportateur' class="btn btn-outline-secondary ">Exportateur</router-link>
        <router-link to="/pisteur" id='pisteur' class="btn btn-outline-secondary">Pisteur</router-link>
        <router-link to="/recevoir" id='recevoir' class="btn btn-outline-secondary ">Recevoir</router-link>
        <router-link to="/depense" id='depense' class="btn btn-outline-secondary ">Depense</router-link>
        <router-link to="/chargement" id='chargement' class="btn btn-outline-secondary">Chargement</router-link>
    </div>

</div>
<transition mode="out-in" enter-active-class="animate__animated animate__fadeIn "  
                          leave-active-class="animate__animated animate__fadeOut" >
    <router-view />

</transition>
</template>

<script>
const $ = require('jquery')
// const dotenv = require('dotenv')
const dburl = process.env.VUE_APP_DBURL //dotenv.config().parsed.MONGODBLOCAL || 

export default {
    /* eslint-env jQuery */
    name: "Main",
    data() {
        return {

        }
    },
    created() {
        console.log(this.$store.state.MainSolde)
        window.mongoose.connect(dburl, {
                useNewUrlParser: true
            })
            .then(() => {
                console.log('db connected successfully')

            })
            .catch((err) => {
                console.log(err)
            })
        console.log()
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
                $(".router-link-active.router-link-exact-active").addClass('text-white').addClass('active')

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
</style>
