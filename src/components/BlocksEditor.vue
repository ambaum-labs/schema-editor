<script>
import Card from './Card.vue';
import Tabs from './Tabs.vue';

export default {
  components: {
    Card,
    Tabs,
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
    <div class="py-4 px-5 flex-1 overflow-y-auto">
      <div v-show="activeTab === 'blocks'">
        <h1 class="text-lg font-semibold mb-3">Blocks</h1>
      </div>
      <div v-show="activeTab === 'presets'">
        <h1 class="text-lg font-semibold mb-3">Presets</h1>
      </div>
      <div v-show="activeTab === 'default'">
        <h1 class="text-lg font-semibold mb-3">Default</h1>
      </div>
    </div>
  </Card>
</template>
