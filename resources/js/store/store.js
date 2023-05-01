import { createStore } from 'vuex'

export default createStore({
  state: {
    profile: null,
    categories: [],
  },
  mutations: {
    set_profile (state, profile) {
      state.profile = profile
    },
    delete_profile (state) {
      state.profile = null
    },
    set_categories (state, cats) {
      state.categories = cats
    },
    update_category (state, { category, update }) {
      Object.assign(category, update)
    },
    add_category (state, cat) {
      state.categories.push(cat)
    },
    delete_category (state, category) {
      state.categories = state.categories.filter(cat => cat._id !== category._id)
      if (state.currentCategory._id === category._id) state.currentCategory = null
    },
    set_current_category (state, category) {
      state.currentCategory = category
    },
  },
  getters: {
    loggedIn: state => state.profile !== null,
    isAdmin: state => state.profile !== null && state.profile.role === 'admin'
  },
  actions: {},
  modules: {}
})
