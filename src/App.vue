<script>
import AmbaumLogo from '@/components/icons/AmbaumLogo.vue';
import ShopifyLogo from '@/components/icons/ShopifyLogo.vue';
import TabbedContent from '@/components/TabbedContent.vue';
import Settings from '@/components/tabs/Settings.vue';
import Locales from '@/components/tabs/Locales.vue';
import General from '@/components/tabs/General.vue';
import Blocks from '@/components/tabs/Blocks.vue';
import Presets from '@/components/tabs/Presets.vue';
import Default from '@/components/tabs/Default.vue';
import Code from '@/components/tabs/Code.vue';
import Saved from '@/components/tabs/Saved.vue';
import Options from '@/components/tabs/Options.vue';

export default {
  components: {
    AmbaumLogo,
    ShopifyLogo,
    TabbedContent,
    General,
    Settings,
    Locales,
    Blocks,
    Presets,
    Default,
    Code,
    Saved,
    Options,
  },

  data() {
    return {
      cards: [
        {
          default: 'general',
          tabs: [
            { title: 'General', value: 'general', component: General },
            { title: 'Settings', value: 'settings', component: Settings },
            { title: 'Locales', value: 'locales', component: Locales },
          ],
        },
        {
          default: 'blocks',
          tabs: [
            { title: 'Blocks', value: 'blocks', component: Blocks },
            { title: 'Presets', value: 'presets', component: Presets },
            { title: 'Default', value: 'default', component: Default },
          ],
        },
        {
          default: 'code',
          tabs: [
            { title: 'Code', value: 'code', component: Code },
            { title: 'Saved', value: 'saved', component: Saved },
            { title: 'Options', value: 'options', component: Options },
          ],
        },
      ],
    };
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
    <TabbedContent
      v-for="card in cards"
      v-bind="card"
      class="basis-1/3 mr-5"
    />
  </main>
</template>
