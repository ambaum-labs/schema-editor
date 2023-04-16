<script>
import { mapWritableState, mapActions } from 'pinia';
import Card from './Card.vue';
import Tabs from './Tabs.vue';
import Settings from './Settings.vue';
import { useSchemaStore } from '@/stores/schema';

export default {
  components: {
    Card,
    Tabs,
    Settings,
  },

  computed: {
    ...mapWritableState(useSchemaStore, [
      'general',
      'settings',
    ]),
  },

  data() {
    return {
      tabs: [
        { title: 'General', value: 'general' },
        { title: 'Settings', value: 'settings' },
        { title: 'Locales', value: 'locales' },
      ],
      activeTab: 'general',
      validTags: [
        'article',
        'aside',
        'div',
        'footer',
        'header',
        'section',
      ],
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
      <div v-show="activeTab === 'general'">
        <div class="flex items-center mb-3">
          <label
            for="name"
            class="w-[60px] mr-3"
          >Name:</label>
          <input
            id="name"
            class="flex-1 bg-slate-700 py-1.5 px-3 leading-none"
            :value="general.name"
            @input="({ currentTarget }) => general.name = currentTarget.value.trim()"
          >
        </div>
        <div class="flex items-center mb-3">
          <label
            for="tag"
            class="w-[60px] mr-3"
          >Tag:</label>
          <select
            id="tag"
            class="flex-1 bg-slate-700 py-1.5 px-3 leading-none"
            :value="general.tag"
            @input="({ currentTarget }) => general.tag = currentTarget.value.trim()"
          >
            <option></option>
            <option v-for="tag in validTags">{{ tag }}</option>
          </select>
        </div>
        <div class="flex items-center mb-3">
          <label
            for="class"
            class="w-[60px] mr-3"
          >Class:</label>
          <input
            id="class"
            class="flex-1 bg-slate-700 py-1.5 px-3 leading-none"
            :value="general.sectionClass"
            @input="({ currentTarget }) => general.sectionClass = currentTarget.value.trim()"
          >
        </div>
        <div class="flex items-center mb-3">
          <label
            for="limit"
            class="w-[60px] mr-3"
          >Limit:</label>
          <input
            id="limit"
            type="number"
            class="flex-1 bg-slate-700 py-1.5 px-3 leading-none"
            min="0"
            :value="general.limit"
            @input="({ currentTarget }) => (general.limit = currentTarget.value >= 0 ? Number(currentTarget.value) : 0)"
          >
        </div>
      </div>
      <div v-show="activeTab === 'settings'">
        <Settings
          :settings="settings"
          :active="activeTab === 'settings'"
          @update="(index, setting) => {
            if (index < settings.length) {
              settings[index] = setting;
            } else {
              settings.push(setting);
            }
          }"
        />
      </div>
      <div v-show="activeTab === 'locales'">
        <h1 class="text-lg font-semibold mb-3">Locales</h1>
      </div>
    </div>
  </Card>
</template>
