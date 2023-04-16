<script>
import { settingTypes, hiddenFields, createSetting, updateTypedFields } from '../settings';

export default {
  props: {
    settings: { type: Array, default: () => ([]) },
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
    displayName() {
      return (setting) => setting.id || setting.label || 'New Setting';
    },

    inputTypes() {
      return settingTypes.map(({ type }) => type);
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
  },

  methods: {
    addSetting() {
      this.$emit('update', this.settings.length, createSetting());
    },

    changeSetting(index, key, value) {
      let newSetting = { ...this.settings[index], [key]: value, expanded: true };
      if (key === 'type') {
        newSetting = updateTypedFields(newSetting);
      }
      this.$emit('update', index, newSetting);
    },

    addField(index, input) {
      this.changeSetting(index, input.value, '');
      input.value = '';
    },

    resizeTextarea(textarea) {
      textarea.style.height = `${textarea.scrollHeight}px`;
    },

    textareaUpdate({ currentTarget }, index, key) {
      this.resizeTextarea(currentTarget);
      this.changeSetting(index, key, currentTarget.value);
    },
  },
};
</script>

<template>
  <div class="flex flex-col">
    <div
      v-for="(setting, index) in settings"
      :key="setting.guid"
      class="flex flex-col border-slate-800 border mb-6"
    >
      <button
        class="p-2 bg-slate-800 text-left"
        @click="setting.expanded = !setting.expanded"
      >
        {{ displayName(setting) }}
      </button>
      <div
        v-show="setting.expanded"
        class="flex flex-col pt-3"
      >
        <div
          v-for="([key, value]) in settingFields(setting)"
          class="flex items-start px-2 mb-3"
        >
          <label
            :for="`${key}-${setting.guid}`"
            class="w-[85px] leading-none py-2 mr-3"
          >{{ key }}</label>
          <select
            v-if="key === 'type'"
            :id="`${key}-${setting.guid}`"
            class="flex-1 bg-slate-800 py-2 px-2 leading-none"
            @change="(e) => changeSetting(index, 'type', e.currentTarget.value)"
          >
            <option v-for="type in inputTypes" :value="type" :selected="type === setting.type">
              {{ type }}
            </option>
          </select>
          <textarea
            v-else
            ref="textareas"
            :id="key"
            rows="1"
            class="flex-1 bg-slate-700 py-1 px-3 leading-snug resize-none"
            @input="(e) => textareaUpdate(e, index, key)"
          >{{ value }}</textarea>
        </div>
        <select
          ref="fields"
          :class="{ hidden: !additionalFields(setting).length }"
          class="flex-1 bg-slate-800 py-1.5 px-2 text-sm leading-none"
          @change="(e) => addField(index, e.currentTarget)"
        >
          <option value="">Add Property</option>
          <option v-for="field in additionalFields(setting)" :value="field">
            {{ field }}
          </option>
        </select>
      </div>
    </div>

    <button
      class="mt-5 rounded-md px-5 py-1 bg-yellow-400 text-slate-900 font-semibold uppercase text-sm"
      @click="addSetting"
    >Add Setting</button>
  </div>
</template>
