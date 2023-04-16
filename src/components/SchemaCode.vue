<script>
import { mapState, mapActions } from 'pinia';
import Card from './Card.vue';
import Tabs from './Tabs.vue';
import Code from '@/components/tabs/Code.vue';
import Saved from '@/components/tabs/Saved.vue';
import Options from '@/components/tabs/Options.vue';
import { useConfigurationStore } from '@/stores/configurations';

export default {
  components: {
    Card,
    Tabs,
    Code,
    Saved,
    Options,
  },

  data() {
    return {
      tabs: [
        { title: 'Code', value: 'code' },
        { title: 'Saved', value: 'saved' },
        { title: 'Options', value: 'options' },
      ],
      activeTab: 'code',
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
    <div class="pb-4 px-5 flex-1 overflow-hidden">
      <Code :active="activeTab === 'code'" />
      <Saved
        :active="activeTab === 'saved'"
        @changeTab="(tab) => activeTab = tab"
      />
      <Options :active="activeTab === 'options'" />
    </div>
  </Card>
</template>
