<script>
import { mapWritableState } from 'pinia';
import { useSchemaStore } from '@/stores/schema';
import { optionalFields, createPresetSetting, createPresetBlock } from '@/presets';
import { hiddenFields } from '@/settings';

export default {
  props: {
    active: { type: Boolean, default: false },
  },

  watch: {
    active: {
      immediate: true,
      handler(isActive) {
        if (isActive) {
          this.$nextTick(() => {
            this.$refs.textareas?.forEach(textarea => this.resizeTextarea(textarea));
          });
        }
      },
    },

    default: {
      immediate: true,
      handler() {
        if (this.active) {
          this.$nextTick(() => {
            this.$refs.textareas?.forEach(textarea => this.resizeTextarea(textarea));
          });
        }
      },
    },
  },

  computed: {
    ...mapWritableState(useSchemaStore, [
      'settings',
      'blocks',
      'defaultPreset',
    ]),

    validSettings() {
      return this.settings.filter(({ id }) => !!id);
    },

    unusedSettings() {
      return (preset) => this.validSettings.filter(({ id }) => !preset.settings?.hasOwnProperty(id));
    },

    presetSettings() {
      return (preset) => preset.settings ? Object.entries(preset.settings) : [];
    },

    validBlocks() {
      return this.blocks.filter(({ type }) => !!type);
    },

    blockFields() {
      const hidden = hiddenFields.map(({ field }) => field);
      return (block) => Object.entries(block?.settings ?? {}).filter(([key]) => !hidden.includes(key));
    },

    unusedBlockSettings() {
      return (block) => {
        const sourceBlock = this.blocks?.find(({ type }) => block.type === type);
        const validKeys = sourceBlock.settings.map(setting => setting.id).filter(Boolean);
        const usedKeys = Object.keys(block?.settings ?? {});
        return validKeys.filter(key => !usedKeys.includes(key));
      };
    },

    displayType() {
      return (type) => this.blocks.find(block => block.type === type)?.name || type;
    },
  },

  methods: {
    addSetting(input) {
      this.defaultPreset.settings = this.defaultPreset?.settings ?? {};
      this.defaultPreset.settings[input.value.trim()] = '';
      input.value = '';
    },

    addBlock({ currentTarget }) {
      this.defaultPreset.blocks = this.defaultPreset?.blocks ?? [];
      this.defaultPreset.blocks.push(createPresetBlock(currentTarget.value));
      currentTarget.value = '';
    },

    addBlockSetting(blockIndex, input) {
      this.defaultPreset.blocks[blockIndex].settings = this.defaultPreset.blocks[blockIndex].settings ?? {};
      this.defaultPreset.blocks[blockIndex].settings[input.value] = '';
      input.value = '';
    },

    resizeTextarea(textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    },

    textareaUpdate({ currentTarget }, key) {
      this.resizeTextarea(currentTarget);
      this.defaultPreset.settings[key] = currentTarget.value.trim();
    },

    blockTextAreaUpdate({ currentTarget }, blockIndex, key) {
      this.resizeTextarea(currentTarget);
      this.defaultPreset.blocks[blockIndex].settings[key] = currentTarget.value;
    },
  },
};
</script>

<template>
  <div
    v-show="active"
    class="flex flex-col"
  >
    <div class="flex flex-col border-slate-700 border-2 mb-3">
      <button class="p-2 bg-wine text-left">
        Default Settings
      </button>
      <div class="flex flex-col pt-3">
        <p class="px-4 mb-3">For static sections only, for dynamic sectons use presets.</p>
        <p class="px-4 mb-3">If you have already defined presets, all settings here in Default will be omitted from your schema.  You can delete your Presets to use Default instead.</p>
        <div class="flex flex-col pt-2 mb-3 border-t border-slate-800">
          <h3 class="mb-3 px-4 bg-twilight">settings</h3>
          <div
            v-for="([settingId, value]) in presetSettings(defaultPreset)"
            class="flex items-start px-6 mb-3"
          >
            <label
              :for="`${settingId}-default`"
              class="min-w-[90px] w-[90px] leading-none py-1.5 mr-3"
            >{{ settingId }}</label>
            <textarea
              ref="textareas"
              :id="`${settingId}-default`"
              rows="1"
              class="flex-1 min-w-0 bg-slate-700 py-1 px-3 leading-snug resize-none"
              @input="(e) => textareaUpdate(e, settingId)"
            >{{ value }}</textarea>
          </div>
          <select
            v-if="unusedSettings(defaultPreset).length"
            class="flex-1 bg-slate-700 py-1.5 px-3 mx-4 mb-3 leading-snug"
            @change="(e) => addSetting(e.currentTarget)"
          >
            <option value="">Add Setting</option>
            <option
              v-for="({ id }) in unusedSettings(defaultPreset)"
              :value="id"
              :key="id"
            >
              {{ id }}
            </option>
          </select>
          <p
            class="mb-2 px-4"
            v-if="!validSettings.length"
          >
            To add settings to the default preset you must first define them in the Settings tab
          </p>
        </div>
        <div class="flex flex-col px-4 pt-2 mb-3 border-t border-slate-800">
          <h3 class="mb-3">blocks</h3>
          <div
            v-for="(block, blockIndex) in defaultPreset.blocks"
            :key="block.uuid"
            class="flex flex-col border-slate-700 border-2 mb-3"
          >
            <button
              class="p-2 bg-nebula text-left"
              @click="block.expanded = !block.expanded"
            >
              {{ displayType(block.type) }}
            </button>
            <div
              v-show="block.expanded"
              class="flex flex-col pt-3"
            >
              <div
                v-for="([key, value]) in blockFields(block)"
                :key="key"
                class="flex items-start px-4 mb-3"
              >
                <label
                  :for="`${key}-${block.uuid}`"
                  class="min-w-[90px] w-[90px] leading-none py-1.5 mr-3"
                >{{ key }}</label>
                <textarea
                  ref="textareas"
                  :id="`${key}-${block.uuid}`"
                  :readonly="key === 'type'"
                  rows="1"
                  class="flex-1 min-w-0 bg-slate-700 py-1 px-3 leading-snug resize-none"
                  @input="(e) => blockTextAreaUpdate(e, blockIndex, key)"
                >{{ value }}</textarea>
              </div>
            </div>
            <select
              v-if="unusedBlockSettings(block).length"
              class="flex-1 bg-slate-700 py-1.5 px-3 mx-4 mb-3 leading-snug"
              @change="(e) => addBlockSetting(blockIndex, e.currentTarget)"
            >
              <option value="">Add Setting</option>
              <option
                v-for="id in unusedBlockSettings(block)"
                :value="id"
                :key="id"
              >
                {{ id }}
              </option>
            </select>
          </div>
          <select
            v-if="validBlocks.length"
            class="flex-1 bg-slate-700 py-1.5 px-3 mb-3 leading-snug"
            @change="(e) => addBlock(e)"
          >
            <option value="">Add Block</option>
            <option
              v-for="({ type }) in validBlocks"
              :value="type"
              :key="type"
            >
              {{ type }}
            </option>
          </select>
          <p v-else>To add blocks to the default preset you must first define them in the Blocks tab</p>
        </div>
      </div>
    </div>
  </div>
</template>
