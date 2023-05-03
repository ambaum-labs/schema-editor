<script>
import CardFrame from '@/components/CardFrame.vue';
import TabbedHeader from '@/components/TabbedHeader.vue';

export default {
  props: {
    default: { type: String, default: '' },
    tabs: { type: Array, default: () => ([]) },
  },

  components: {
    CardFrame,
    TabbedHeader,
  },

  data() {
    return {
      activeTab: this.default,
    };
  },
};
</script>

<template>
  <CardFrame :padded="false" class="flex flex-col">
    <TabbedHeader
      :tabs="tabs"
      :active="activeTab"
      @change="(tab) => activeTab = tab"
    />
    <div class="pb-4 px-5 flex-1 overflow-y-auto">
      <component
        v-for="tab in tabs"
        :key="tab.value"
        :is="tab.component"
        :active="activeTab === tab.value"
        @changeTab="(newTab) => activeTab = newTab"
      />
    </div>
  </CardFrame>
</template>
