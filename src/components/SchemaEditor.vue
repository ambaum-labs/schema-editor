<script>
import Card from './Card.vue';

export default {
  props: {
    name: { type: String, default: '' },
    settings: { type: Array, default: () => ([]) },
  },

  components: {
    Card,
  },

  emits: ['rename', 'update'],
};
</script>

<template>
  <Card>
    <h1 class="text-lg font-semibold mb-3">Schema Editor</h1>
    <div class="flex items-center my-3">
      <label
        for="name"
        class="mr-3"
      >Name:</label>
      <input
        id="name"
        class="flex-1 bg-slate-700 p-3"
        :value="name"
        @input="(e) => $emit('rename', e.currentTarget.value)"
      >
    </div>
  </Card>
</template>
