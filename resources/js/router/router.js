import { createRouter, createWebHistory } from "vue-router"
import Home from "../pages/Home.vue"
import Login from "../pages/Login.vue"
import Signup from "../pages/Signup.vue"
import store from '../store/store'
import { AuthenticationError, getProfile, setPageTitle, errorNotification, ServerError, NetworkError } from '../util'


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Login"
    }
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    meta: {
      title: "Create Account"
    }
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach(async (to, from, next) => {
  if (!profileIsSet()) {
    try {
      store.commit("set_profile", await getProfile())
    } catch (err) {
      console.log(err)
      if (err instanceof AuthenticationError && requiresAuthentication(to)) return next("/login")
      if (err instanceof NetworkError) errorNotification("Error Communicating With The Server. Please try again")
      else if (err instanceof ServerError) errorNotification("Internal Server Error")
      if (requiresAuthentication(to)) return next(err)
    }
  }
  setPageTitle(to.meta && to.meta.title)
  next()
})
function requiresAuthentication (route) {
  return route.meta && route.meta.privileges && (~route.meta.privileges.indexOf("authenticated") || ~route.meta.privileges.indexOf("admin"))
}
function profileIsSet () {
  return store.state.profile
}
export default router
