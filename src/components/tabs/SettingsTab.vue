<script>
import { mapWritableState } from 'pinia';
import { useSchemaStore } from '@/stores/schema';
import SettingsManager from '@/components/SettingsManager.vue';
import ChevronDoubleDown from '@/components/icons/ChevronDoubleDown.vue';
import ChevronDoubleUp from '@/components/icons/ChevronDoubleUp.vue';

export default {
  props: {
    active: { type: Boolean, default: false },
  },

  components: {
    SettingsManager,
    ChevronDoubleDown,
    ChevronDoubleUp,
  },

  computed: {
    ...mapWritableState(useSchemaStore, [
      'settings',
    ]),
  },

  methods: {
    toggleSettings(expanded) {
      this.settings?.forEach(setting => setting.expanded = expanded);
    },
  },
};
</script>

<template>
  <div
    v-show="active"
    class="flex flex-col"
  >
    <h2 class="flex justify-between items-center text-lg font-semibold mb-3">
      <span>Settings</span>
      <span
        v-show="settings.length"
        class="flex"
      >
        <button
          aria-label="Collapse all"
          title="Collapse all"
          class="mr-2"
          @click="toggleSettings(false)"
        >
          <ChevronDoubleUp />
        </button>
        <button
          aria-label="Expand all"
          title="Expand all"
          @click="toggleSettings(true)"
        >
          <ChevronDoubleDown />
        </button>
      </span>
    </h2>
    <SettingsManager
      v-show="active"
      :active="active"
      :settings="settings"
      @add="(newSetting) => settings.push(newSetting)"
      @set="(index, newSetting) => settings[index] = newSetting"
      @unset="(index, key) => delete settings[index][key]"
      @delete="(index) => settings.splice(index, 1)"
    />
  </div>
</template>
