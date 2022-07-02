import Cookies from 'js-cookie'
const TokenKey = 'vue_admin_template_token'
const OrganKey = 'vue_admin_template_organ'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getOrganName() {
  return Cookies.get(OrganKey)
}

export function setOrganName(organ) {
  return Cookies.set(OrganKey, organ)
}

export function removeOrganName() {
  return Cookies.remove(OrganKey)
}
