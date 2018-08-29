const globalstate = {
  state: {},

  mutations: {
    SAVE_STATE: (state, { module, key, value }) => {
      const moduleState = state[module] || {}
      moduleState[key] = value
      state[module] = moduleState
    },
    REMOVE_STATE: (state, { module, key }) => {
      const moduleState = state[module] || {}
      delete moduleState[key]
      state[module] = moduleState
    }
  },

  actions: {
    saveState({ commit }, kv) {
      commit('SAVE_STATE', kv)
    },
    removeState({ commit }, key) {
      commit('REMOVE_STATE', key)
    }
  }
}

export default globalstate
