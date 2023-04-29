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
  <SettingsManager
    v-show="active"
    :active="active"
    :settings="settings"
  />
</template>
