<script>
import { mapState, mapActions } from 'pinia';
import { useSchemaStore } from '@/stores/schema';
import LinkChain from '@/components/icons/LinkChain.vue';
import ClipboardEmpty from '@/components/icons/ClipboardEmpty.vue';
import ClipboardChecked from '@/components/icons/ClipboardChecked.vue';

export default {
  props: {
    active: { type: Boolean, default: false },
  },

  components: {
    LinkChain,
    ClipboardEmpty,
    ClipboardChecked,
  },

  watch: {
    schema: {
      immediate: true,
      handler(newValue) {
        this.code = newValue;
      },
    },
  },

  computed: {
    ...mapState(useSchemaStore, [
      'schema',
    ]),
  },

  data() {
    return {
      code: '',
      copyingLink: false,
      copyingToClipboard: false,
    };
  },

  methods: {
    ...mapActions(useSchemaStore, [
      'loadFromSchema',
      'getShareLink',
    ]),

    async copyLink() {
      this.copyingLink = true;
      const link = await this.getShareLink();
      navigator.clipboard.writeText(link);
      setTimeout(() => {
        this.copyingLink = false;
      }, 1000);
    },

    copyToClipboard() {
      this.copyingToClipboard = true;
      navigator.clipboard.writeText(this.schema);
      setTimeout(() => {
        this.copyingToClipboard = false;
      }, 1000);
    }
  },
};
</script>

<template>
  <div
    v-show="active"
    class="h-full flex flex-col"
  >
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-semibold shrink-0">Schema Code</h2>
      <p class="text-sm text-right">Schema will update automatically</p>
    </div>
    <div class="h-full flex flex-col relative">
      <div class="flex flex-col items-end absolute top-2 right-2">
        <div class="flex items-center">
          <button
            :class="{ 'text-yellow-400': copyingLink }"
            class="bg-slate-800 rounded-lg transition p-2 mr-2"
            @click="copyLink"
          >
            <LinkChain />
          </button>
          <button
            :class="{ 'text-yellow-400': copyingToClipboard }"
            class="bg-slate-800 rounded-lg transition p-2"
            @click="copyToClipboard"
          >
            <ClipboardEmpty v-show="!copyingToClipboard" />
            <ClipboardChecked
              v-show="copyingToClipboard"
            />
          </button>
        </div>
        <span
          v-if="copyingToClipboard || copyingLink"
          class="flex items-center bg-slate-800 text-yellow-400 rounded-lg text-sm p-2 mt-1"
        >
          {{ copyingToClipboard ? 'Schema code copied' : 'Share link copied' }}
        </span>
      </div>
      <textarea
        class="flex-1 min-h-[200px] md:min-h-[400px] xl:min-h-0 bg-slate-700 p-3"
        v-model="code"
      />
    </div>
    <div class="flex items-center justify-between mt-3">
      <p class="text-sm mr-3">To work with an existing schema, paste it and click import</p>
      <button
        class="rounded-md px-5 py-1 bg-yellow-400 text-slate-900 font-semibold uppercase text-sm"
        @click="() => loadFromSchema(code)"
      >Import</button>
    </div>
  </div>
</template>
