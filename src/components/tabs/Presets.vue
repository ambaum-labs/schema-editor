<script>
import { mapWritableState } from 'pinia';
import { useSchemaStore } from '@/stores/schema';
import { optionalFields, createPreset, createPresetBlock } from '@/presets';
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

    blockTextAreaUpdate({ curretnTarget }, presetIndex, blockIndex, key) {
      this.resizeTextarea(currentTarget);
      this.presets[presetIndex][blockIndex][key] = currentTarget.value;
    },
  },
};
</script>

<template>
  <div
    v-show="active"
    class="flex flex-col"
  >
    <div
      v-for="(preset, index) in presets"
      :key="preset.uuid"
      class="flex flex-col border-slate-700 border-2 mb-3"
    >
      <button
        class="p-2 bg-wine text-left"
        @click="presets[index].expanded = !preset.expanded"
      >
        {{ preset.name || 'New Preset' }}
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
        <div class="flex flex-col pt-2 mb-3 border-t border-slate-800">
          <h3 class="mb-3 px-4 bg-twilight">settings</h3>
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
          <h3 class="mb-3">blocks</h3>
          <div
            v-for="(block, blockIndex) in preset.blocks"
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
                  @input="(e) => textareaUpdate(e, index, blockIndex, key)"
                >{{ value }}</textarea>
              </div>
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
