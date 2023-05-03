<script>
import { settingTypes, hiddenFields, createSetting, updateTypedFields } from '@/settings';
import ChevronDown from '@/components/icons/ChevronDown.vue';
import ChevronUp from '@/components/icons/ChevronUp.vue';
import DocumentDuplicate from '@/components/icons/DocumentDuplicate.vue';
import TrashCan from '@/components/icons/TrashCan.vue';
import XMark from '@/components/icons/XMark.vue';

export default {
  props: {
    active: { type: Boolean, default: true },
    settings: { type: Array, default: () => ([]) },
    compact: { type: Boolean, default: false },
  },

  components: {
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

    settings: {
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
    settingClasses() {
      return [
        this.compact ? 'border' : 'border-2',
      ];
    },

    headerClasses() {
      return [
        this.compact ? 'py-1' : 'py-2',
      ];
    },

    displayName() {
      return (setting) => setting.id || setting.label || 'New Setting';
    },

    inputTypes() {
      const options = [];
      const groups = Array.from(new Set(settingTypes.map(({ group }) => group)));
      groups.forEach(group => {
        options.push([
          group,
          settingTypes.filter(setting => setting.group === group).map(({ type }) => type),
        ]);
      });
      return options;
    },

    settingFields() {
      const hidden = hiddenFields.map(({ field }) => field);
      return (setting) => Object.entries(setting).filter(([key]) => !hidden.includes(key));
    },

    additionalFields() {
      return (setting) => {
        const { optionalFields } = settingTypes.find(field => field.type === setting.type);
        const keys = Object.keys(setting);
        return optionalFields.filter(field => !keys.includes(field));
      };
    },

    isRequired() {
      return (index, key) => {
        const { requiredFields } = settingTypes.find(({ type }) => type === this.settings[index].type);
        return requiredFields.includes(key);
      };
    },
  },

  methods: {
    addSetting() {
      this.$emit('add', createSetting());
    },

    duplicateSetting(setting, index) {
      this.$emit('duplicate', index, JSON.parse(JSON.stringify(setting)));
    },

    changeSetting(index, key, value) {
      let newSetting = { expanded: true, ...this.settings[index], [key]: value };
      if (key === 'type') {
        newSetting = updateTypedFields(newSetting);
      }
      this.$emit('set', index, newSetting);

      if (key === 'expanded' && value) {
        this.$nextTick(() => {
          this.$refs.textareas?.forEach(textarea => this.resizeTextarea(textarea));
        });
      }
    },

    addField(index, input) {
      this.changeSetting(index, input.value, '');
      input.value = '';
    },

    resizeTextarea(textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    },

    textareaUpdate({ currentTarget }, index, key) {
      this.resizeTextarea(currentTarget);
      this.changeSetting(index, key, currentTarget.value);
    },

    deleteSetting(index) {
      this.$emit('delete', index);
    },

    deleteSettingKey(index, key) {
      this.$emit('unset', index, key);
    },
  },
};
</script>

<template>
  <div class="flex flex-col flex-1 min-w-0">
    <div
      v-for="(setting, index) in settings"
      :key="setting.uuid"
      :class="settingClasses"
      class="flex flex-col border-slate-700 mb-3"
    >
      <button
        :class="headerClasses"
        class="flex justify-between items-center px-2 bg-twilight text-left"
        @click="changeSetting(index, 'expanded', !setting.expanded)"
      >
        <span>{{ displayName(setting) }}</span>
        <div class="flex items-center">
          <button
            class="p-1 mr-1"
            aria-label="Duplicate setting"
            title="Duplicate setting"
            @click.stop="duplicateSetting(setting, index + 1)"
          >
            <DocumentDuplicate />
          </button>
          <button
            class="text-red-300 p-1 mr-3"
            aria-label="Delete setting"
            title="Delete setting"
            @click.stop="deleteSetting(index)"
          >
            <TrashCan />
          </button>
          <ChevronDown v-show="setting.expanded" />
          <ChevronUp v-show="!setting.expanded" />
        </div>
      </button>
      <div
        v-show="setting.expanded"
        class="flex flex-col pt-3"
      >
        <select
          :class="{ hidden: !additionalFields(setting).length }"
          class="flex-1 bg-slate-700 py-1.5 px-3 mx-4 mb-3 leading-snug"
          @change="(e) => addField(index, e.currentTarget)"
        >
          <option value="">Add Property</option>
          <option
            v-for="field in additionalFields(setting)"
            :key="field"
            :value="field"
          >
            {{ field }}
          </option>
        </select>
        <div
          v-for="([key, value]) in settingFields(setting)"
          :key="key"
          class="flex items-start px-4 mb-3"
        >
          <label
            :for="`${key}-${setting.uuid}`"
            class="min-w-[90px] w-[90px] leading-none py-1.5 mr-3"
          >{{ key }}</label>
          <select
            v-if="key === 'type'"
            :id="`${key}-${setting.uuid}`"
            class="flex-1 min-w-0 bg-slate-700 py-1.5 px-3 leading-snug"
            @change="(e) => changeSetting(index, 'type', e.currentTarget.value)"
          >
            <optgroup
              v-for="([label, types]) in inputTypes"
              :key="label"
              :label="`${label} settings`"
            >
              <option
                v-for="type in types"
                :key="type"
                :value="type"
                :selected="type === setting.type"
              >
                {{ type }}
              </option>
            </optgroup>
          </select>
          <textarea
            v-else
            ref="textareas"
            :id="`${key}-${setting.uuid}`"
            :value="value"
            rows="1"
            class="flex-1 min-w-0 bg-slate-700 py-1 px-3 leading-snug resize-none"
            @input="(e) => textareaUpdate(e, index, key)"
          />
          <button
            v-if="!isRequired(index, key)"
            class="text-red-300 p-1"
            aria-label="Delete field"
            title="Delete field"
            @click.stop="deleteSettingKey(index, key)"
          >
            <XMark />
          </button>
        </div>
      </div>
    </div>

    <button
      class="rounded-md mt-5 px-5 py-1 bg-slate-700 font-semibold uppercase text-sm"
      @click="addSetting"
    >Add Setting</button>
  </div>
</template>
