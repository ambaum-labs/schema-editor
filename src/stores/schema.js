import { defineStore } from 'pinia';
import { useOptionsStore } from '@/stores/options';
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
    locales: {},
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
    async getSchemaFromUrl() {
      const recordId = window.location.pathname.split('/').pop().trim();
      if (!recordId) {
        return;
      }

      try {
        const { data } = await fetch(`https://api.myjson.online/v1/records/${recordId}`).then(res => res.json());
        this.general = data.general || this.general;
        this.settings = data.settings || this.settings;
        this.blocks = data.blocks || this.blocks;
        this.locales = data.locales || this.locales;
        this.presets = data.presets || this.presets;
        this.defaultPreset = data.defaultPreset || this.defaultPreset;
      } catch (err) {
        return undefined;
      }
    },

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
        Object.entries(locales || {}).forEach(([language, translations]) => {
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

      const body = new URLSearchParams();
      body.append('jsonData', JSON.stringify(data));
      body.append('collectionId', '77529fe1-f1fd-4c41-899f-4a2be20ae8b7');

      const { id } = await fetch('https://api.myjson.online/v1/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      }).then(res => res.json());

      return `${protocol}//${host}/${id}`;
    },
  },
});
