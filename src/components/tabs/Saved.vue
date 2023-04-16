<script>
import { mapState, mapActions } from 'pinia';
import { useConfigurationStore } from '@/stores/configurations';

export default {
  props: {
    active: { type: Boolean, default: false },
  },

  watch: {
    configurations: {
      immediate: true,
      handler(newConfigurations) {
        URL.revokeObjectURL(this.exportUrl);
        const file = new Blob(
          [JSON.stringify(newConfigurations)],
          { type: 'application/json' }
        );
        this.exportUrl = URL.createObjectURL(file);
      },
    },
  },

  computed: {
    ...mapState(useConfigurationStore, [
      'configurations',
    ]),
  },

  data() {
    return {
      exportUrl: null,
    };
  },

  created() {
    this.loadSaved();
  },

  methods: {
    ...mapActions(useConfigurationStore, [
      'loadSaved',
      'loadConfiguration',
      'saveConfiguration',
      'deleteConfiguration',
    ]),

    saveCurrent() {
      this.saveConfiguration(this.$refs.configurationName.value.trim());
      this.$refs.configurationName.value = '';
    },

    loadSelected(name) {
      this.loadConfiguration(name);
      this.$emit('changeTab', 'code');
    },
  },
};
</script>

<template>
  <div
    v-show="active"
    class="h-full flex-0 flex flex-col"
  >
    <p class="text-sm">Save your current configuration for later</p>
    <div class="flex items-center justify-between mt-3 mb-5">
      <label
        for="configuration-name"
        class="w-[60px] mr-3"
      >Name</label>
      <input
        ref="configurationName"
        id="configuration-name"
        class="flex-1 bg-slate-700 py-1.5 px-3 mr-6 leading-none"
        @keyup.enter="saveCurrent"
      >
      <button
        class="rounded-md px-5 py-1 bg-yellow-400 text-slate-900 font-semibold uppercase text-sm"
        @click="saveCurrent"
      >Save</button>
    </div>
    <h2 class="text-lg font-semibold mb-3">Saved Configurations</h2>
    <div class="overflow-y-auto flex-1 flex flex-col bg-slate-700">
      <div
        v-for="configuration in configurations"
        :key="configuration.name"
        class="flex items-start border-t border-slate-900 last:border-b py-2 px-3"
      >
        <div class="flex-1">{{ configuration.name }}</div>
        <button
          class="ml-5 px-2 py-0.5 font-semibold uppercase text-sm"
          @click="() => loadSelected(configuration.name)"
        >
          Load
        </button>
        <button
          class="px-2 py-0.5 text-red-300 font-semibold uppercase text-sm"
          @click="() => deleteConfiguration(configuration.name)"
        >
          Delete
        </button>
      </div>
    </div>
    <div class="flex items-center pt-3">
      <p class="text-sm mr-3 flex-1">Save or load your configurations from file</p>
      <button
        class="rounded-md px-5 py-1 mr-3 bg-yellow-400 text-slate-900 font-semibold uppercase text-sm"
        @click=""
      >Import</button>
      <a
        :href="exportUrl"
        download="schema-editor-presets.json"
        class="rounded-md px-5 py-1 bg-yellow-400 text-slate-900 font-semibold uppercase text-sm"
      >Export</a>
    </div>
  </div>
</template>
