<script>
import { mapWritableState } from 'pinia';
import { useSchemaStore } from '@/stores/schema';

export default {
  props: {
    active: { type: Boolean, default: false },
  },

  computed: {
    ...mapWritableState(useSchemaStore, [
      'general',
    ]),
  },

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
  <div v-show="active">
    <div class="flex items-center mb-3">
      <label
        for="name"
        class="w-[60px] mr-3"
      >name</label>
      <input
        id="name"
        class="flex-1 bg-slate-700 py-1.5 px-3 leading-none"
        :value="general.name"
        @input="({ currentTarget }) => general.name = currentTarget.value.trim()"
      >
    </div>
    <div class="flex items-center mb-3">
      <label
        for="tag"
        class="w-[60px] mr-3"
      >tag</label>
      <select
        id="tag"
        class="flex-1 bg-slate-700 py-1.5 px-3 leading-none"
        :value="general.tag"
        @input="({ currentTarget }) => general.tag = currentTarget.value.trim()"
      >
        <option></option>
        <option v-for="tag in validTags">{{ tag }}</option>
      </select>
    </div>
    <div class="flex items-center mb-3">
      <label
        for="class"
        class="w-[60px] mr-3"
      >class</label>
      <input
        id="class"
        class="flex-1 bg-slate-700 py-1.5 px-3 leading-none"
        :value="general.sectionClass"
        @input="({ currentTarget }) => general.sectionClass = currentTarget.value.trim()"
      >
    </div>
    <div class="flex items-center mb-3">
      <label
        for="limit"
        class="w-[60px] mr-3"
      >limit</label>
      <input
        id="limit"
        type="number"
        class="flex-1 bg-slate-700 py-1.5 px-3 leading-none"
        min="0"
        :value="general.limit"
        @input="({ currentTarget }) => (general.limit = currentTarget.value >= 0 ? Number(currentTarget.value) : 0)"
      >
    </div>
  </div>
</template>
