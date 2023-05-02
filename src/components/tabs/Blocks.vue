<script>
import { mapWritableState } from 'pinia';
import { useSchemaStore } from '@/stores/schema';
import { hiddenFields, requiredFields, optionalFields, createBlock, createAppBlock } from '@/blocks';
import SettingsManager from '@/components/SettingsManager.vue';
import ChevronDoubleDown from '@/components/icons/ChevronDoubleDown.vue';
import ChevronDoubleUp from '@/components/icons/ChevronDoubleUp.vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';
import ChevronUp from '@/components/icons/ChevronUp.vue';

export default {
  props: {
    active: { type: Boolean, default: false },
  },

  components: {
    SettingsManager,
    ChevronDoubleDown,
    ChevronDoubleUp,
    ChevronDown,
    ChevronUp,
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

    toggleBlocks(expanded) {
      this.blocks?.forEach((block) => {
        block.expanded = expanded;
        this.toggleSettings(block.settings, expanded);
      });
    },

    toggleSettings(settings, expanded) {
      settings?.forEach(setting => setting.expanded = expanded);
    },
  }
};
</script>

<template>
  <div
    v-show="active"
    class="flex flex-col"
  >
    <h2 class="flex justify-between items-center text-lg font-semibold mb-3">
      <span>Blocks</span>
      <span
        v-show="blocks.length"
        class="flex"
      >
        <button
          aria-label="Collapse all"
          title="Collapse all"
          class="mr-2"
          @click="toggleBlocks(false)"
        >
          <ChevronDoubleUp />
        </button>
        <button
          aria-label="Expand all"
          title="Expand all"
          @click="toggleBlocks(true)"
        >
          <ChevronDoubleDown />
        </button>
      </span>
    </h2>
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
        class="flex justify-between items-center p-2 bg-nebula text-left"
        @click="blocks[index].expanded = !block.expanded"
      >
        <span>{{ displayName(block) }}</span>
        <ChevronDown v-show="block.expanded" />
        <ChevronUp v-show="!block.expanded" />
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
          <h3 class="flex justify-between items-center mb-3">
            <span>settings</span>
            <span
              v-if="block.settings.length"
              class="flex"
            >
              <button
                aria-label="Collapse all"
                title="Collapse all"
                class="mr-2"
                @click="toggleSettings(block.settings, false)"
              >
                <ChevronDoubleUp />
              </button>
              <button
                aria-label="Expand all"
                title="Expand all"
                @click="toggleSettings(block.settings, true)"
              >
                <ChevronDoubleDown />
              </button>
            </span>
          </h3>
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
