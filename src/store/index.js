import Vue from 'vue'
import Vuex, { Store } from "vuex"
import weather from './modules/weather';
import location from './modules/location';

Vue.use(Vuex);

export default new Store({
    modules: {
        weather,
        location
    }
})