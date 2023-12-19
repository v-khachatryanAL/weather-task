import axios from "axios";

const state = () => ({
    locationsData: null,
    locationsLoading: false,
    userLocationData: null,
    userLocationLoading: false,
})

const getters = {
    locationsData: (state) => state.locationsData,
    locationsLoading: (state) => state.locationsLoading,
    userLocationData: (state) => state.userLocationData,
    userLocationLoading: (state) => state.userLocationLoading,
}

const mutations = {
    SET_LOCATIONS_DATA: (state, data) => {
        state.locationsData = data;
    },
    SET_LOCATIONS_LOADING: (state, data) => {
        state.locationsLoading = data;
    },
    SET_USER_LOCATION_DATA: (state, data) => {
        state.userLocationData = data;
    },
    SET_USER_LOCATION_LOADING: (state, data) => {
        state.userLocationLoading = data;
    }
}

const actions = {
    getLocations({ commit }, query) {
        commit("SET_LOCATIONS_LOADING", true);
        axios
            .get(
                `${process.env.VUE_APP_GEO_API_URL}?q=${query}&key=${process.env.VUE_APP_GEO_API_KEY}`
            )
            .then((res) => {
                let data = null;
                if (res.data.results) {
                    data = res.data.results.map(item => item = { name: item.formatted, coords: item.geometry })
                }
                commit("SET_LOCATIONS_DATA", data)
            }).finally(() => {
                commit("SET_LOCATIONS_LOADING", false);
            })
    },
    getUserLocation({ commit }) {
        commit("SET_USER_LOCATION_LOADING", true)
        axios.get(`${process.env.VUE_APP_USER_GEO_API_URL}?token=${process.env.VUE_APP_USER_GEO_API_KEY}`).then((res) => {
            commit("SET_USER_LOCATION_DATA", res.data)
        }).finally(() => {
            commit("SET_USER_LOCATION_LOADING", false)
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}