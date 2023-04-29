import { guid } from '@/settings';

export const hiddenFields = [
  { field: 'guid', defaultValue: () => guid() },
  { field: 'expanded', defaultValue: true },
];

export const requiredFields = [
  { field: 'name', defaultValue: '', type: 'text' },
  { field: 'type', defaultValue: '', type: 'text' },
  { field: 'settings', defaultValue: () => ([]) },
];

export const optionalFields = [
  { field: 'limit', defaultValue: 1, type: 'number' },
];

export function createBlock() {
  const block = {};
  hiddenFields.concat(requiredFields).forEach(({ field, defaultValue }) => {
    block[field] = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });
  return block;
}

export function createAppBlock() {
  const block = {
    type: '@app',
  };
  hiddenFields.forEach(({ field, defaultValue }) => {
    block[field] = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });
  return block;
}
