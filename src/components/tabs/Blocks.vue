<script>
import { mapWritableState } from 'pinia';
import { useSchemaStore } from '@/stores/schema';
import { hiddenFields, requiredFields, optionalFields, createBlock, createAppBlock } from '@/blocks';
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
      'general',
      'blocks',
    ]),

    displayName() {
      return (block) => block.name || block.type || 'New Block';
    },

    blockFields() {
      const hidden = hiddenFields.map(({ field }) => field);
      hidden.push('settings');
      return (block) => Object.entries(block).filter(([key]) => !hidden.includes(key));
    },

    allFields() {
      return requiredFields.concat(optionalFields);
    },

    additionalFields() {
      return (block) => {
        if (block.type === '@app') {
          return [];
        }

        const keys = Object.keys(block);
        return optionalFields.map(({ field }) => field).filter(field => !keys.includes(field));
      };
    },

    fieldType() {
      return (key) => this.allFields.find(({ field }) => field === key)?.type ?? 'text';
    },
  },

  methods: {
    addBlock() {
      this.blocks.push(createBlock());
    },

    toggleAppBlock(enable) {
      const index = this.blocks.findIndex(({ type }) => type === '@app');
      if (enable && index === -1) {
        this.blocks.push(createAppBlock());
      } else if (!enable && index !== -1) {
        this.blocks.splice(index, 1);
      }
    },

    addField(index, input) {
      const { field, defaultValue } = optionalFields.find(({ field }) => field === input.value);
      this.blocks[index][field] = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
      input.value = '';
    },

    changeSetting(index, key, value) {
      let newSetting = { expanded: true, ...this.settings[index], [key]: value };
      if (key === 'type') {
        newSetting = updateTypedFields(newSetting);
      }
      this.blocks[index] = newSetting;
    },
  }
};
</script>

<template>
  <div
    v-show="active"
    class="flex flex-col"
  >
    <h2 class="text-lg font-semibold mb-3">Blocks</h2>
    <div class="flex items-center mb-3">
      <label
        for="name"
        class="w-[90px] min-w-[90px] mr-3"
      >max blocks:</label>
      <input
        id="name"
        type="number"
        class="flex-1 min-w-0 bg-slate-700 py-1.5 px-3 leading-none"
        min="0"
        max="50"
        :value="general.maxBlocks"
        @input="({ currentTarget }) => general.maxBlocks = currentTarget.value.trim()"
      >
    </div>
    <div class="flex items-center mb-5">
      <label
        for="app-block"
        class="w-[90px] min-w-[90px] mr-3"
      >app block:</label>
      <input
        id="app-block"
        type="checkbox"
        class="bg-slate-700 h-5 w-5"
        :checked="hasAppBlock"
        value="1"
        @input="({ currentTarget }) => toggleAppBlock(currentTarget.checked)"
      >
    </div>

    <div
      v-for="(block, index) in blocks"
      :key="block.uuid"
      class="flex flex-col border-slate-700 border-2 mb-3"
    >
      <button
        class="p-2 bg-nebula text-left"
        @click="blocks[index].expanded = !block.expanded"
      >
        {{ displayName(block) }}
      </button>
      <div
        v-show="block.expanded"
        class="flex flex-col pt-3"
      >
        <div
          v-if="additionalFields(block).length"
          class="flex items-start px-4 mb-3"
        >
          <select
            class="flex-1 bg-slate-700 py-1.5 px-3 leading-snug"
            @change="(e) => addField(index, e.currentTarget)"
          >
            <option value="">Add Property</option>
            <option v-for="field in additionalFields(block)" :value="field">
              {{ field }}
            </option>
          </select>
        </div>
        <div
          v-for="([key, value]) in blockFields(block)"
          :key="key"
          class="flex items-start px-4 mb-3"
        >
          <label
            :for="`block-${index}-${key}`"
            class="w-[90px] min-w-[90px] mr-3"
          >{{ key }}</label>
          <input
            :id="`block-${index}-${key}`"
            :type="fieldType(key)"
            :value="value"
            :readonly="block.type === '@app'"
            class="flex-1 min-w-0 bg-slate-700 py-1.5 px-3 leading-none"
            @input="({ currentTarget }) => blocks[index][key] = currentTarget.value.trim()"
          >
        </div>
        <div
          v-if="block.settings"
          class="flex flex-col px-4 pt-2 mb-3 border-t border-slate-800"
        >
          <h3 class="mb-3">settings</h3>
          <SettingsManager
            :active="active"
            :settings="block.settings"
            :compact="true"
          />
        </div>
      </div>
    </div>

    <button
      class="mt-5 rounded-md px-5 py-1 bg-slate-700 font-semibold uppercase text-sm"
      @click="addBlock"
    >Add Block</button>
  </div>
</template>
