<template>
  <div class="row shadow-sm rounded bg-white p-4 my-4">
    <h5 class="text-center">
      Recevoir de l'argent d'un exportateur
    </h5>
    <form >
    <div class="form-group p-2">
      <label for="montant">Montant </label>
      <input v-model="montant" type="number"  class="form-control" id="montant" aria-describedby="montantHelp" placeholder="Entrez la somme à recevoir">
    </div>
    <div class="form-group p-2">
      <label for="date">Date </label>
      <input v-model="date" type="date"  class="form-control" id="date" aria-describedby="dateHelp" placeholder="Entrez la date de reception">
    </div>
    <div class="form-group p-2">
      <label for="exportateur">Exportateur</label>
      <!-- <input type="text" class="form-control" id="exportateur" placeholder="veuillez choisir l'exportateur qui envoie l'argent"> -->
      <select v-model="exportateur" name="exportateur" id="exportateur" class="form-select">
        <option :value="exp.id" v-for=" exp in exportateurs" :key="exp.id">
          {{exp.nom}} {{exp.prenom}}
        </option>
      </select>
    </div>
    <div class="form-group p-2 d-flex justify-content-end">
      <div>
          <button type="submit" @click.prevent="recevoir()" class="btn btn-success">Recevoir</button>
      </div>
      
    </div>
    
  </form>
      
    
  </div>
</template>

<script>
const MagasinMixin = require('../mixins/magasin').default

export default {
  name: 'Recevoir',
  mixins: [MagasinMixin],
  data () {
    return {
      exportateur: '',
      montant: 0,
      date: new Date()
    }
  },
  methods: {
    recevoir() {
      console.log(this.exportateur)
        window.models.Transaction.create({
          montant: this.montant,
          exportateur: this.exportateur,
          type: 'reception',
          date: this.date

        })
        .then((res) => {
          console.log('succès: ', res)
          this.$store.commit('ajouter', this.montant)
          
          window.models.Exportateur.findOne({id: this.exportateur})
          .then((doc)=>{
            console.log('exportateur: ', doc)
            doc.solde += this.montant 
            doc.save((err, dc)=> {
              if (err) console.log(err)
              else console.log('success: ', dc)
            })
          })
          .catch((err)=>{
            console.log(err)
          })

        })
        .catch((err)=>{
          console.log(err)
        })
    }
  },
  created () {
    // console.log('vue instance created')
    this.getExportateurList()
  },
  mounted(){
    // console.log('mounted')
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
