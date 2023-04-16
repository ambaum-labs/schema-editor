<script>
export default {
  props: {
    active: { type: Boolean, default: false },
  },
};
</script>

<template>
  <div v-show="active">
    <h1 class="text-lg font-semibold mb-3">Presets</h1>
  </div>
</template>
