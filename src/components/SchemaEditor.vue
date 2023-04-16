<script>
import Card from '@/components/Card.vue';
import Tabs from '@/components/Tabs.vue';
import Settings from '@/components/tabs/Settings.vue';
import Locales from '@/components/tabs/Locales.vue';
import General from '@/components/tabs/General.vue';

export default {
  components: {
    Card,
    Tabs,
    General,
    Settings,
    Locales,
  },

  data() {
    return {
      tabs: [
        { title: 'General', value: 'general' },
        { title: 'Settings', value: 'settings' },
        { title: 'Locales', value: 'locales' },
      ],
      activeTab: 'general',
    };
  },
};
</script>

<template>
  <Card :padded="false" class="flex flex-col">
    <Tabs
      :tabs="tabs"
      :active="activeTab"
      @change="(tab) => activeTab = tab"
    />
    <div class="pb-4 px-5 flex-1 overflow-y-auto">
      <General :active="activeTab === 'general'" />
      <Settings :active="activeTab === 'settings'" />
      <Locales :active="activeTab === 'locales'" />
    </div>
  </Card>
</template>
