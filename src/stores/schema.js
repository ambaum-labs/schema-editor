import { defineStore } from 'pinia';
import { useOptionsStore } from '@/stores/options';
import generateSchema from '@/schema';
import { applyHiddenFields, createSetting } from '@/settings';

/**
 * URL may contain a base64 encoded JSON payload containing
 * a schema definition.  If one exists and is valid, we use
 * that for initial population
 */
function getSchemaFromUrl() {
  const urlPayload = window.location.pathname.split('/').pop();
  try {
    return JSON.parse(atob(urlPayload));
  } catch (err) {
    return undefined;
  }
}

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
    locales: {},
    presets: [],
    defaultPreset: {},
  };
}

export const useSchemaStore = defineStore('schema', {
  state: () => ({
    ...(getSchemaFromUrl() ?? defaultState()),
  }),

  getters: {
    schema: (state) => {
      const { codeOptions } = useOptionsStore();
      return generateSchema({
        ...state.general,
        settings: state.settings,
        blocks: state.blocks,
        locales: state.locales,
        presets: state.presets,
        defaultPreset: state.defaultPreset,
        codeOptions,
      });
    },
  },

  actions: {
    loadFromSchema(newSchema) {
      const jsonString = newSchema.replace(/\{%[^%]+%\}/g, '').trim();
      try {
        const { name, tag, class: sectionClass, limit, max_blocks: maxBlocks, settings, blocks, locales, presets, default: defaultPreset } = JSON.parse(jsonString);
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
        this.locales = Object.assign({}, defaults.locales);
        Object.entries(locales).forEach(([language, translations]) => {
          this.locales[language] = applyHiddenFields({ translations: Object.entries(translations).map(([key, value]) => ({ key, value })) });
        });
        this.presets = (presets || defaults.presets).map((preset) => {
          if (preset?.blocks?.length) {
            preset.blocks = preset.blocks.map(block => applyHiddenFields(block))
          }
          return applyHiddenFields(preset);
        });
        this.defaultPreset = (defaultPreset || defaults.defaultPreset);
        if (this.defaultPreset?.blocks?.length) {
          this.defaultPreset.blocks = this.defaultPreset.blocks.map(block => applyHiddenFields(block)) || [];
        }
      } catch(err) {
        console.log(err);
        console.error('Schema parsing failed');
      }
    },

    async getShareLink() {
      const { protocol, host } = window.location;
      const data = {
        general: this.general,
        settings: this.settings,
        blocks: this.blocks,
        locales: this.locales,
        presets: this.presets,
        defaultPreset: this.defaultPreset,
      };
      return `${protocol}//${host}/${btoa(JSON.stringify(data))}`;
    },
  },
});
