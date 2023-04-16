<script>
import Card from '@/components/Card.vue';
import Tabs from '@/components/Tabs.vue';

export default {
  props: {
    default: { type: String, default: '' },
    tabs: { type: Array, default: () => ([]) },
  },

  components: {
    Card,
    Tabs,
  },

  data() {
    return {
      activeTab: this.default,
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
      <component
        v-for="tab in tabs"
        :is="tab.component"
        :active="activeTab === tab.value"
        @changeTab="(newTab) => activeTab = newTab"
      />
    </div>
  </Card>
</template>
