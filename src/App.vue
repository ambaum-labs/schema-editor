<script>
import AmbaumLogo from './components/icons/AmbaumLogo.vue';
import ShopifyLogo from './components/icons/ShopifyLogo.vue';
import SchemaEditor from './components/SchemaEditor.vue';
import BlocksEditor from './components/BlocksEditor.vue';
import SchemaCode from './components/SchemaCode.vue';
import generateSchema from './schema';

export default {
  components: {
    AmbaumLogo,
    ShopifyLogo,
    SchemaEditor,
    BlocksEditor,
    SchemaCode,
  },

  data() {
    return {
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
    };
  },

  computed: {
    schema() {
      return generateSchema({
        ...this.general,
        settings: this.settings,
        blocks: this.blocks,
        presets: this.presets,
      });
    },
  },

  methods: {
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
};
</script>

<template>
  <header class="flex-0 px-5">
    <div class="flex items-center justify-between py-3">
      <div class="flex items-center">
        <div class="pr-5 border-r-2 border-yellow-400">
          <ShopifyLogo height="40" width="140" />
        </div>
        <h1 class="mt-1 ml-5 text-3xl font-semibold">Schema Editor</h1>
      </div>
      <a href="https://ambaum.com" target="_blank" class="text-xs text-center">
        Powered by
        <AmbaumLogo class="justify-self-end" height="25" width="190" />
      </a>
    </div>
  </header>

  <main class="flex flex-1 py-5 pl-5 max-h-[calc(100vh-65px)]">
    <SchemaEditor class="basis-1/3 mr-5"
      v-bind="general"
      :settings="settings"
      @setGeneral="(key, value) => general[key] = value"
      @setSetting="(index, setting) => {
        if (index < settings.length) {
          settings[index] = setting;
        } else {
          settings.push(setting);
        }
      }"
    />
    <BlocksEditor class="basis-1/3 mr-5" />
    <SchemaCode
      class="basis-1/3 mr-5"
      :schema="schema"
      @import="loadFromSchema"
    />
  </main>
</template>
