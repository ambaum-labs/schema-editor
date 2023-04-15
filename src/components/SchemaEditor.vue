<script>
import Card from './Card.vue';
import Tabs from './Tabs.vue';
import Settings from './Settings.vue';

export default {
  props: {
    name: { type: String, default: '' },
    tag: '',
    sectionClass: '',
    limit: 0,
    settings: { type: Array, default: () => ([]) },
  },

  components: {
    Card,
    Tabs,
    Settings,
  },

  emits: ['setGeneral', 'addSetting', 'setSetting'],

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
      defaultSetting: {
        id: '',
        label: '',
        type: 'text',
      },
    };
  },

  methods: {
    guid() {
      function _p8(s) {
        const p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
      }
      return _p8() + _p8(true) + _p8(true) + _p8();
    },
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
      <div v-show="activeTab === 'general'">
        <div class="flex items-center mb-3">
          <label
            for="name"
            class="w-[60px] mr-3"
          >Name:</label>
          <input
            id="name"
            class="flex-1 bg-slate-700 py-1.5 px-3 leading-none"
            :value="name"
            @input="(e) => $emit('setGeneral', 'name', e.currentTarget.value.trim())"
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
            :value="tag"
            @input="(e) => $emit('setGeneral', 'tag', e.currentTarget.value.trim())"
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
            :value="sectionClass"
            @input="(e) => $emit('setGeneral', 'sectionClass', e.currentTarget.value.trim())"
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
            :value="limit"
            @input="(e) => $emit('setGeneral', 'limit', e.currentTarget.value >= 0 ? Number(e.currentTarget.value) : 0)"
          >
        </div>
      </div>
      <div v-show="activeTab === 'settings'">
        <Settings
          :settings="settings"
          @update="(index, setting) => $emit('setSetting', index, setting)"
          @add="$emit('setSetting', settings.length, { ...defaultSetting, guid: guid(), expanded: true })"
        />
      </div>
      <div v-show="activeTab === 'locales'">
        <h1 class="text-lg font-semibold mb-3">Locales</h1>
      </div>
    </div>
  </Card>
</template>
