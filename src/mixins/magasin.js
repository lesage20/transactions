export default {
    data(){
        return {
            magasins: [],
            toEdit: null,
            independantPisteurs: [],
            exportateurs: []

        }
    },
    methods: {
        getExportateurList() {
            window.models.Exportateur.find({})
            .then((res)=>{
                this.exportateurs = res 
                console.log("liste d'exportateurs recuperée avec succès")
                
            })
            .catch((err)=>{
                console.log(err)

            })
        },
        getIndependantPisteurList(){
            window.models.Pisteur.find({})
            .then((res)=>{
                this.independantPisteurs = res 
                console.log('liste de pisteurs independant recuperée avec succès')
                
            })
            .catch((err)=>{
                console.log(err)

            })

        },
        getMagasinList(){
            window.models.Magasin.find({})
            .then((res)=>{
                this.magasins = res
                console.log('liste de magasins recuperé avec succès')
                
            })
            .catch((err)=>{
                console.log(err)

            })

        },
        getOneMagasin (options){
            window.models.Magasin.findOne({options})
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