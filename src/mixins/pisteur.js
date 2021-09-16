// const Magasin = require('../database/models/magasin')
export default {
    data(){
        return {
        }
    },
    methods: {
        getPisteurList(){
            window.models.Pisteur.find({})
            .then((res)=>{
                this.pisteurs = res
                console.log('liste de magasins recuperée avec succès')
                
            })
            .catch((err)=>{
                console.log(err)

            })

        },
        getOneMagasin (options){
            window.models.Pisteur.findOne({options})
            .then((res)=>{
                this.toEdit = res
                console.log('liste de magasins recuperé avec succès')
                
            })
            .catch((err)=>{
                console.log(err)

            })
        }
    },
}