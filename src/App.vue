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
      name: '',
      tag: '',
      sectionClass: '',
      limit: '',
      settings: [{test:123}],
      blocks: [],
      presets: [],
    };
  },

  computed: {
    schema() {
      return generateSchema({
        name: this.name,
        tag: this.tag,
        sectionClass: this.sectionClass,
        limit: this.limit,
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
        const { name, settings, blocks, presets } = JSON.parse(jsonString);
        this.name = name || this.name;
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

  <main class="flex flex-1 py-5 pl-5">
    <SchemaEditor class="basis-1/3 mr-5"
      :name="name"
      :settings="settings"
      @rename="(newName) => name = newName"
      @tag="(newTag) => tag = newTag"
      @setClass="(newClass) => sectionClass = newClass"
      @setLimit="(newLimit) => limit = newLimit"
      @update="(newSettings) => settings = newSettings"
    />
    <BlocksEditor class="basis-1/3 mr-5" />
    <SchemaCode
      class="basis-1/3 mr-5"
      :schema="schema"
      @import="loadFromSchema"
    />
  </main>
</template>
