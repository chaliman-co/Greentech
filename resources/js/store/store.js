import { createStore } from 'vuex'

export default createStore({
  state: {
    profile: null,
  },
  mutations: {
    set_profile (state, profile) {
      state.profile = profile
    },
    delete_profile (state) {
      state.profile = null
    },
  },
  getters: {
    loggedIn: state => state.profile !== null,
    isAdmin: state => state.profile !== null && state.profile.role === 'admin'
  },
  actions: {},
  modules: {}
})
