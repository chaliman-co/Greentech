import { createStore } from 'vuex'

export default createStore({
  state: {
    profile: null,
    categories: [],
    products: {
      total: 0,
      data: []
    },
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
      state.categories = state.categories.filter(cat => cat.id !== category.id)
      if (state.currentCategory.id === category.id) state.currentCategory = null
    },
    set_current_category (state, category) {
      state.currentCategory = category
    },
    set_products (state, prods) {
      state.products = prods
    },
    add_product (state, prod) {
      state.products.data.push(prod)
    },
    update_product (state, { product, update }) {
      Object.assign(product, update)
    },
    delete_product (state, product) {
      state.products.data = state.products.data.filter(prod => prod.id !== product.id)
      if (state.currentProduct.id === product.id) state.currentProduct = null
    },
    set_current_product (state, product) {
      state.currentProduct = product
    },
  },
  getters: {
    loggedIn: state => state.profile !== null,
    isAdmin: state => state.profile !== null && state.profile.role === 'admin'
  },
  actions: {},
  modules: {}
})
