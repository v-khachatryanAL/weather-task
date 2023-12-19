<template>
  <div class="d-flex flex-column weather-component">
    <div class="weather-component__wrapper" v-if="model">
      <div class="current-weather d-flex align-center justify-space-between">
        <div class="d-flex align-center fill-height">
          <div class="current-weather__icon" v-bind:style="{
            backgroundImage: 'url(' + currentWeatherIcon + ')',
          }"></div>
          <div class="d-flex flex-column align-center">
            <div class="current-weather__now">
              <div class="d-flex align-start">
                <h2>{{ calculateWeather(currentTemp) }}</h2>
                <span>{{ weatherFormat }}</span>
              </div>
            </div>
            <span class="current-weather__minmax">{{ calculateWeather(currentTempMin) }}{{ weatherFormat }} / {{
              calculateWeather(currentTempMax) }}{{ weatherFormat }}</span>
          </div>
          <div class="d-flex flex-column fill-height justify-space-between current-weather__info">
            <div class="d-flex align-center current-weather__info-wrapper">
              <img src="@/assets/pressure.svg" alt="pressure icon" />
              <span>Pressure:&nbsp;</span><b>{{ model.main.pressure }} hPa</b>
            </div>
            <div class="d-flex align-center current-weather__info-wrapper">
              <img src="@/assets/humidity.svg" alt="humidity icon" />
              <span>Humidity:&nbsp;</span><b>{{ model.main.humidity }}%</b>
            </div>
            <div class="d-flex align-center current-weather__info-wrapper">
              <img src="@/assets/wind.svg" alt="wind icon" />
              <span>Wind:&nbsp;</span><b>{{ model.wind.speed }} m/s N</b>
            </div>
          </div>
        </div>

        <div class="d-flex">
          <div class="d-flex align-end flex-column justify-space-between fill-height">
            <div class="weather-component__country">
              {{ model.name }}, {{ model.sys.country }}
            </div>
            <div class="weather-component__time">
              {{ currentDate }}
            </div>
            <div class="weather-component__weather">
              {{ model.weather[0].main }}
            </div>
          </div>

          <div class="weather-component__arrow d-flex justify-center align-center">
            <v-icon large @click="onExpand">mdi-chevron-down</v-icon>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isExpanded && weekModel" class="weather-component__week">
      <div class="weekly-weather d-flex flex-column align-center" v-for="(item, index) in weekModel.daily" :key="index">
        <div class="weekly-weather__wrapper d-flex flex-column align-center" @click="onSelectDay(item)">
          <div class="weekly-weather__day">{{ getDay(item.dt) }}</div>
          <div class="weekly-weather__icon" v-bind:style="{
            backgroundImage: 'url(' + getDayIcon(item.weather[0].icon) + ')',
          }"></div>
          <div class="weekly-weather__minmax" v-html="getDayMinMax(item.temp.min, item.temp.max)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios"
import { mapGetters } from "vuex"

export default {
  name: "WeatherComponent",
  props: {
    selectedCountry: Object,
    selectedFormat: {
      type: String,
      default: 'C'
    }
  },
  data() {
    return {
      model: null,
      weekModel: null,
      isExpanded: false,
      selectedDay: null,
      lat: null,
      lon: null,
    };
  },
  computed: {
    ...mapGetters({
      weatherData: "weather/weatherData",
      weatherLoading: "weather/weatherLoading",
      weatherWeekData: "weather/weatherWeekData",
      weatherWeekLoading: "weather/weatherWeekLoading",
      userLocationData: "location/userLocationData",
      userLocationLoading: "location/userLocationLoading",
    }),
    currentDate() {
      const mL = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const date = new Date(this.model.dt * 1000);
      let day = date.getDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      if (hours < 10) hours = "0" + hours;
      if (minutes < 10) minutes = "0" + minutes;
      return `${mL[date.getMonth()]} ${day} | ${hours}:${minutes}`;
    },
    currentWeatherIcon() {
      return `http://openweathermap.org/img/wn/${this.model.weather[0].icon}@2x.png`;
    },
    currentTemp() {
      return Math.round(this.model.main.temp);
    },
    currentTempMin() {
      return Math.round(this.model.main.temp_min);
    },
    currentTempMax() {
      return Math.round(this.model.main.temp_max);
    },
    weatherFormat() {
      if (this.selectedFormat === 'C') {
        return '°C'
      } else if (this.selectedFormat === 'F') {
        return '°F'
      } else {
        return 'K'
      }
    }
  },
  methods: {
    calculateWeather(value) {
      if (this.selectedFormat === 'C') {
        return value
      } else if (this.selectedFormat === 'F') {
        return (value * 1.8) + 32
      } else {
        return value + 237.15
      }
    },
    async onExpand() {
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded && !this.weekModel) {
        this.$store.dispatch('weather/getWeekWeather', {
          lat: this.lat,
          lon: this.lon,
        })
      }
    },

    onSelectDay(item) {
      this.model = {
        ...this.model,
        weather: item.weather,
        main: {
          temp: item.temp.day,
          feels_like: item.feels_like.day,
          temp_min: item.temp.min,
          temp_max: item.temp.max,
          pressure: item.pressure,
          humidity: item.humidity,
        },
        wind: {
          speed: item.wind_speed,
          deg: item.wind_deg,
        },
        dt: item.dt,
      };
    },
    getDay(dt) {
      var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const date = new Date(dt * 1000);
      return `${days[date.getDay()]}`;
    },
    getDayIcon(icon) {
      return `http://openweathermap.org/img/wn/${icon}@2x.png`;
    },
    getDayMinMax(min, max) {
      return `${Math.round(this.calculateWeather(min))}&#176;/${Math.round(this.calculateWeather(max))}&#176;`;
    },
  },
  created() {
    this.$store.dispatch('location/getUserLocation');
  },
  watch: {
    async selectedCountry(val) {
      this.lat = val.coords.lat;
      this.lon = val.coords.lng;
      this.$store.dispatch('weather/getWeather', { lat: this.lat, lon: this.lon });
      this.$store.dispatch('weather/getWeekWeather', { lat: this.lat, lon: this.lon });
    },
    weatherLoading(val) {
      if (!val) {
        this.model = this.weatherData;
      }
    },
    weatherWeekLoading(val) {
      if (!val) {
        this.weekModel = this.weatherWeekData;
      }
    },
    userLocationLoading(val) {
      if (!val) {
        const coords = this.userLocationData.loc.split(',');
        this.lat = coords[0]
        this.lon = coords[1]
        this.$store.dispatch('weather/getWeather', { lat: this.lat, lon: this.lon })
      }
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;1,700&display=swap");

.weather-component {
  font-family: "Noto Sans";
  background: #fafafa;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  width: 100%;

  &__wrapper {
    width: 100%;
    padding: 17px 40px;
  }

  &__week {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    border-top: 1px solid #e6e6e6;
    padding: 30px 30px 50px;
    overflow-x: auto;

    .weekly-weather {
      &__wrapper {
        width: 136px;
        border-radius: 10px;
        cursor: pointer;

        &:hover {
          background-color: rgba(203, 32, 40, 0.2);
        }
      }

      &:not(:last-child) {
        border-right: 1px solid #c4c4c4;
      }

      &__day {
        font-size: 20px;
      }

      &__icon {
        width: 70px;
        height: 50px;
        background-position: center;
        margin: 10px 0;
      }

      &__minmax {
        font-size: 24px;
        color: #cb2028;
      }
    }
  }

  .current-weather {
    height: 80px;

    @media (max-width: 760px) {
      flex-direction: column;
      gap: 20px;
      height: auto;
    }

    &__icon {
      width: 70px;
      height: 70px;
      background-position: center;
      margin-right: 15px;
    }

    &__now {
      text-align: center;

      h2 {
        font-style: normal;
        font-weight: normal;
        font-size: 48px;
        line-height: 48px;
      }

      span {
        font-style: normal;
        font-weight: normal;
        font-size: 25px;
      }
    }

    &__minmax {
      font-size: 16px;
    }

    &__info {
      padding-left: 20px;
      margin-left: 20px;
      border-left: 1px solid #77777791;

      &-wrapper {
        font-size: 14px;

        span {
          color: #777777;
        }
      }

      img {
        height: 15px;
        width: 15px;
        margin-right: 12px;
      }
    }
  }

  &__country {
    font-weight: 500;
    font-size: 24px;
    line-height: 33px;
    color: #cb2028;
  }

  &__time {
    font-size: 16px;
    line-height: 22px;
    color: #777777;
  }

  &__weather {
    font-size: 18px;
    line-height: 25px;
    font-style: italic;
  }

  &__arrow {
    margin-left: 30px;
  }

  .fill-height {
    height: 100%;
  }
}
</style>
