<script>
import { mapWritableState } from 'pinia';
import { useSchemaStore } from '@/stores/schema';
import { applyHiddenFields } from '@/settings';
import { languages } from '@/locales';
import ChevronDoubleDown from '@/components/icons/ChevronDoubleDown.vue';
import ChevronDoubleUp from '@/components/icons/ChevronDoubleUp.vue';
import ChevronDown from '@/components/icons/ChevronDown.vue';
import ChevronUp from '@/components/icons/ChevronUp.vue';

export default {
  props: {
    active: { type: Boolean, default: false },
  },

  components: {
    ChevronDoubleDown,
    ChevronDoubleUp,
    ChevronDown,
    ChevronUp,
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

    locales: {
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
      'locales',
    ]),

    availableLocales() {
      return Object.entries(this.locales).map(([language, translations]) => ([language, applyHiddenFields(translations)]));
    },

    unusedLocales() {
      const usedLanguages = Object.keys(this.locales);
      return Object.entries(languages).filter(([language]) => !usedLanguages.includes(language));
    },

    displayName() {
      return (languageCode) => languages[languageCode];
    },
  },

  methods: {
    addLocale(currentTarget) {
      this.locales[currentTarget.value] = applyHiddenFields({
        translations: [
          applyHiddenFields({ key: '', value: '' }),
        ],
      });
      currentTarget.value = '';
    },

    addTranslation(language) {
      this.locales[language].translations.push(applyHiddenFields({ key: '', value: '' }));
    },

    resizeTextarea(textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    },

    textareaUpdate({ currentTarget }, language, index) {
      this.resizeTextarea(currentTarget);
      this.locales[language].translations[index].value = currentTarget.value.trim();
    },

    toggleLocales(expanded) {
      for (const language of Object.keys(this.locales)) {
        this.locales[language].expanded = expanded;
      }
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
      <span>Locales</span>
      <span
        v-show="availableLocales.length"
        class="flex"
      >
        <button
          aria-label="Collapse all"
          title="Collapse all"
          class="mr-2"
          @click="toggleLocales(false)"
        >
          <ChevronDoubleUp />
        </button>
        <button
          aria-label="Expand all"
          title="Expand all"
          @click="toggleLocales(true)"
        >
          <ChevronDoubleDown />
        </button>
      </span>
    </h2>
    <div
      v-for="([language, { expanded, translations }]) in availableLocales"
      :key="language"
      class="flex flex-col border-slate-700 border-2 mb-3"
    >
      <button
        class="flex justify-between items-center p-2 bg-twilight text-left"
        @click="locales[language].expanded = !expanded"
      >
        <span>{{ displayName(language) }}</span>
        <ChevronDown v-show="expanded" />
        <ChevronUp v-show="!expanded" />
      </button>
      <div
        v-show="expanded"
        class="flex flex-col pt-3"
      >
        <div class="grid grid-cols-12 px-4 mb-3">
          <span class="col-span-4">Key</span>
          <span class="col-span-8">Translation</span>
        </div>
        <div
          v-for="({ key, value, uuid }, index) in translations"
          :key="uuid"
          class="grid grid-cols-12 items-start gap-4 px-4 mb-3"
        >
          <label
            :for="language + '-' + uuid + '-value'"
            class="sr-only"
          >Translation key</label>
          <input
            :id="language + '-' + uuid + '-value'"
            :value="key"
            class="col-span-4 bg-slate-700 py-1.5 px-3 leading-none"
            @input="({ currentTarget }) => locales[language].translations[index].key = currentTarget.value.trim()"
          >
          <label
            :for="`${language}-${uuid}-value`"
            class="sr-only"
          >Translation text</label>
          <textarea
            ref="textareas"
            :id="language + '-' + key + '-value'"
            rows="1"
            class="col-span-8 bg-slate-700 py-1 px-3 leading-snug resize-none"
            @input="(e) => textareaUpdate(e, language, index)"
          >{{ value }}</textarea>
        </div>
        <button
          class="mt-5 mx-4 mb-3 rounded-md px-5 py-1 bg-slate-700 font-semibold uppercase text-sm"
          @click="addTranslation(language)"
        >Add Translation</button>
      </div>
    </div>

    <div
      v-if="unusedLocales.length"
      class="flex items-start mb-3"
    >
      <select
        class="flex-1 bg-slate-700 py-1.5 px-3 leading-snug"
        @change="(e) => addLocale(e.currentTarget)"
      >
        <option value="">Add Locale</option>
        <option v-for="([abbreviation, language]) in unusedLocales" :value="abbreviation">
          {{ language }}
        </option>
      </select>
    </div>
  </div>
</template>
