<script>
import { mapWritableState, mapActions } from 'pinia';
import { useSchemaStore } from '@/stores/schema';
import SettingsManager from '@/components/SettingsManager.vue';

export default {
  props: {
    active: { type: Boolean, default: false },
  },

  components: {
    SettingsManager,
  },

  computed: {
    ...mapWritableState(useSchemaStore, [
      'settings',
    ]),
  },
};
</script>

<template>
  <div
    v-show="active"
    class="flex flex-col"
  >
    <h2 class="text-lg font-semibold mb-3">Settings</h2>
    <SettingsManager
      v-show="active"
      :active="active"
      :settings="settings"
    />
  </div>
</template>
