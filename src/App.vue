<template>
  <v-app>
    <v-main>
      <div class="px-3 py-2">
        <SearchComponent 
          @select-country="selectCountry"
          @select-format="selectFormat"
        />
      </div>
      <div>
        <WeatherComponent 
          :selectedCountry="selectedCountry"
          :selectedFormat="selectedFormat"
        />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import WeatherComponent from "./components/WeatherComponent";
import SearchComponent from "./components/SearchComponent";

export default {
  name: "App",

  components: {
    WeatherComponent,
    SearchComponent
  },

  data: () => ({
    selectedCountry: null,
    selectedFormat: 'C'
  }),

  methods: {
    selectCountry(val) {
      this.selectedCountry = val;
    },
    selectFormat(val) {
      this.selectedFormat = val;
    }
  }
};
</script>
