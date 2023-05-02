<script>
import AmbaumLogo from '@/components/icons/AmbaumLogo.vue';
import ShopifyLogo from '@/components/icons/ShopifyLogo.vue';
import Github from '@/components/icons/Github.vue';
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
    Github,
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
    <div class="flex flex-col md:flex-row items-center justify-between py-3">
      <div class="flex items-center mb-5 md:mb-0">
        <div class="pr-5 border-r-2 border-yellow-400">
          <ShopifyLogo height="40" width="140" />
        </div>
        <h1 class="mt-1 ml-5 text-3xl font-semibold">Section Schema Editor</h1>
      </div>
      <a href="https://ambaum.com" target="_blank" class="text-xs text-center">
        Powered by
        <AmbaumLogo class="justify-self-end" height="25" width="190" />
      </a>
    </div>
  </header>

  <main class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 xl:gap-5 flex-1 px-5 pt-5 pb-4 xl:max-h-[calc(100vh-105px)]">
    <TabbedContent
      v-for="(card, index) in cards"
      v-bind="card"
      :class="{
        'md:col-span-2': index === cards.length - 1,
        'xl:col-span-1': index === cards.length - 1,
      }"
      class="xl:max-h-[calc(100vh-130px)]"
    />
  </main>

  <footer class="flex items-center text-sm px-5 pb-5 xl:pb-0 justify-center xl:justify-between">
    <div class="flex items-center">
      <span>Lovingly crafted with:</span>
      <ul class="flex items-center pl-2">
        <li class="px-2">
          <a class="text-green-300 underline" href="https://vuejs.org/" target="_blank">Vue</a>
        </li>
        <li class="px-2">
          <a class="text-green-300 underline" href="https://pinia.vuejs.org/" target="_blank">Pinia</a>
        </li>
        <li class="px-2">
          <a class="text-green-300 underline" href="https://tailwindcss.com/" target="_blank">Tailwind</a>
        </li>
        <li class="px-2">
          <a class="text-green-300 underline" href="https://heroicons.com/" target="_blank">Heroicons</a>
        </li>
      </ul>
    </div>
    <a href="https://github.com/ambaum-labs/schema-editor" target="_blank" class="flex items-center w-5 h-5">
      <Github class="max-w-full h-auto" />
    </a>
  </footer>
</template>
