<script>
import AmbaumLogo from './components/icons/AmbaumLogo.vue';
import ShopifyLogo from './components/icons/ShopifyLogo.vue';
import SchemaEditor from './components/SchemaEditor.vue';
import BlocksEditor from './components/BlocksEditor.vue';
import SchemaCode from './components/SchemaCode.vue';

export default {
  components: {
    AmbaumLogo,
    ShopifyLogo,
    SchemaEditor,
    BlocksEditor,
    SchemaCode,
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
    <SchemaEditor class="basis-1/3 mr-5" />
    <BlocksEditor class="basis-1/3 mr-5" />
    <SchemaCode class="basis-1/3 mr-5" />
  </main>
</template>
