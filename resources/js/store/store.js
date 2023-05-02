import { createStore } from 'vuex'

export default createStore({
  state: {
    profile: null,
    categories: [],
    products: {
      total: 0,
      data: []
    },
    users: {
      total: 0,
      data: []
    },
    ownOrders: {
      total: 0,
      data: []
    },
    orders: {
      total: 0,
      data: []
    },
    currentOrder: null,
    currentOwnOrder: null,
    cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
    currentProduct: null,
    currentCategory: null,
    currentUser: null
  },
  mutations: {
    set_profile(state, profile) {
      state.profile = profile
    },
    set_users (state, users) {
      state.users = users
    },
    delete_profile(state) {
      state.profile = null
    },
    set_categories(state, cats) {
      state.categories = cats
    },
    update_category(state, { category, update }) {
      Object.assign(category, update)
    },
    add_category(state, cat) {
      state.categories.push(cat)
    },
    delete_category(state, category) {
      state.categories = state.categories.filter(cat => cat.id !== category.id)
      if (state.currentCategory.id === category.id) state.currentCategory = null
    },
    set_current_category(state, category) {
      state.currentCategory = category
    },
    set_products(state, prods) {
      state.products = prods
    },
    add_product(state, prod) {
      state.products.data.push(prod)
    },
    update_product(state, { product, update }) {
      Object.assign(product, update)
    },
    delete_product(state, product) {
      state.products.data = state.products.data.filter(prod => prod.id !== product.id)
      if (state.currentProduct.id === product.id) state.currentProduct = null
    },
    set_current_product(state, product) {
      state.currentProduct = product
    },
    add_to_cart(state, cartItem) {
      state.cart.push(cartItem)
      localStorage.setItem("cart", JSON.stringify(state.cart))
    },
    remove_from_cart(state, product) {
      state.cart = this.state.cart.filter(item => item.product._id !== product._id)
      localStorage.setItem("cart", JSON.stringify(state.cart))
    },
    clear_cart(state) {
      state.cart = []
      localStorage.setItem("cart", JSON.stringify(state.cart))
    },
    set_own_orders(state, orders) {
      state.ownOrders = orders
    },
    add_own_order(state, order) {
      state.ownOrders.push(order)
    },
    set_current_own_order(state, order) {
      state.currentOwnOrder = order;
    },
    set_orders(state, orders) {
      state.orders = orders
    },
    add_order(state, order) {
      state.orders.push(order)
    },
    set_current_order(state, order) {
      state.currentOrder = order;
    },
    update_order(state, { order, update }) {
      Object.assign(order, update)
    },
    set_current_user(state, user) {
      state.currentUser = user
    }
  },
  getters: {
    loggedIn: state => state.profile !== null,
    isAdmin: state => state.profile !== null && state.profile.role === 'admin'
  },
  actions: {},
  modules: {}
})
