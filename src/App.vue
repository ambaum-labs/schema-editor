<script>
import AmbaumLogo from '@/components/icons/AmbaumLogo.vue';
import ShopifyLogo from '@/components/icons/ShopifyLogo.vue';
import GithubLogo from '@/components/icons/GithubLogo.vue';
import TabbedContent from '@/components/TabbedContent.vue';
import SettingsTab from '@/components/tabs/SettingsTab.vue';
import LocalesTab from '@/components/tabs/LocalesTab.vue';
import GeneralTab from '@/components/tabs/GeneralTab.vue';
import BlocksTab from '@/components/tabs/BlocksTab.vue';
import PresetsTab from '@/components/tabs/PresetsTab.vue';
import DefaultTab from '@/components/tabs/DefaultTab.vue';
import CodeTab from '@/components/tabs/CodeTab.vue';
import SavedTab from '@/components/tabs/SavedTab.vue';
import OptionsTab from '@/components/tabs/OptionsTab.vue';

export default {
  components: {
    AmbaumLogo,
    ShopifyLogo,
    TabbedContent,
    GithubLogo,
  },

  data() {
    return {
      cards: [
        {
          default: 'general',
          tabs: [
            { title: 'General', value: 'general', component: GeneralTab },
            { title: 'Settings', value: 'settings', component: SettingsTab },
            { title: 'Locales', value: 'locales', component: LocalesTab },
          ],
        },
        {
          default: 'blocks',
          tabs: [
            { title: 'Blocks', value: 'blocks', component: BlocksTab },
            { title: 'Presets', value: 'presets', component: PresetsTab },
            { title: 'Default', value: 'default', component: DefaultTab },
          ],
        },
        {
          default: 'code',
          tabs: [
            { title: 'Code', value: 'code', component: CodeTab },
            { title: 'Saved', value: 'saved', component: SavedTab },
            { title: 'Options', value: 'options', component: OptionsTab },
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
        <a href="https://shopify.dev/docs/themes/architecture/sections/section-schema" target="_blank" class="pr-5 border-r-2 border-yellow-400">
          <ShopifyLogo height="40" width="140" />
        </a>
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
      :key="card.default"
      v-bind="card"
      :class="{
        'md:col-span-2': index === cards.length - 1,
        'xl:col-span-1': index === cards.length - 1,
      }"
      class="xl:max-h-[calc(100vh-130px)]"
    />
  </main>

  <footer class="flex flex-col md:flex-row items-center text-sm px-5 pb-5 xl:py-1 justify-center xl:justify-between">
    <div class="flex flex-col md:flex-row items-center mb-5 md:mb-0">
      <span class="mb-3 md:mb-0">Lovingly crafted with:</span>
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
    <a href="https://github.com/ambaum-labs/schema-editor" target="_blank" class="flex items-center w-5 h-5 ml-2">
      <GithubLogo class="max-w-full h-auto" />
    </a>
  </footer>
</template>
