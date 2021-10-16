<template>
  <div class="col-md-12">
    <div class="row d-flex px-4 flex-wrap justify-content-between my-2 g-2">
      <div class="bg-blue1 shadow rounded-lg p-2 col-md-2">
        <div>
          <p class="p-1 m-0">
            <i class="bi bi-wallet-fill fs-2"></i>
          </p>
        </div>
        <h5 class="h6">Solde principal</h5>
        <p class="h4 animate__animated animate__bounce">
          {{ $store.state.solde_principal }} FCFA
        </p>
      </div>
      <div class="bg-blue2 shadow rounded-lg p-2 col-md-2">
        <div>
          <p class="p-1 m-0">
            <i class="bi bi-download fs-2"></i>
          </p>
        </div>
        <h5 class="h6">Montant reçu</h5>
        <p class="h4">{{ $store.state.montant_total_recu }} FCFA</p>
        <router-link to="/recevoir" class="">
          <small> Historique de receptions</small></router-link
        >
      </div>
      <div class="bg-blue3 shadow rounded-lg p-2 col-md-2">
        <div>
          <p class="p-1 m-0">
            <i class="bi bi-upload fs-2"></i>
          </p>
        </div>
        <h5 class="h6">Montant depensé</h5>
        <p class="h4">{{ $store.state.montant_total_depense }} FCFA</p>
        <router-link to="/depense" class="text-muted">
          <small> Historique de depense</small></router-link
        >
      </div>
      <div class="bg-blue4 shadow rounded-lg p-2 col-md-2">
        <div>
          <p class="p-1 m-0">
            <i class="bi bi-credit-card-2-back-fill fs-2"></i>
            <small><i class="bi bi-hourglass-split"></i></small>
          </p>
        </div>
        <h5 class="h6">Bénéfice en attente</h5>
        <p class="h4 animate__animated animate__bounce">
          {{ $store.state.benefice_attente }} FCFA
        </p>
        <router-link to="/chargement" class="text-muted">
          <small> Historique de chargement</small></router-link
        >
      </div>
      <div class="bg-blue5 shadow rounded-lg p-2 col-md-2">
        <div>
          <p class="p-1 m-0">
            <i class="bi bi-credit-card-fill fs-2"></i>
            <small><i class="bi bi-check"></i></small>
          </p>
        </div>
        <h5 class="h6">Bénéfice perçu</h5>
        <p class="h4 animate__animated animate__bounce">
          {{ $store.state.benefice_percu }} FCFA
        </p>
        <router-link to="/chargement" class="text-muted">
          <small> Historique de chargement</small></router-link
        >
      </div>
    </div>
    <div class="row">
      <statistics />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Statistics from "@/components/Statistic.vue";

export default {
  name: "Home",
  components: {
    Statistics, //Magasin,
    //Depense,
  },
};
</script>

<style>
.rounded-lg {
  border-radius: 8px;
}
.bg-blue1 {
  background-color: rgb(46, 46, 46) !important;
  background-image: linear-gradient(
    rgba(18, 18, 221, 0.712),
    rgba(18, 18, 221, 0.712)
  );
  color: rgb(236, 231, 231) !important;
}
.bg-blue2 {
  background-color: rgba(0, 48, 222) !important;
  /* background-image: linear-gradient( ,  rgba(0, 48, 222, 0.712)); */
  color: rgb(236, 231, 231) !important;
}
.bg-blue3 {
  /* background: rgb(0, 120, 250) !important; */
  background-color: rgb(33, 152, 216) !important;
  color: white;
  /* background-image: linear-gradient( rgba(0, 120, 250, 0.712),  rgba(0, 120, 250, 0.712)); */
}

.bg-blue4 {
  background: rgb(22, 193, 114) !important;
  color: white;
}
.bg-blue5 {
  background: rgb(0, 129, 72) !important;
  color: white;
}
.bg-blue1 > a,
.bg-blue2 > a,
.bg-blue3 > a,
.bg-blue4 > a,
.bg-blue5 > a {
  color: rgba(255, 255, 255, 0.863) !important;
  text-decoration: none;
}
</style>