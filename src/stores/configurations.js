import { defineStore } from 'pinia';
import { useSchemaStore } from '@/stores/schema';

export const useConfigurationStore = defineStore('configurations', {
  state: () => ({
    configurations: [],
  }),

  actions: {
    loadSaved() {
      const savedJSON = localStorage.getItem('configurations');
      if (!savedJSON) {
        return;
      }

      try {
        this.configurations = JSON.parse(savedJSON);
      } catch(err) {
        console.error('Failed to parse configurations');
      }
    },

    getConfiguration(selectedName) {
      return this.configurations.find(({ name }) => name === selectedName);
    },

    loadConfiguration(selectedName) {
      const { general, settings, blocks, locales, presets, default: defaultSettings } = this.getConfiguration(selectedName);
      const schema = useSchemaStore();
      schema.general = general || {};
      schema.settings = settings || [];
      schema.blocks = blocks || [];
      schema.locales = locales || {};
      schema.presets = presets || [];
      schema.default = defaultSettings || {};
    },

    saveConfiguration(name) {
      const { general, settings, blocks, locales, presets, default: defaults } = useSchemaStore();
      this.configurations.push({
        name,
        general,
        settings,
        blocks,
        locales,
        presets,
        default: defaults,
      });
      localStorage.setItem('configurations', JSON.stringify(this.configurations));
    },

    deleteConfiguration(selectedName) {
      const index = this.configurations.findIndex(({ name }) => name === selectedName);
      this.configurations.splice(index, 1);
      localStorage.setItem('configurations', JSON.stringify(this.configurations));
    },
  },
});
