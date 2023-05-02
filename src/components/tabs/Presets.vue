<script>
import { mapWritableState } from 'pinia';
import { useSchemaStore } from '@/stores/schema';
import { optionalFields, createPreset, createPresetBlock } from '@/presets';
import { hiddenFields } from '@/settings';
import ChevronDoubleDown from '@/components/icons/ChevronDoubleDown.vue';
import ChevronDoubleUp from '@/components/icons/ChevronDoubleUp.vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';
import ChevronUp from '@/components/icons/ChevronUp.vue';
import Trash from '@/components/icons/Trash.vue';

export default {
  props: {
    active: { type: Boolean, default: false },
  },

  components: {
    ChevronDoubleDown,
    ChevronDoubleUp,
    ChevronDown,
    ChevronUp,
    Trash,
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
      'presets',
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
    addPreset() {
      this.presets.push(createPreset());
    },

    addSetting(index, input) {
      this.presets[index].settings = this.presets[index]?.settings ?? {};
      this.presets[index].settings[input.value.trim()] = '';
      input.value = '';
    },

    addBlock({ currentTarget }, index) {
      this.presets[index].blocks = this.presets[index]?.blocks ?? [];
      this.presets[index].blocks.push(createPresetBlock(currentTarget.value));
      currentTarget.value = '';
    },

    addBlockSetting(presetIndex, blockIndex, input) {
      this.presets[presetIndex].blocks[blockIndex].settings = this.presets[presetIndex].blocks[blockIndex].settings ?? {};
      this.presets[presetIndex].blocks[blockIndex].settings[input.value] = '';
      input.value = '';
    },

    resizeTextarea(textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    },

    textareaUpdate({ currentTarget }, index, key) {
      this.resizeTextarea(currentTarget);
      this.presets[index].settings[key] = currentTarget.value.trim();
    },

    blockTextAreaUpdate({ currentTarget }, presetIndex, blockIndex, key) {
      this.resizeTextarea(currentTarget);
      this.presets[presetIndex].blocks[blockIndex].settings[key] = currentTarget.value;
    },

    togglePresets(expanded) {
      this.presets?.forEach((preset) => {
        preset.expanded = expanded;
        this.toggleBlocks(preset.blocks, expanded);
      });
    },

    toggleBlocks(blocks, expanded) {
      blocks?.forEach(block => block.expanded = expanded);
    },

    deletePreset(index) {
      this.presets.splice(index, 1);
    },

    deleteBlock(presetIndex, blockIndex) {
      this.presets[presetIndex].blocks.splice(blockIndex, 1);
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
      <span>Presets</span>
      <span
        v-show="presets.length"
        class="flex"
      >
        <button
          aria-label="Collapse all"
          title="Collapse all"
          class="mr-2"
          @click="togglePresets(false)"
        >
          <ChevronDoubleUp />
        </button>
        <button
          aria-label="Expand all"
          title="Expand all"
          @click="togglePresets(true)"
        >
          <ChevronDoubleDown />
        </button>
      </span>
    </h2>
    <div
      v-for="(preset, index) in presets"
      :key="preset.uuid"
      class="flex flex-col border-slate-700 border-2 mb-3"
    >
      <button
        class="flex justify-between items-center p-2 bg-wine text-left"
        @click="presets[index].expanded = !preset.expanded"
      >
        <span>{{ preset.name || 'New Preset' }}</span>
        <span class="flex items-center">
          <button
            class="text-red-300 p-1 mr-3"
            @click.stop="deletePreset(index)"
          >
            <Trash />
          </button>
          <ChevronDown v-show="preset.expanded" />
          <ChevronUp v-show="!preset.expanded" />
        </span>
      </button>
      <div
        v-show="preset.expanded"
        class="flex flex-col pt-3"
      >
        <div class="flex items-start px-4 mb-3">
          <label
            :for="`preset-${index}-name`"
            class="w-[90px] min-w-[90px] mr-3"
          >name</label>
          <input
            :id="`preset-${index}-name`"
            :value="preset.name"
            class="flex-1 min-w-0 bg-slate-700 py-1.5 px-3 leading-none"
            @input="({ currentTarget }) => presets[index].name = currentTarget.value.trim()"
          >
        </div>
        <div class="flex flex-col mb-3 border-t border-slate-800">
          <h3 class="mb-3 px-4 py-2 bg-twilight">settings</h3>
          <div
            v-for="([settingId, value]) in presetSettings(preset)"
            class="flex items-start px-6 mb-3"
          >
            <label
              :for="`${settingId}-${preset.uuid}`"
              class="min-w-[90px] w-[90px] leading-none py-1.5 mr-3"
            >{{ settingId }}</label>
            <textarea
              ref="textareas"
              :id="`${settingId}-${preset.uuid}`"
              rows="1"
              class="flex-1 min-w-0 bg-slate-700 py-1 px-3 leading-snug resize-none"
              @input="(e) => textareaUpdate(e, index, settingId)"
            >{{ value }}</textarea>
          </div>
          <select
            v-if="unusedSettings(preset).length"
            class="flex-1 bg-slate-700 py-1.5 px-3 mx-4 mb-3 leading-snug"
            @change="(e) => addSetting(index, e.currentTarget)"
          >
            <option value="">Add Setting</option>
            <option
              v-for="({ id }) in unusedSettings(preset)"
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
            To add settings to a preset you must first define them in the Settings tab
          </p>
        </div>
        <div class="flex flex-col px-4 pt-2 mb-3 border-t border-slate-800">
          <h3 class="flex justify-between items-center py-1 mb-3">
            <span>blocks</span>
            <span
              v-show="preset.blocks && preset.blocks.length"
              class="flex"
            >
              <button
                aria-label="Collapse all"
                title="Collapse all"
                class="mr-2"
                @click="toggleBlocks(preset.blocks, false)"
              >
                <ChevronDoubleUp />
              </button>
              <button
                aria-label="Expand all"
                title="Expand all"
                @click="toggleBlocks(preset.blocks, true)"
              >
                <ChevronDoubleDown />
              </button>
            </span>
          </h3>
          <div
            v-for="(block, blockIndex) in preset.blocks"
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
                  class="text-red-300 p-1 mr-3"
                  @click.stop="deleteBlock(index, blockIndex)"
                >
                  <Trash />
                </button>
                <ChevronDown v-show="block.expanded" />
                <ChevronUp v-show="!block.expanded" />
              </span>
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
                  @input="(e) => blockTextAreaUpdate(e, index, blockIndex, key)"
                >{{ value }}</textarea>
              </div>
              <select
                v-if="unusedBlockSettings(block).length"
                class="flex-1 bg-slate-700 py-1.5 px-3 mx-4 mb-3 leading-snug"
                @change="(e) => addBlockSetting(index, blockIndex, e.currentTarget)"
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
            @change="(e) => addBlock(e, index)"
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
          <p v-else>To add blocks to a preset you must first define them in the Blocks tab</p>
        </div>
      </div>
    </div>
    <button
      class="mt-5 rounded-md px-5 py-1 bg-slate-700 font-semibold uppercase text-sm"
      @click="addPreset"
    >Add Preset</button>
  </div>
</template>
