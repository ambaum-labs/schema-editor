import { defineStore } from 'pinia';
import generateSchema from '@/schema';
import { applyHiddenFields, createSetting } from '@/settings';

function defaultState() {
  return {
    general: {
      name: '',
      tag: '',
      sectionClass: '',
      limit: null,
      maxBlocks: null,
    },
    settings: [
      createSetting(),
    ],
    blocks: [],
    presets: [],
    defaultPreset: {},
  };
}

export const useSchemaStore = defineStore('schema', {
  state: () => ({
    ...defaultState(),
  }),

  getters: {
    schema: (state) => {
      return generateSchema({
        ...state.general,
        settings: state.settings,
        blocks: state.blocks,
        presets: state.presets,
        defaultPreset: state.defaultPreset,
      });
    },
  },

  actions: {
    loadFromSchema(newSchema) {
      const jsonString = newSchema.replace(/\{%[^%]+%\}/g, '').trim();
      try {
        const { name, tag, class: sectionClass, limit, max_blocks: maxBlocks, settings, blocks, presets, default: defaultPreset } = JSON.parse(jsonString);
        const defaults = defaultState();
        this.general.name = name || defaults.general.name;
        this.general.tag = tag || defaults.general.tag;
        this.general.sectionClass = sectionClass || defaults.general.sectionClass;
        this.general.limit = limit || defaults.general.limit;
        this.general.maxBlocks = maxBlocks || defaults.general.maxBlocks;
        this.settings = (settings || defaults.settings).map(setting => applyHiddenFields(setting));
        this.blocks = (blocks || defaults.blocks).map(block => applyHiddenFields(block));
        for (const block of this.blocks) {
          block.settings = block.settings?.map(setting => applyHiddenFields(setting));
        }
        this.presets = (presets || defaults.presets).map(preset => applyHiddenFields(preset));
        for (const preset of this.presets) {
          preset.blocks = preset.blocks?.map(block => applyHiddenFields(block));
        }
        this.defaultPreset = (defaultPreset || defaults.defaultPreset);
        this.defaultPreset.blocks = defaultPreset.blocks?.map(block => applyHiddenFields(block));
      } catch(err) {
        console.log(err);
        console.error('Schema parsing failed');
      }
    },
  },
});
