import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setOrganName, removeOrganName, getOrganName } from '@/utils/auth'
import { resetRouter } from '@/router'
import { getOrganization } from '@/api/plan'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: 'https://xfhp.boeart.cn:3080/static/avater.058e9775.png',
    OrganName: getOrganName()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ORGANIZATION: (state, name) => {
    state.OrganName = name
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: username.trim(), passwd: password }).then(response => {
        // const { data } = response
        commit('SET_TOKEN', response.token)
        setToken(response.token)
        resolve()
        getOrganization().then((res) => {
          commit('SET_ORGANIZATION', res.data.Name)
          setOrganName(res.data.Name)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        removeOrganName()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

