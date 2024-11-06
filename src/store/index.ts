import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        proInfo: []
    },
    getters: {},
    mutations: {
        changeInfo (state, payload) {
            state.proInfo = payload
        }
    },
    actions: {
        setId (context, payload) {
            context.commit('changeInfo', payload)
        }
    },
    modules: {}
})

export default store
