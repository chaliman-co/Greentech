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
import showProduct from '../pages/products/ShowProduct.vue'
import UpdateProduct from '../pages/products/UpdateProduct.vue'
import Orders from '../pages/orders/Orders.vue'
import AllOrders from '../pages/orders/AllOrders.vue'
import SingleOrder from '../pages/orders/SingleOrder.vue'
import showOrder from '../pages/orders/ShowOrder.vue'
import AdminOrders from '../pages/admin/orders/Orders.vue'
import AdminAllOrders from '../pages/admin/orders/AllOrders.vue'
import AdminSingleOrder from '../pages/admin/orders/SingleOrder.vue'
import AdminshowOrder from '../pages/admin/orders/ShowOrder.vue'
import Users from "../pages/users/User.vue"
import AllUsers from '../pages/users/AllUsers.vue'
import SingleUser from '../pages/users/SingleUser.vue'
import ShowUser from '../pages/users/ShowUser.vue'
import Profile from '../pages/profile/Profile.vue'
import ShowProfile from '../pages/profile/ShowProfile.vue'
import EditProfile from '../pages/profile/EditProfile.vue'
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
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: {
      title: 'Orders'
    },
    children: [
      {
        path: '',
        component: AllOrders
      },
      {
        path: ':id',
        component: SingleOrder,
        children: [
          {
            path: '',
            component: showOrder,
            meta: {
            }
          }
        ]
      }
    ]
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: AdminOrders,
    meta: {
      title: 'Manage Orders',
      privileges: ['admin'],
    },
    children: [
      {
        path: '',
        component: AdminAllOrders
      },
      {
        path: ':id',
        component: AdminSingleOrder,
        children: [
          {
            path: '',
            component: AdminshowOrder,
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
    path: '/users',
    name: 'Users',
    component: Users,
    meta: {
      title: 'Users'
    },
    children: [
      {
        path: '',
        component: AllUsers
      },
      {
        path: ':id',
        component: SingleUser,
        children: [
          {
            path: '',
            component: ShowUser,
            meta: {
            }
          }
        ]
      }
    ]
  }, {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Profile',
      privileges: ['authenticated'],
    },
    children: [
      {
        path: '',
        component: ShowProfile
      },
      {
        path: 'edit',
        component: EditProfile,
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach(async (to, from) => {
  console.log(to.fullPath, to.meta)
  const loader = document.getElementById("loader")
  loader.classList.add("not-loaded")
  if (!profileIsSet()) {
    try {
      store.commit("set_profile", await getProfile())
    } catch (err) {
      console.log({ err, reqAuth: requiresAuthentication(to), shouldLogin: err instanceof AuthenticationError && requiresAuthentication(to) })
      if (err instanceof AuthenticationError && requiresAuthentication(to)) return {name: "Login", replace: true}
      if (err instanceof NetworkError) errorNotification("Error Communicating With The Server. Please refresh to try again")
      else if (err instanceof ServerError) errorNotification("Internal Server Error")
      if (requiresAuthentication(to)) return next(err)
    } finally {
      loader.classList.remove("not-loaded")
    }
  }
  setPageTitle(to.meta && to.meta.title)
  loader.classList.remove("not-loaded")
})
function requiresAuthentication(route) {
  return route.meta && route.meta.privileges && (~route.meta.privileges.indexOf("authenticated") || ~route.meta.privileges.indexOf("admin"))
}
function profileIsSet() {
  return store.state.profile
}
export default router
