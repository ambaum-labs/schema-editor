<script>
import XMark from '@/components/icons/XMark.vue';

export default {
  props: {
    options: { type: Array, default: () => ([]) },
    hasGroup: { type: Boolean, default: false },
  },

  components: {
    XMark,
  },

  data() {
    return {
      includeGroup: this.hasGroup && this.options.some(option => typeof option.group !== 'undefined'),
    };
  },

  methods: {
    addOption() {
      const option = { value: '', label: '' };
      if (this.includeGroup) {
        option.group = '';
      }
      this.$emit('add', option);
    },
  },
};
</script>

<template>
  <div class="flex flex-col min-w-0 flex-1">
    <div
      v-if="hasGroup"
      class="flex items-center mb-3"
    >
      <label
        for="useGroup"
        class="min-w-[60px] w-[60px] leading-none py-1.5 mr-3"
      >group?</label>
      <input
        id="useGroup"
        type="checkbox"
        v-model="includeGroup"
        @change.stop="$emit('toggleGroup', includeGroup)"
      />
    </div>
    <div
      v-for="(option, index) in options"
      :key="index"
      class="flex items-center border-t border-slate-700"
    >
      <div class="min-w-0">
        <div class="flex items-start my-3">
          <label
            :for="`value-${index}`"
            class="min-w-[60px] w-[60px] leading-none py-1.5 mr-3"
          >value</label>
          <input
            :id="`value-${index}`"
            :value="option.value"
            class="flex-1 min-w-0 bg-slate-700 py-1 px-3 leading-none"
            @input.stop="({ currentTarget }) => $emit('changeOption', index, 'value', currentTarget.value.trim())"
          />
        </div>
        <div class="flex items-start my-3">
          <label
            :for="`label-${index}`"
            class="min-w-[60px] w-[60px] leading-none py-1.5 mr-3"
          >label</label>
          <input
            :id="`label-${index}`"
            :value="option.label"
            class="flex-1 min-w-0 bg-slate-700 py-1 px-3 leading-none"
            @input.stop="({ currentTarget }) => $emit('changeOption', index, 'label', currentTarget.value.trim())"
          />
        </div>
        <div
          v-if="hasGroup && includeGroup"
          class="flex items-start my-3"
        >
          <label
            :for="`group-${index}`"
            class="min-w-[60px] w-[60px] leading-none py-1.5 mr-3"
          >group</label>
          <input
            :id="`group-${index}`"
            :value="option.group"
            class="flex-1 min-w-0 bg-slate-700 py-1 px-3 leading-none"
            @input.stop="({ currentTarget }) => $emit('changeOption', index, 'group', currentTarget.value.trim())"
          />
        </div>
      </div>
      <button
        class="text-red-300 p-1"
        aria-label="Delete option"
        title="Delete option"
        @click.stop="$emit('delete', index)"
      >
        <XMark />
      </button>
    </div>

    <button
      class="rounded-md mt-5 px-5 py-1 bg-slate-700 font-semibold uppercase text-sm"
      @click="addOption"
    >Add Option</button>
  </div>
</template>
