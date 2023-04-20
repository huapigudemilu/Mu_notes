import Cookies from "js-cookie"

export default {
    state: {
        token: '123',
        name: '',
        date: ''
    },
    mutations: {
        setToken(state, val) {
            state.token = val
            Cookies.set('token', val)
        },
        clearToken(state) {
            state.token = ''
            Cookies.remove('token')
        },
        getToken(state) {
            state.token = state.token || Cookies.get('token')
        },
        setName(state, val) {
            state.name = val
            Cookies.set('name', val)
        },
        getName(state) {
            state.name = state.name || Cookies.get('name')
        },
        clearName(state) {
            state.name = ''
            Cookies.remove('name')
        },
        setDate(state, val) {
            state.date = val
            Cookies.set('date', val)
        },
        clearDate(state) {
            state.date = ''
            Cookies.remove('date')
        },
        getDate(state) {
            state.date = state.date || Cookies.get('date')
        },
    }
}