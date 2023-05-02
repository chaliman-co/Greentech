import { createRouter, createWebHistory } from "vue-router"
import Home from "../pages/Home.vue"
import Login from "../pages/Login.vue"
import Signup from "../pages/Signup.vue"
import Categories from '../pages/categories/Categories.vue'
import AddCategory from '../pages/categories/AddCategory.vue'
import AllCategories from '../pages/categories/AllCategories.vue'
import SingleCategory from '../pages/categories/SingleCategory.vue'
import ShowCategory from '../pages/categories/ShowCategory.vue'
import UpdateCategory from '../pages/categories/UpdateCategory.vue'
import AddProduct from '../pages/products/AddProduct.vue'
import Products from '../pages/products/Products.vue'
import AllProducts from '../pages/products/AllProducts.vue'
import SingleProduct from '../pages/products/SingleProduct.vue'
import showProduct from '../pages/products/showProduct.vue'
import UpdateProduct from '../pages/products/UpdateProduct.vue'
import Checkout from '../pages/Checkout.vue'
import NotFound from '../pages/404.vue'
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
  {
    path: '/add_category',
    component: AddCategory,
    meta: {
      privileges: ['admin'],
      title: 'Add Category'
    }
  },
  {
    path: '/categories',
    component: Categories,
    meta: {
      privileges: ['admin'],
      title: 'Categories'
    },
    children: [
      {
        path: '',
        component: AllCategories,
        meta: {
          privileges: ['admin']
        }
      },
      {
        path: ':id',
        component: SingleCategory,
        children: [
          {
            path: '',
            component: ShowCategory,
            meta: {
              privileges: ['admin']
            }
          },
          {
            path: 'update',
            component: UpdateCategory,
            meta: {
              privileges: ['admin']
            }
          }
        ]
      }
    ]
  },
  {
    path: '/add_product',
    component: AddProduct,
    meta: {
      privileges: ['admin'],
      title: 'Add Product'
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: {
      title: 'Products'
    },
    children: [
      {
        path: '',
        component: AllProducts
      },
      {
        path: ':id',
        component: SingleProduct,
        children: [
          {
            path: 'update',
            component: UpdateProduct,
            meta: {
              privileges: ['admin']
            }
          },
          {
            path: '',
            component: showProduct,
            meta: {
            }
          }
        ]
      }
    ]
  },
  {
    path: '/checkout',
    component: Checkout,
    name: 'Checkout',
    meta: {
      privileges: ['authenticated'],
      title: 'Checkout'
    }
  }, {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }

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
      if (err instanceof AuthenticationError && requiresAuthentication(to)) return next("/login")
      if (err instanceof NetworkError) errorNotification("Error Communicating With The Server. Please try again")
      else if (err instanceof ServerError) errorNotification("Internal Server Error")
      if (requiresAuthentication(to)) return next(err)
    }
  }
  setPageTitle(to.meta && to.meta.title)
  next();
})
function requiresAuthentication(route) {
  return route.meta && route.meta.privileges && (~route.meta.privileges.indexOf("authenticated") || ~route.meta.privileges.indexOf("admin"))
}
function profileIsSet() {
  return store.state.profile
}
export default router
