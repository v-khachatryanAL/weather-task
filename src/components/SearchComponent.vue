<template>
    <div class="search-component">
        <v-autocomplete 
            label="Search location" 
            v-model="selectedCountry" 
            :search-input.sync="search" 
            :items="countries"
            :loading="locationsLoading" 
            item-text="name" 
            return-object
        >
        </v-autocomplete>
        <v-select
            label="Select format"
            :items="formats"
            v-model="selectedFormat"
            @change="selectFormat"
            item-text="name" 
            item-value="value" 
            return-object
        >
        </v-select>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from "lodash"

export default {
    name: "SearchComponent",
    data() {
        return {
            selectedCountry: '',
            countries: [],
            query: '',
            formats: [ 
                { name: 'Celsius (°C)', value: 'C' },
                { name: 'Fahrenheit (°F)', value: 'F' },
                { name: 'Kelvin (K)', value: 'K' },
            ],
            selectedFormat: 'C'
        };
    },
    methods: {
        loadCountries: _.debounce(async function () {
            if (!this.query) return;
            this.$store.dispatch('location/getLocations', this.query);
        }, 500),
        selectFormat() {
            this.$emit('select-format', this.selectedFormat.value)
        }
    },
    computed: {
        ...mapGetters("location", ['locationsData', 'locationsLoading']),
        search: {
            get() {
                return this.query
            },

            set(searchInput) {
                if (this.query !== searchInput) {
                    this.query = searchInput
                    this.loadCountries();
                }
            }
        }
    },
    watch: {
        selectedCountry(val) {
            this.$emit('select-country', val)
        },
        locationsLoading(val) {
            if (!val) {
                this.countries = this.locationsData;
            }
        }
    }
};
</script>

<style lang="scss"></style>