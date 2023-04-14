<script>
import AmbaumLogo from './components/icons/AmbaumLogo.vue';
import ShopifyLogo from './components/icons/ShopifyLogo.vue';
import SchemaEditor from './components/SchemaEditor.vue';
import BlocksEditor from './components/BlocksEditor.vue';
import SchemaCode from './components/SchemaCode.vue';

function indentString(str, indent, level) {
  return Array(indent * level).join(' ') + str;
}

function stringifyObjects(objects, indent, level) {
  return objects.map((obj) => {
    let objectString = indentString('{\n', indent, level);
    level++;
    const entries = Object.entries(obj);
    entries.forEach(([key, value], index) => {
      objectString += indentString(`"${key}": ${JSON.stringify(value)}`, indent, level);
      if (index < entries.length - 1) {
        objectString += ',';
      }
      objectString += '\n';
    });
    level--;
    return objectString;
  }).join(indentString(',\n', indent, level));
}

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
      settings: [{test:123}],
      blocks: [],
      presets: [],
    };
  },

  computed: {
    schema() {
      let indent = 2;
      let level = 1;
      let schema = '{% schema %}\n{\n';
      level++;
      schema += indentString(`"name": "${this.name}",\n`, indent, level);
      schema += indentString(`"settings": [\n`, indent, level);
      level++;
      schema += stringifyObjects(this.settings, indent, level) + '\n';
      level--;
      schema += indentString(`]`, indent, level);
      level--;
      if (this.blocks.length) {
        schema += `,\n`;
        schema += indentString(`"blocks": [\n`, indent, level);
        level++;
        schema += stringifyObjects(this.blocks, indent, level) + '\n';
        schema += indentString(`]`, indent, level);
      }
      if (this.presets.length) {
        schema += `,\n`;
        schema += indentString(`"presets": [\n`, indent, level);
        level++;
        schema += stringifyObjects(this.presets, indent, level) + '\n';
        schema += indentString(`]`, indent, level);
      }
      schema += '\n}\n{% schema %}'

      return schema;
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
      <a href="https://ambaum.com" target="_blank" class="text-center">
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
