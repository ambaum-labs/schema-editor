import { defineStore } from 'pinia';

function loadSaved() {
  const savedJSON = localStorage.getItem('options');
  if (!savedJSON) {
    return;
  }

  let options = {};
  try {
    options = JSON.parse(savedJSON);
  } catch(err) {
    console.error('Failed to parse options');
  }

  return options;
}

export const useOptionsStore = defineStore('options', {
  state: () => ({
    codeOptions: {
      tabSize: 2,
      indentFirstLine: false,
    },
    ...loadSaved()
  }),
});
