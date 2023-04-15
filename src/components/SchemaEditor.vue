<script>
import Card from './Card.vue';

export default {
  props: {
    name: { type: String, default: '' },
    tag: '',
    sectionClass: '',
    limit: 0,
    settings: { type: Array, default: () => ([]) },
  },

  components: {
    Card,
  },

  emits: ['rename', 'tag', 'setClass', 'setLimit', 'updateSettings'],
};
</script>

<template>
  <Card>
    <div class="flex items-center mb-3">
      <label
        for="name"
        class="w-[60px] mr-3"
      >Name:</label>
      <input
        id="name"
        class="flex-1 bg-slate-700 p-3"
        :value="name"
        @input="(e) => $emit('rename', e.currentTarget.value)"
      >
    </div>
    <div class="flex items-center mb-3">
      <label
        for="tag"
        class="w-[60px] mr-3"
      >Tag:</label>
      <input
        id="tag"
        class="flex-1 bg-slate-700 p-3"
        :value="tag"
        @input="(e) => $emit('tag', e.currentTarget.value)"
      >
    </div>
    <div class="flex items-center mb-3">
      <label
        for="class"
        class="w-[60px] mr-3"
      >Class:</label>
      <input
        id="class"
        class="flex-1 bg-slate-700 p-3"
        :value="sectionClass"
        @input="(e) => $emit('setClass', e.currentTarget.value)"
      >
    </div>
    <div class="flex items-center mb-3">
      <label
        for="limit"
        class="w-[60px] mr-3"
      >Limit:</label>
      <input
        id="limit"
        type="number"
        class="flex-1 bg-slate-700 p-3"
        :value="limit"
        @input="(e) => $emit('setLimit', e.currentTarget.value)"
      >
    </div>
    <h1 class="text-lg font-semibold mb-3">Settings</h1>
  </Card>
</template>
