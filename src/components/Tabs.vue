<script>
export default {
  props: {
    tabs: { type: Array, default: () => ([]) },
    active: { type: String, default: '' },
  },

  computed: {
    classes() {
      return (index, value) => ({
        'bg-slate-700': value !== this.active,
        'border-e-2': index < this.tabs.length - 1,
      });
    },
  },
};
</script>

<template>
  <div class="flex mb-5">
    <button 
      v-for="(tab, i) in tabs"
      :class="classes(i, tab.value)"
      class="py-2 px-5 font-semibold border-slate-800"
      @click="$emit('change', tab.value)"
    >
      {{ tab.title }}
    </button>
  </div>
</template>
