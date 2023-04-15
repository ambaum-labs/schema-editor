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

  emits: ['setGeneral', 'setSettings'],

  data() {
    return {
      validTags: [
        'article',
        'aside',
        'div',
        'footer',
        'header',
        'section',
      ],
    };
  },
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
        class="flex-1 bg-slate-700 py-1.5 px-3"
        :value="name"
        @input="(e) => $emit('setGeneral', 'name', e.currentTarget.value.trim())"
      >
    </div>
    <div class="flex items-center mb-3">
      <label
        for="tag"
        class="w-[60px] mr-3"
      >Tag:</label>
      <select
        id="tag"
        class="flex-1 bg-slate-700 py-1.5 px-3"
        :value="tag"
        @input="(e) => $emit('setGeneral', 'tag', e.currentTarget.value.trim())"
      >
        <option></option>
        <option v-for="tag in validTags">{{ tag }}</option>
      </select>
    </div>
    <div class="flex items-center mb-3">
      <label
        for="class"
        class="w-[60px] mr-3"
      >Class:</label>
      <input
        id="class"
        class="flex-1 bg-slate-700 py-1.5 px-3"
        :value="sectionClass"
        @input="(e) => $emit('setGeneral', 'sectionClass', e.currentTarget.value.trim())"
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
        class="flex-1 bg-slate-700 py-1.5 px-3"
        min="0"
        :value="limit"
        @input="(e) => $emit('setGeneral', 'limit', e.currentTarget.value >= 0 ? Number(e.currentTarget.value) : 0)"
      >
    </div>
    <h1 class="text-lg font-semibold mb-3">Settings</h1>
  </Card>
</template>
