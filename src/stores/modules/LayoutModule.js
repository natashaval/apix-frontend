export default {
    namespaced: true,
    state: {
        layout: ''
    },
    mutations: {
        SET_LAYOUT (state, payload) {
            state.layout = payload
        }
    },
    getters: {
        getLayout (state) {
            return state.layout
        }
    }
}