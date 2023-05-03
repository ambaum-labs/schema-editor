<script>
import { mapWritableState } from 'pinia';
import { useOptionsStore } from '@/stores/options';

export default {
  props: {
    active: { type: Boolean, default: false },
  },

  computed: {
    ...mapWritableState(useOptionsStore, [
      'codeOptions',
    ]),

    codeOptionsArray() {
      return Object.entries(this.codeOptions);
    },

    fieldType() {
      return (value) => {
        if (typeof value === 'boolean') {
          return 'checkbox';
        } else if (parseInt(value) == value) {
          return 'number';
        } else {
          return 'text';
        }
      };
    },

    displayKey() {
      return key => key.replace(/([A-Z])/g, ' $1').toLowerCase();
    },
  },

  methods: {
    saveOption({ currentTarget }, group, key, currentValue) {
      if (this.fieldType(currentValue) === 'checkbox') {
        this[group][key] = !currentValue;
      } else {
        this[group][key] = Number(currentTarget.value.trim());
      }
    },
  },
};
</script>

<template>
  <div v-show="active">
    <h2 class="text-lg font-semibold mb-3">Schema output options</h2>
    <div
      v-for="([key, value]) in codeOptionsArray"
      :key="key"
      class="flex items-center mb-3"
    >
      <label
        :for="`code-${key}`"
        class="w-[120px] mr-3"
      >{{ displayKey(key) }}</label>
      <input
        :id="`code-${key}`"
        :type="fieldType(value)"
        :value="value"
        :checked="fieldType(value) === 'checkbox' && value"
        :class="fieldType(value) === 'checkbox' ? ['h-5','w-5', 'flex-0'] : ['flex-1', 'py-1.5', 'px-3']"
        class="min-w-0 bg-slate-700 leading-none"
        @input="(e) => saveOption(e, 'codeOptions', key, value)"
      >
    </div>
  </div>
</template>
