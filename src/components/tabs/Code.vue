<script>
import { mapState, mapActions } from 'pinia';
import { useSchemaStore } from '@/stores/schema';

export default {
  props: {
    active: { type: Boolean, default: false },
  },

  watch: {
    schema: {
      immediate: true,
      handler(newValue) {
        this.code = newValue;
      },
    },
  },

  computed: {
    ...mapState(useSchemaStore, [
      'schema',
    ]),
  },

  data() {
    return {
      code: '',
    };
  },

  methods: {
    ...mapActions(useSchemaStore, [
      'loadFromSchema',
    ]),
  },
};
</script>

<template>
  <div
    v-show="active"
    class="h-full flex flex-col"
  >
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-semibold shrink-0">Schema Code</h2>
      <p class="text-sm text-right">Schema will update automatically</p>
    </div>
    <textarea
      class="flex-1 min-h-[200px] xl:min-h-0 bg-slate-700 p-3"
      v-model="code"
    />
    <div class="flex items-center justify-between mt-3">
      <p class="text-sm mr-3">To work with an existing schema, paste it and click import</p>
      <button
        class="rounded-md px-5 py-1 bg-yellow-400 text-slate-900 font-semibold uppercase text-sm"
        @click="() => loadFromSchema(code)"
      >Import</button>
    </div>
  </div>
</template>
