<script>
const hiddenFields = ['guid'];

export default {
  props: {
    settings: { type: Array, default: () => ([]) },
  },

  computed: {
    displayName() {
      return (setting) => setting.id || setting.label || 'New Setting';
    },

    isExpanded() {
      return (index) => this.expanded.includes(index);
    },

    settingFields() {
      return (setting) => Object.entries(setting).filter(([key]) => !hiddenFields.includes(key));
    },

    additionalFields() {
      return (setting) => {
        const fields = ['default', 'info'];
        if (setting.type) {
          // TODO: add type-specific fields
        }
        const keys = Object.keys(setting);
        return fields.filter(field => !keys.includes(field));
      };
    },
  },

  data() {
    return {
      expanded: [],
    };
  },

  methods: {
    toggleSetting(index) {
      const start = this.expanded.indexOf(index);
      if (start !== -1) {
        this.expanded.splice(index, 1);
      } else {
        this.expanded.push(index);
      }
    },

    addSetting() {
      this.expanded.push(this.settings.length);
      this.$emit('add');
    },

    changeSetting(index, key, value) {
      this.$emit('update', index, { ...this.settings[index], [key]: value });
    },

    addField(index, input) {
      this.changeSetting(index, input.value, '');
      input.value = '';
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
        @click="toggleSetting(index)"
      >
        {{ displayName(setting) }}
      </button>
      <div
        v-show="isExpanded(index)"
        class="flex flex-col pt-3"
      >
        <div
          v-for="([key, value]) in settingFields(setting)"
          class="flex items-center px-2 mb-3"
        >
          <label
            :for="key"
            class="w-[60px] mr-3"
          >{{ key }}</label>
          <input
            :id="key"
            class="flex-1 bg-slate-700 py-1.5 px-3 leading-none"
            :value="value"
            @input="(e) => changeSetting(index, key, e.currentTarget.value)"
          >
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
