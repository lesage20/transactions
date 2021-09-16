import Vuex from 'vuex'
import CreatePersistedState from 'vuex-persistedstate'
var store = new Vuex.Store({
  state: {
    solde_principal: 0
  },
  mutations: {
    ajouter: function (state, somme) {
        state.solde_principal += somme
    },
    deduire: function (state, somme){
      state.solde_principal -= somme
    }

  },
  actions: {
  },
  modules: {
  },
  plugins: [ CreatePersistedState() ]
})

export default store;