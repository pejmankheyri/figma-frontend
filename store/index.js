export const state = () => ({
    // user: {},
})

export const mutations = {
    setUser(state, payload) {
        state.auth.user = payload
    },
}

export const actions = {
    async loadUser({ commit, dispatch }) {
        const user = (await this.$axios.$get('/me')).data
        commit('setUser', user)
    },
}

export const getters = {}