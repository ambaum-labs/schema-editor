<script>
import { settingTypes, hiddenFields, createSetting, updateTypedFields } from '@/settings';

export default {
  props: {
    active: { type: Boolean, default: true },
    settings: { type: Array, default: () => ([]) },
    compact: { type: Boolean, default: false },
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
  },

  methods: {
    addSetting() {
      this.settings.push(createSetting());
    },

    changeSetting(index, key, value) {
      let newSetting = { expanded: true, ...this.settings[index], [key]: value };
      if (key === 'type') {
        newSetting = updateTypedFields(newSetting);
      }
      this.settings[index] = newSetting;

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
        class="px-2 bg-twilight text-left"
        @click="changeSetting(index, 'expanded', !setting.expanded)"
      >
        {{ displayName(setting) }}
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
          <option v-for="field in additionalFields(setting)" :value="field">
            {{ field }}
          </option>
        </select>
        <div
          v-for="([key, value]) in settingFields(setting)"
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
              <option v-for="type in types" :value="type" :selected="type === setting.type">
                {{ type }}
              </option>
            </optgroup>
          </select>
          <textarea
            v-else
            ref="textareas"
            :id="`${key}-${setting.uuid}`"
            rows="1"
            class="flex-1 min-w-0 bg-slate-700 py-1 px-3 leading-snug resize-none"
            @input="(e) => textareaUpdate(e, index, key)"
          >{{ value }}</textarea>
        </div>
      </div>
    </div>

    <button
      class="rounded-md mt-5 px-5 py-1 bg-slate-700 font-semibold uppercase text-sm"
      @click="addSetting"
    >Add Setting</button>
  </div>
</template>
