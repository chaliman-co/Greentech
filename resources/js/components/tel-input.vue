<template>
    <div style="height:50px">
        <div class="btn-group flags-dropdown" style="height: 100%">
            <Dropdown v-model="selectedCountry" :options="countries" optionLabel="name" placeholder="Select a Country"
                class="w-full md:w-14rem">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                        <img :alt="slotProps.value.label" :src="`${countryFlagsUrl}/${slotProps.value.code}.svg`">
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #option="slotProps">
                    <div class="flex align-items-center">
                        <img :alt="slotProps.option.label" :src="`${countryFlagsUrl}/${slotProps.option.code}.svg`"
                            style="width: 18px" />
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </Dropdown>
            <!-- <button
        type="button"
        class="btn btn-default dropdown-toggle country-options"
        data-toggle="dropdown">
        <img
          :src="`${countryFlagsUrl}/${countryCode}.png`"
          :alt="`${countryCode}`"
          class="selected-image"
          style="">
      </button> -->
            <!-- <ul
        class="dropdown-menu country-menu"
        role="menu">
        <li
          v-for="(countryInfo, index) in countries"
          :key="index">
          <a
            href="#"
            @click.prevent="setCountryCode(countryInfo[1].toUpperCase())">
            <img
              :src="`${countryFlagsUrl}/${countryInfo[1].toUpperCase()}.png`"
              :alt="`${countryInfo[1]}`"
              class="dropdown-image"> {{ countryInfo[0] }} +{{ countryInfo[2] }}
          </a>
        </li>
      </ul> -->
        </div>
        <div class="input-wrapper">

            <input :id="inputId" ref="input" v-model="rawInput" :class="validity" :required="required" type="text"
                class="form-control number-input" @input.stop="onChange">

        </div>
    </div>
</template>

<script>
import Libphonenumber from 'google-libphonenumber';
import countries from '@/assets/countries.json';
import Dropdown from 'primevue/dropdown'

const phoneUtil = Libphonenumber.PhoneNumberUtil.getInstance();
export default {
    props: ['value', 'required', 'errorMessage'],
    data() {
        return {
            countryFlagsUrl: 'https://raw.githubusercontent.com/lipis/flag-icons/1734912defc091ebaa46d46fdacd564425e643c0/flags/1x1',
            countries,
            selectedCountry: countries[0],
            rawInput: null,
            formatter: new Libphonenumber.AsYouTypeFormatter(countries[0].code),
            isValid: false,
        };
    },
    computed: {
        validity() {
            return this.isValid ? 'is-valid' : 'is-invalid';
        },
    },
    watch: {
        selectedCountry() {
            this.onChange()
        },
        rawInput() {
            this.onChange()
        },
    },
    created() {
        fetch('https://ipinfo.io/json')
            .then(response => response.json())
            .then((data) => {
                if (data.country) {
                    this.selectedCountry = this.countries.find(country => country.code == data.country.toLowerCase());
                    this.formatter = new Libphonenumber.AsYouTypeFormatter(data.country);
                }
            })
            .catch(err => {
            });
    },
    methods: {
        onChange() {
            const input = this.rawInput ? this.rawInput.replace(/ /g, '') : null;
            let number;
            let isValid = false;

            if (!input) return;

            this.formatter.clear();

            for (const digit of input) {
                this.formatter.inputDigit(digit);
            }

            try {
                number = phoneUtil.parseAndKeepRawInput(input, this.selectedCountry.code);
                isValid = phoneUtil.isValidNumberForRegion(number, this.selectedCountry.code);
            } catch (err) {
            }

            if (isValid) {
                this.$refs.input.setCustomValidity('');
                this.rawInput = phoneUtil.format(number, 1).trim();
                this.isValid = true;
                this.$emit('input', this.currentValue = {
                    region: this.selectedCountry.code,
                    digits: this.rawInput,
                    isValid: true,
                });
                return;
            }
            this.isValid = false;
            this.rawInput = this.formatter.currentOutput_.trim();
            this.$refs.input.setCustomValidity(this.errorMessage);
            this.$emit('input', this.currentValue = {
                region: this.selectedCountry.code,
                digits: this.rawInput,
                isValid: false,
            });
        },
    },
    components: { Dropdown }

};
</script>

<style>
.flags-dropdown,
.number-input {
    float: left;
    display: inline-block;
}

.flags-dropdown {
    height: 100%;
    overflow: hidden;
    width: 70px;
    border: 2px rgba(100, 100, 100, 0.3) solid;
    background-color: rgba(240, 240, 240, 1);

    border-radius: 10%;
}

.flags-dropdown img {
    width: calc(0.6 * 60px)
}

.number-input {
    width: 100%;
    height: 100%;
}

.dropdown-image {
    display: inline-block;
    height: 18px;
    width: 8%;
}

.input-wrapper {
    overflow: hidden;
    height: 49px;
}

.selected-image {
    height: 100%;
    width: 100%;
}

.country-menu {
    overflow-y: scroll;
    max-height: 280px;
    overflow-x: hidden;
}

.flags-dropdown button {
    border: 0;
    width: 100%;
    margin: 0 !important;
    padding: 10% !important;
    background-color: burlywood;
    height: 40px;
}

.p-dropdown,
.p-dropdown-label,
.p-dropdown-label div {
    width: inherit !important;
    height: inherit;
}

.is-valid {

    border: 2px green solid !important;
}

.is-invalid {

    border: 2px red solid !important;
}</style>
