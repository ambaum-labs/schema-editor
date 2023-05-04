<script>
import { mapWritableState } from 'pinia';
import { useSchemaStore } from '@/stores/schema';
import { sectionTemplates, sectionGroups } from '@/settings';

export default {
  props: {
    active: { type: Boolean, default: false },
  },

  watch: {
    general({ enabled_on, disabled_on }) {
      if (!enabled_on && !disabled_on) {
        this.availabilityField = '';
      }
    },
  },

  computed: {
    ...mapWritableState(useSchemaStore, [
      'general',
    ]),

    hasTemplate() {
      return (template) => this.availabilityField && this.general[this.availabilityField]?.templates?.includes(template);
    },

    sectionGroups() {
      if (!this.availabilityField) {
        return [];
      }

      const customGroups = this.general[this.availabilityField]?.groups?.filter(group => group.indexOf('custom.') === 0) || [];
      return sectionGroups.concat(customGroups);
    },

    hasGroup() {
      return (group) => this.availabilityField && this.general[this.availabilityField]?.groups?.includes(group);
    },
  },

  data() {
    return {
      validTags: [
        'article',
        'aside',
        'div',
        'footer',
        'header',
        'section',
      ],
      availabilityField: '',
      sectionTemplates,
    };
  },

  methods: {
    changeRestrictionType(field) {
      this.availabilityField = field;

      if (!field) {
        delete this.general.enabled_on;
        delete this.general.disabled_on;
        return;
      }

      const deleteField = field === 'enabled_on' ? 'disabled_on' : 'enabled_on';
      delete this.general[deleteField];
      this.general[field] = {};
    },

    toggleRestriction(type, template, active) {
      // ignore blank custom values
      if (template === '') {
        return;
      }

      // clear custom group field after submitted
      if (type === 'groups' && template.startsWith('custom.')) {
        this.$refs.customGroup.value = '';
      }

      // '*' replaces all existing templates when selected
      if (active && template === '*') {
        this.general[this.availabilityField][type] = [template];
        return;
      }

      this.general[this.availabilityField][type] = this.general[this.availabilityField][type] || [];

      if (active) {
        // '*' is incompatible with specific templates/groups, filter out before we add the new selection
        this.general[this.availabilityField][type] = this.general[this.availabilityField][type].filter(item => item !== '*');
        this.general[this.availabilityField][type].push(template);
        return;
      }

      // when deleting last item, just remove the whole property rather than leave empty array
      if (this.general[this.availabilityField][type].length === 1) {
        delete this.general[this.availabilityField][type];
        return;
      }

      const index = this.general[this.availabilityField][type].findIndex(item => item === template);
      this.general[this.availabilityField][type].splice(index, 1);
    },
  },
};
</script>

<template>
  <div
    v-show="active"
    class="flex flex-col"
  >
    <h2 class="text-lg font-semibold mb-3">General</h2>
    <div class="flex items-center mb-3">
      <label
        for="name"
        class="w-[60px] mr-3"
      >name</label>
      <input
        id="name"
        class="flex-1 min-w-0 bg-slate-700 py-1.5 px-3 leading-none"
        :value="general.name"
        @input="({ currentTarget }) => general.name = currentTarget.value.trim()"
      >
    </div>
    <div class="flex items-center mb-3">
      <label
        for="tag"
        class="w-[60px] mr-3"
      >tag</label>
      <select
        id="tag"
        class="flex-1 min-w-0 bg-slate-700 py-1.5 px-3 leading-none"
        :value="general.tag"
        @input="({ currentTarget }) => general.tag = currentTarget.value.trim()"
      >
        <option></option>
        <option
          v-for="tag in validTags"
          :key="tag"
        >{{ tag }}</option>
      </select>
    </div>
    <div class="flex items-center mb-3">
      <label
        for="class"
        class="w-[60px] mr-3"
      >class</label>
      <input
        id="class"
        class="flex-1 min-w-0 bg-slate-700 py-1.5 px-3 leading-none"
        :value="general.sectionClass"
        @input="({ currentTarget }) => general.sectionClass = currentTarget.value.trim()"
      >
    </div>
    <div class="flex items-center mb-3">
      <label
        for="limit"
        class="w-[60px] mr-3"
      >limit</label>
      <input
        id="limit"
        type="number"
        class="flex-1 min-w-0 bg-slate-700 py-1.5 px-3 leading-none"
        min="0"
        :value="general.limit"
        @input="({ currentTarget }) => (general.limit = currentTarget.value >= 0 ? Number(currentTarget.value) : 0)"
      >
    </div>
    <div class="flex items-center mb-3">
      <label
        for="restriction-type"
        class="w-[80px] mr-3"
      >availability</label>
      <select
        id="restriction-type"
        class="flex-1 min-w-0 bg-slate-700 py-1.5 px-3 leading-none"
        :value="availabilityField"
        @input="({ currentTarget }) => changeRestrictionType(currentTarget.value)"
      >
        <option value="">No restriction</option>
        <option>enabled_on</option>
        <option>disabled_on</option>
      </select>
    </div>
    <div
      v-if="availabilityField"
      class="flex items-start mb-3"
    >
      <label
        class="w-[80px] mr-3"
      >templates</label>
      <div class="flex-1 min-w-0 flex items-start flex-wrap text-sm">
        <label
          v-for="template in sectionTemplates"
          :key="template"
          :for="`template-${template}`"
          :class="[hasTemplate(template) ? 'bg-twilight' : 'bg-slate-700']"
          class="border border-yellow-900 rounded-xl py-1 px-3 mb-2 mr-2"
        >
          {{ template }}
          <input
            :id="`template-${template}`"
            type="checkbox"
            class="hidden"
            :checked="hasTemplate(template)"
            :value="template"
            @change="({ currentTarget }) => toggleRestriction('templates', template, currentTarget.checked)"
          >
        </label>
      </div>
    </div>
    <div
      v-if="availabilityField"
      class="flex items-start mb-3"
    >
      <label
        class="w-[80px] mr-3"
      >groups</label>
      <div class="flex-1 min-w-0 flex items-start flex-wrap text-sm">
        <div class="w-full flex items-center bg-slate-700 pl-3 mb-3 leading-none">
          <label
            for="customGroup"
            class="mr-1"
          >custom.</label>
          <input
            ref="customGroup"
            id="customGroup"
            type="text"
            class="flex-1 min-w-0 bg-slate-700 py-1.5 px-3 leading-none"
            @keyup.enter="({ currentTarget }) => toggleRestriction('groups', `custom.${currentTarget.value}`, true)"
          >
          <button
            class="text-sm font-semibold py-1 px-3"
            @click="() => toggleRestriction('groups', `custom.${$refs.customGroup.value}`, true)"
          >ADD</button>
        </div>
        <label
          v-for="group in sectionGroups"
          :key="group"
          :for="`group-${group}`"
          :class="[hasGroup(group) ? 'bg-twilight' : 'bg-slate-700']"
          class="border border-yellow-900 rounded-xl py-1 px-3 mb-2 mr-2"
        >
          {{ group }}
          <input
            :id="`group-${group}`"
            type="checkbox"
            class="hidden"
            :checked="hasGroup(group)"
            :value="group"
            @change="({ currentTarget }) => toggleRestriction('groups', group, currentTarget.checked)"
          >
        </label>
      </div>
    </div>
  </div>
</template>
