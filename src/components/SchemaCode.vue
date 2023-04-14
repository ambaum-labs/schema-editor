<script>
import Card from './Card.vue';

export default {
  props: {
    schema: { type: String, default: '' },
  },

  components: {
    Card,
  },

  watch: {
    schema(newValue) {
      this.code = newValue;
    },
  },

  data() {
    return {
      code: this.schema,
    };
  },
};
</script>

<template>
  <Card class="flex flex-col">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-semibold">Schema Code</h2>
      <p class="text-sm">Schema will update automatically as you edit</p>
    </div>
    <textarea
      class="flex-1 bg-slate-700 p-3"
      v-model="code"
    />
    <div class="flex items-center justify-between mt-3">
      <p>To import an existing schema, paste it in the box and click import ➔</p>
      <button
        class="rounded-md px-5 py-1 bg-yellow-400 text-slate-900 font-semibold uppercase text-sm"
        @click="$emit('import', code)"
      >Import</button>
    </div>
  </Card>
</template>
