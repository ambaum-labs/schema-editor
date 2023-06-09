<script>
import { mapWritableState } from 'pinia';
import { useSchemaStore } from '@/stores/schema';
import { createPresetBlock } from '@/presets';
import { hiddenFields } from '@/settings';
import ChevronDoubleDown from '@/components/icons/ChevronDoubleDown.vue';
import ChevronDoubleUp from '@/components/icons/ChevronDoubleUp.vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';
import ChevronUp from '@/components/icons/ChevronUp.vue';
import DocumentDuplicate from '@/components/icons/DocumentDuplicate.vue';
import TrashCan from '@/components/icons/TrashCan.vue';
import XMark from '@/components/icons/XMark.vue';

export default {
  props: {
    active: { type: Boolean, default: false },
  },

  components: {
    ChevronDoubleDown,
    ChevronDoubleUp,
    ChevronDown,
    ChevronUp,
    DocumentDuplicate,
    TrashCan,
    XMark,
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
      return (preset) => this.validSettings.filter(({ id }) => !Object.prototype.hasOwnProperty.call(preset?.settings ?? {}, id));
    },

    presetSettings() {
      return (preset) => preset.settings ? Object.entries(preset.settings) : [];
    },

    validBlocks() {
      return Array.from(new Set(this.blocks.filter(({ type }) => !!type)));
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

    duplicateBlock(block, index) {
      this.defaultPreset.blocks.splice(index, 0, JSON.parse(JSON.stringify(block)));
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

    toggleBlocks(expanded) {
      this.defaultPreset.blocks.forEach(block => block.expanded = expanded);
    },

    deleteBlock(index) {
      this.defaultPreset.blocks.splice(index, 1);
    },

    deleteSetting(key) {
      delete this.defaultPreset.settings[key];
    },

    deleteBlockSetting(index, key) {
      delete this.defaultPreset.blocks[index].settings[key];
    },
  },
};
</script>

<template>
  <div
    v-show="active"
    class="flex flex-col"
  >
    <h2 class="text-lg font-semibold mb-3">Default</h2>
    <div class="flex flex-col border-slate-700 border-2 mb-3">
      <div class="flex flex-col">
        <div class="flex flex-col mb-3 border-t border-slate-800">
          <h3 class="mb-3 px-4 py-2 bg-twilight">settings</h3>
          <div
            v-for="([settingId, value]) in presetSettings(defaultPreset)"
            :key="settingId"
            class="flex items-start px-6 mb-3"
          >
            <label
              :for="`${settingId}-default`"
              class="min-w-[90px] w-[90px] leading-none py-1.5 mr-3"
            >{{ settingId }}</label>
            <textarea
              ref="textareas"
              :id="`${settingId}-default`"
              :value="value"
              rows="1"
              class="flex-1 min-w-0 bg-slate-700 py-1 px-3 leading-snug resize-none"
              @input="(e) => textareaUpdate(e, settingId)"
            />
            <button
              class="text-red-300 p-1"
              aria-label="Delete setting"
              title="Delete setting"
              @click.stop="deleteSetting(settingId)"
            >
              <XMark />
            </button>
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
          <h3 class="flex justify-between items-center mb-3">
            <span>blocks</span>
            <span
              v-show="defaultPreset.blocks && defaultPreset.blocks.length"
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
          </h3>
          <div
            v-for="(block, blockIndex) in defaultPreset.blocks"
            :key="block.uuid"
            class="flex flex-col border-slate-700 border-2 mb-3"
          >
            <button
              class="flex justify-between items-center p-2 bg-nebula text-left"
              @click="block.expanded = !block.expanded"
            >
              <span>{{ displayType(block.type) }}</span>
              <span class="flex items-center">
                <button
                  class="p-1 mr-1"
                  aria-label="Duplicate block"
                  title="Duplicate block"
                  @click.stop="duplicateBlock(block, blockIndex + 1)"
                >
                  <DocumentDuplicate />
                </button>
                <button
                  class="text-red-300 p-1 mr-3"
                  aria-label="Delete block"
                  title="Delete block"
                  @click.stop="deleteBlock(blockIndex)"
                >
                  <TrashCan />
                </button>
                <ChevronDown v-show="block.expanded" />
                <ChevronUp v-show="!block.expanded" />
              </span>
            </button>
            <div
              v-show="block.expanded"
              class="flex flex-col px-4 pt-3"
            >
              <div
                v-for="([key, value]) in blockFields(block)"
                :key="key"
                class="flex items-start mb-3"
              >
                <label
                  :for="`${key}-${block.uuid}`"
                  class="min-w-[90px] w-[90px] leading-none py-1.5 mr-3"
                >{{ key }}</label>
                <textarea
                  ref="textareas"
                  :id="`${key}-${block.uuid}`"
                  :value="value"
                  :readonly="key === 'type'"
                  rows="1"
                  class="flex-1 min-w-0 bg-slate-700 py-1 px-3 leading-snug resize-none"
                  @input="(e) => blockTextAreaUpdate(e, blockIndex, key)"
                />
                <button
                  class="text-red-300 p-2"
                  aria-label="Delete setting"
                  title="Delete setting"
                  @click.stop="deleteBlockSetting(blockIndex, key)"
                >
                  <XMark />
                </button>
              </div>
              <select
                v-if="unusedBlockSettings(block).length"
                class="flex-1 bg-slate-700 py-1.5 px-3 mb-3 leading-snug"
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
          <p
            v-else
            class="px-4 py-2"
          >To add blocks to the default preset you must first define them in the Blocks tab</p>
        </div>
      </div>
    </div>
  </div>
</template>
