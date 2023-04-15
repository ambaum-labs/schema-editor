<script>
import Card from './Card.vue';
import Tabs from './Tabs.vue';

export default {
  props: {
    schema: { type: String, default: '' },
    savedConfigurations: { type: Array, default: () => ([]) },
  },

  components: {
    Card,
    Tabs,
  },

  watch: {
    schema(newValue) {
      this.code = newValue;
    },

    savedConfigurations: {
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

  data() {
    return {
      tabs: [
        { title: 'Code', value: 'code' },
        { title: 'Saved', value: 'saved' },
        { title: 'Options', value: 'options' },
      ],
      activeTab: 'code',
      code: this.schema,
      exportUrl: null,
    };
  },

  methods: {
    saveConfiguration() {
      this.$emit('saveConfiguration', this.$refs.configurationName.value.trim());
      this.$refs.configurationName.value = '';
    },

    loadConfiguration(name) {
      this.$emit('loadConfiguration', name);
      this.activeTab = 'code';
    },
  },
};
</script>

<template>
  <Card :padded="false" class="flex flex-col">
    <Tabs
      :tabs="tabs"
      :active="activeTab"
      @change="(tab) => activeTab = tab"
    />
    <div class="pb-4 px-5 flex-1 overflow-hidden">
      <div
        v-show="activeTab === 'code'"
        class="h-full flex flex-col"
      >
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold">Schema Code</h2>
          <p class="text-sm">Schema will update automatically</p>
        </div>
        <textarea
          class="flex-1 bg-slate-700 p-3"
          v-model="code"
        />
        <div class="flex items-center justify-between mt-3">
          <p class="text-sm mr-3">To work with an existing schema, paste it and click import</p>
          <button
            class="rounded-md px-5 py-1 bg-yellow-400 text-slate-900 font-semibold uppercase text-sm"
            @click="$emit('import', code)"
          >Import</button>
        </div>
      </div>
      <div
        v-show="activeTab === 'saved'"
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
            @keyup.enter="saveConfiguration"
          >
          <button
            class="rounded-md px-5 py-1 bg-yellow-400 text-slate-900 font-semibold uppercase text-sm"
            @click="saveConfiguration"
          >Save</button>
        </div>
        <h2 class="text-lg font-semibold mb-3">Saved Configurations</h2>
        <div class="overflow-y-auto flex-1 flex flex-col bg-slate-700">
          <div
            v-for="configuration in savedConfigurations"
            :key="configuration.name"
            class="flex items-start border-t border-slate-900 last:border-b py-2 px-3"
          >
            <div class="flex-1">{{ configuration.name }}</div>
            <button
              class="ml-5 px-2 py-0.5 font-semibold uppercase text-sm"
              @click="() => loadConfiguration(configuration.name)"
            >
              Load
            </button>
            <button
              class="px-2 py-0.5 text-red-300 font-semibold uppercase text-sm"
              @click="$emit('deleteConfiguration', configuration.name)"
            >
              Delete
            </button>
          </div>
        </div>
        <div class="flex items-center pt-3">
          <p class="text-sm mr-3">Save or load your configurations from file</p>
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
      <div v-show="activeTab === 'settings'">
        <h2 class="text-lg font-semibold">Settings</h2>
      </div>
    </div>
  </Card>
</template>
