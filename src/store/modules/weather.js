import axios from "axios";

const state = () => ({
    weatherData: null,
    weatherLoading: false,
    weatherWeekData: null,
    weatherWeekLoading: null,
})

const getters = {
    weatherData: (state) => state.weatherData,
    weatherLoading: (state) => state.weatherLoading,
    weatherWeekData: (state) => state.weatherWeekData,
    weatherWeekLoading: (state) => state.weatherWeekLoading,
}

const mutations = {
    SET_WEATHER_DATA: (state, data) => {
        state.weatherData = data;
    },
    SET_WEATHER_LOADING: (state, data) => {
        state.weatherLoading = data;
    },
    SET_WEATHER_WEEK_DATA: (state, data) => {
        state.weatherWeekData = data;
    },
    SET_WEATHER_WEEK_LOADING: (state, data) => {
        state.weatherWeekLoading = data;
    },
}

const actions = {
    getWeather({ commit }, payload) {
        commit("SET_WEATHER_LOADING", true);
        axios
            .get(
                `${process.env.VUE_APP_OPEN_WEATHER_API}/weather?lat=${payload.lat}&lon=${payload.lon}&units=metric&appid=${process.env.VUE_APP_OPEN_WEATHER_KEY}`
            )
            .then((res) => {
                commit("SET_WEATHER_DATA", res.data)
            }).finally(() => {
                commit("SET_WEATHER_LOADING", false);
            })
    },
    getWeekWeather({ commit }, payload) {
        commit("SET_WEATHER_WEEK_LOADING", true);
        axios
            .get(
                `${process.env.VUE_APP_OPEN_WEATHER_API}/onecall?lat=${payload.lat}&lon=${payload.lon}&units=metric&appid=${process.env.VUE_APP_OPEN_WEATHER_KEY}`
            )
            .then((res) => {
                commit("SET_WEATHER_WEEK_DATA", res.data)
            }).finally(() => {
                commit("SET_WEATHER_WEEK_LOADING", false);
            })
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}