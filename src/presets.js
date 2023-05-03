import { applyHiddenFields } from '@/settings';

export const requiredFields = [
  { field: 'name', defaultValue: '', type: 'text' },
];

export const optionalFields = [
  { field: 'settings', defaultValue: () => ([]) },
  { field: 'blocks', defaultValue: () => ([]) },
];

export function createPreset() {
  const preset = {};
  requiredFields.forEach(({ field, defaultValue }) => {
    preset[field] = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });
  return applyHiddenFields(preset);
}

export function createPresetSetting(id) {
  return applyHiddenFields({
    [id]: '',
  });
}

export function createPresetBlock(type) {
  return applyHiddenFields({ type });
}
