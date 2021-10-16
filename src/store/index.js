import Vuex from 'vuex'
import CreatePersistedState from 'vuex-persistedstate'
var store = new Vuex.Store({
  state: {
    solde_principal: 0,
    montant_total_depense: 0,
    montant_total_recu: 0,
    benefice_attente: 0,
    benefice_percu: 0,
  },
  mutations: {
    affecter: function (state, {somme, etat}) {
      console.log('affecter state called : ', etat)
        if (etat == "principal") {
          console.log('etat principal ')
          state.solde_principal = somme
        } else if (etat == "depense") {
          state.montant_total_depense = somme
        } else if (etat == "recu") {
          state.montant_total_recu = somme
        } else if (etat == "percu") {
          state.benefice_percu = somme
        }else if (etat == "attente") {
          state.benefice_attente = somme
        }
        
    },
    ajouter: function (state, {somme, etat}) {
      console.log('ajouter state called : ', etat)
        if (etat == "principal") {
          console.log('etat principal ')
          state.solde_principal += somme
        } else if (etat == "depense") {
          state.montant_total_depense += somme
        } else if (etat == "recu") {
          state.montant_total_recu += somme
        } else if (etat == "percu") {
          state.benefice_percu += somme
        }else if (etat == "attente") {
          state.benefice_attente += somme
        }
    },
    deduire: function (state, {somme, etat}){
      if (etat == "principal") {
        state.solde_principal -= somme
      } else if (etat == "depense") {
        state.montant_total_depense -= somme
      } else if (etat == "recu") {
        state.montant_total_recu -= somme
      } else if (etat == "percu") {
        state.benefice_percu -= somme
      }else if (etat == "attente") {
        state.benefice_attente -= somme
      }
    },
    reinitialiser: function (state, {etat} ) {
      if (etat == "principal") {
        state.solde_principal = 0
      } else if (etat == "depense") {
        state.montant_total_depense = 0
      } else if (etat == "recu") {
        state.montant_total_recu = 0
      } else if (etat == "benefice") {
        state.benefice_total = 0
      }
    }

  },
  actions: {
  },
  modules: {
  },
  plugins: [ CreatePersistedState() ]
})

export default store;