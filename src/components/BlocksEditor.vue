<script>
import Card from './Card.vue';
import Tabs from './Tabs.vue';
import Blocks from '@/components/tabs/Blocks.vue';
import Presets from '@/components/tabs/Presets.vue';
import Default from '@/components/tabs/Default.vue';

export default {
  components: {
    Card,
    Tabs,
    Blocks,
    Presets,
    Default,
  },

  data() {
    return {
      tabs: [
        { title: 'Blocks', value: 'blocks' },
        { title: 'Presets', value: 'presets' },
        { title: 'Default', value: 'default' },
      ],
      activeTab: 'blocks',
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
      <Blocks :active="activeTab === 'blocks'" />
      <Presets :active="activeTab === 'presets'" />
      <Default :active="activeTab === 'default'" />
    </div>
  </Card>
</template>
