import { defineStore } from 'pinia';
import generateSchema from '@/schema';

export const useSchemaStore = defineStore('schema', {
  state: () => ({
    general: {
      name: '',
      tag: '',
      sectionClass: '',
      limit: null,
      maxBlocks: null,
    },
    settings: [],
    blocks: [],
    presets: [],
    default: {},
  }),

  getters: {
    schema: (state) => {
      return generateSchema({
        ...state.general,
        settings: state.settings,
        blocks: state.blocks,
        presets: state.presets,
        default: state.default,
      });
    },
  },

  actions: {
    loadFromSchema(newSchema) {
      const jsonString = newSchema.replace(/\{%[^%]+%\}/g, '').trim();
      try {
        const { name, tag, class: sectionClass, limit, max_blocks: maxBlocks, settings, blocks, presets } = JSON.parse(jsonString);
        this.general.name = name || this.general.name;
        this.general.tag = tag || this.general.tag;
        this.general.sectionClass = sectionClass || this.general.sectionClass;
        this.general.limit = limit || this.general.limit;
        this.general.maxBlocks = maxBlocks || this.general.maxBlocks;
        this.settings = settings || this.settings;
        this.blocks = blocks || this.blocks;
        this.presets = presets || this.presets;
      } catch(err) {
        console.error('Schema parsing failed');
      }
    },
  },
});
