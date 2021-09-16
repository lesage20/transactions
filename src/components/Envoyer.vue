<template>
  <div class="row shadow-sm rounded bg-white p-4 my-4">
    <h5 class="text-center">
      Envoyer de l'argent
    </h5>
    <form >
    <div class="form-group p-2">
      <label for="send">Somme </label>
      <input type="number" class="form-control" id="send" aria-describedby="sendHelp" placeholder="Entrez la somme à envoyer">
    </div>
    <div class="form-group p-2">
      <label for="destinataire">Destinataire</label>
      <input type="text" class="form-control" id="destinataire" placeholder="veuillez entrer le destinataire">
    </div>
    <div class="form-group p-2 d-flex justify-content-end">
      <div>
          <button type="submit" class="btn btn-success">Envoyer</button>
      </div>
      
    </div>
    
  </form>
      
    
  </div>
</template>

<script>
export default {
  name: 'Envoyer',
  data () {
    return {

    }
  },
  methods: {

  },
  created () {
    // console.log('vue instance created')
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
