<script>
export default {
  props: {
    padded: { type: Boolean, default: true },
  },

  computed: {
    classes() {
      return {
        'px-5': this.padded,
        'py-4': this.padded,
      };
    },
  },
};
</script>

<template>
  <div
    :class="classes"
    class="border rounded border-slate-700"
  >
    <slot />
  </div>
</template>
