
import router from './router/router'
import store from './store/store'
const API_URL = import.meta.env.VITE_API_URL
export async function getFromApi (path) {
  const headers = new Headers()
  const apiToken = window.sessionStorage.getItem('api_token')
  if (apiToken) headers.set('Authorization', `Bearer ${apiToken}`)
  try {
    const response = await fetch(resolvePath(path), { headers })
    return ApiResponse.create(response)
  } catch (err) {
    throw new NetworkError()
  }
}
export async function deleteFromApi (path) {
  const headers = new Headers()
  const apiToken = window.sessionStorage.getItem('api_token')
  if (apiToken) headers.set('Authorization', `Bearer ${apiToken}`)
  try {
    const response = await fetch(resolvePath(path), {
      headers,
      method: 'DELETE'
    })
    return ApiResponse.create(response)
  } catch (err) {
    throw new NetworkError()
  }
}
export async function updateAtApi (path, body) {
  const headers = new Headers()
  if (body instanceof JsonBody) headers.append('Content-Type', body.type)
  const apiToken = window.sessionStorage.getItem('api_token')
  if (apiToken) headers.set('Authorization', `Bearer ${apiToken}`)
  try {
    const response = await fetch(resolvePath(path), {
      headers,
      method: 'PATCH',
      body: body && body.payload
    })
    return ApiResponse.create(response)
  } catch (err) {
    throw new NetworkError()
  }
}
export async function postToApi (path, body) {
  const headers = new Headers()
  const apiToken = window.sessionStorage.getItem('api_token')
  if (apiToken) headers.set('Authorization', `Bearer ${apiToken}`)
  if (body instanceof JsonBody) headers.append('Content-Type', body.type)
  try {
    const response = await fetch(resolvePath(path), {
      method: 'POST',
      headers,
      body: body && body.payload
    })
    return ApiResponse.create(response)
  } catch (err) { throw new NetworkError() };
}
export async function getEntity (entity) {
  const response = await getFromApi(`/${entity}`)
  if (response.failed()) {
    throw new Error(response.getErrorMessage())
  }
  return response.getData()
}
export async function getProfile () {
  const response = await getFromApi(`/profile`)
  if (response.succeeded) return response.data
  if (response.errorMessage === 'authentication failed') throw new AuthenticationError()
  throw new ServerError()
}

export function deleteProfile () {
  store.commit('delete_profile')
  window.sessionStorage.removeItem('api_token')
}
export function redirect (destination, delay = 5000) {
  setTimeout(() => router.push(destination), delay)
}

export class JsonBody {
  constructor (data) {
    if (data instanceof window.HTMLFormElement) data = Object.fromEntries(new FormData(data).entries())
    this.payload = JSON.stringify(data)
  }
}
JsonBody.prototype.type = 'application/json'
export class FormDataBody {
  constructor (data) {
    if (data instanceof window.HTMLFormElement) this.payload = new FormData(data)
    else {
      this.payload = this.objectToFormData(data)
    }
  }

  objectToFormData (obj, form, namespace) {
    const fd = form || new FormData()
    let formKey
    for (const property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (namespace) {
          formKey = `${namespace}[${property}]`
        } else {
          formKey = property
        }
        if (obj[property] === undefined) continue
        else if (obj[property] instanceof window.File || typeof obj[property] !== 'object') fd.append(formKey, obj[property])
        else this.objectToFormData(obj[property], fd, formKey)
      }
    }
    return fd
  }
}
FormDataBody.prototype.type = null// "multipart/form-data";

export class ServerError extends Error {
}
export class NetworkError {}
export class AuthenticationError extends Error {
  constructor () {
    super('Authentication Error')
  }
}
class ApiResponse {
  static async create (fetchResponse) {
    const instance = new ApiResponse()
    instance.apiResponse = await fetchResponse.json()
    instance.fetchResponse = fetchResponse
    return instance
  }

  get succeeded () {
    return this.apiResponse.status === 'success'
  }

  get data () {
    return this.apiResponse.data
  }

  get failed () {
    return this.apiResponse.status === 'failed'
  }

  get errorMessage () {
    return this.failed ? this.apiResponse.reason : null
  }

  get errorDetails () {
    return this.failed ? this.apiResponse.errors : null
  }

  get status () {
    return this.fetchResponse.status
  }
}
function resolvePath (path) {
  return API_URL + path
}

export function showNotification (message, toastType = 'success') {
  const toastEl = document.getElementById('toast')
  const toastMessageEl = toastEl.getElementsByClassName('toast-message')[0]
  const toastImgBoxEl = toastEl.getElementsByClassName('toast-img-box')[0]
  if (toastType === 'success') {
    toastImgBoxEl.textContent = '✓'
    toastImgBoxEl.style.borderRadius = '0%'
    toastImgBoxEl.style.backgroundColor = 'green'
    toastEl.style.backgroundColor = 'rgb(10, 165, 30)'
  } else if (toastType === 'error') {
    toastImgBoxEl.textContent = '!'
    toastImgBoxEl.style.borderRadius = '50%'
    toastImgBoxEl.style.backgroundColor = 'red'
    toastEl.style.backgroundColor = 'rgb(200,30,30)'
  }
  toastMessageEl.innerHTML = message
  toastEl.className = 'show'
  setTimeout(function () { toastEl.className = toastEl.classList.remove('show') }, 6000)
}
export function successNotification (message) {
  showNotification(message, 'success')
}
export function errorNotification (message) {
  showNotification(message, 'error')
}
export function startProcessingAnimation () {
  document.getElementById('processing-loader').classList.remove('hidden')
}
export function stopProcessingAnimation () {
  document.getElementById('processing-loader').classList.add('hidden')
}
export function handleErrors (response, redirectToLoginOnAuthFailure = true) {
  showNotification(response.errorMessage, 'error')
  if (response.status === 401 && redirectToLoginOnAuthFailure) {
    deleteProfile()
    return redirect({ name: 'Account', query: { errormessage: 'You must login in to continue', destination: window.location.pathname } })
  }
  const details = {}
  for (const key of Object.keys(response.errorDetails)) {
    const properties = getErrorProperties(key) // a key can be a combination of multiple properties
    for (const property of properties) { details[property] = response.errorDetails[key] }
  }
  return details
}
function getErrorProperties (errorKey) {
  return errorKey.split('+')
}

export function setPageTitle (title) {
  if (title) document.title = `${title} | Green Tech Assessment`
  else document.title = 'Green Tech Assessment'
}
