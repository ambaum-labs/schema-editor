export const hiddenFields = [
  { field: 'uuid', defaultValue: () => crypto.randomUUID() },
  { field: 'expanded', defaultValue: true },
];

export const settingTypes = [
  {
    type: 'checkbox',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
    group: 'basic',
  },
  {
    type: 'number',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info', 'placeholder'],
    group: 'basic',
  },
  {
    type: 'radio',
    requiredFields: ['type', 'id', 'label', 'options'],
    optionalFields: ['default', 'info'],
    group: 'basic',
  },
  {
    type: 'range',
    requiredFields: ['type', 'id', 'label', 'min', 'max', 'step'],
    optionalFields: ['default', 'info', 'unit'],
    group: 'basic',
  },
  {
    type: 'select',
    requiredFields: ['type', 'id', 'label', 'options'],
    optionalFields: ['default', 'info', 'group'],
    group: 'basic',
  },
  {
    type: 'text',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info', 'placeholder'],
    group: 'basic',
  },
  {
    type: 'textarea',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info', 'placeholder'],
    group: 'basic',
  },
  {
    type: 'header',
    requiredFields: ['type', 'content'],
    optionalFields: ['info'],
    group: 'sidebar',
  },
  {
    type: 'paragraph',
    requiredFields: ['type', 'content'],
    optionalFields: [],
    group: 'sidebar',
  },
  {
    type: 'article',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['info'],
    group: 'specialized',
  },
  {
    type: 'blog',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['info'],
    group: 'specialized',
  },
  {
    type: 'collection',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['info'],
    group: 'specialized',
  },
  {
    type: 'collection_list',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['info', 'limit'],
    group: 'specialized',
  },
  {
    type: 'color',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
    group: 'specialized',
  },
  {
    type: 'color_background',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
    group: 'specialized',
  },
  {
    type: 'color_scheme',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
    group: 'specialized',
  },
  {
    type: 'color_schemes',
    requiredFields: ['type', 'id', 'label', 'definition', 'role'],
    optionalFields: ['default', 'info'],
    group: 'specialized',
  },
  {
    type: 'font_picker',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
    group: 'specialized',
  },
  {
    type: 'html',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info', 'placeholder'],
    group: 'specialized',
  },
  {
    type: 'image_picker',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['info'],
    group: 'specialized',
  },
  {
    type: 'inline_richtext',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
    group: 'specialized',
  },
  {
    type: 'link_list',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
    group: 'specialized',
  },
  {
    type: 'liquid',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
    group: 'specialized',
  },
  {
    type: 'page',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['info'],
    group: 'specialized',
  },
  {
    type: 'product',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['info'],
    group: 'specialized',
  },
  {
    type: 'product_list',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['info', 'limit'],
    group: 'specialized',
  },
  {
    type: 'richtext',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
    group: 'specialized',
  },
  {
    type: 'url',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
    group: 'specialized',
  },
  {
    type: 'video',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['info'],
    group: 'specialized',
  },
  {
    type: 'video_url',
    requiredFields: ['type', 'id', 'label', 'accept'],
    optionalFields: ['default', 'info', 'placeholder'],
    group: 'specialized',
  },
];

export const sectionTemplates = [
  '*',
  '404',
  'article',
  'blog',
  'captcha',
  'cart',
  'collection',
  'list-collections',
  'customers/account',
  'customers/activate_account',
  'customers/addresses',
  'customers/login',
  'customers/order',
  'customers/register',
  'customers/reset_password',
  'gift_card',
  'index',
  'page',
  'password',
  'policy',
  'product',
  'search',
];

export const sectionGroups = [
  '*',
  'header',
  'footer',
  'aside',
];

export function applyHiddenFields(item = {}) {
  hiddenFields.forEach(({ field, defaultValue }) => {
    if (typeof item[field] === 'undefined') {
      item[field] = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }
  });
  return item;
}

export function createSetting(type = 'text') {
  const setting = applyHiddenFields({ type });
  return updateTypedFields(setting);
}

/**
 *  Add missing required fields and remove invalid fields based on input type
 */
export function updateTypedFields(setting) {
  const newSetting = { ...setting };
  let { requiredFields, optionalFields } = settingTypes.find(({ type }) => type === newSetting.type);
  const validFields = requiredFields.concat(optionalFields, hiddenFields.map(({ field }) => field));
  const invalidFields = Object.keys(newSetting).filter(property => !validFields.includes(property));
  invalidFields.forEach(property => delete newSetting[property]);
  requiredFields.forEach(property => {
    if (typeof newSetting[property] === 'undefined') {
      newSetting[property] = property === 'options' ? [] : '';
    }
  });
  if (newSetting.options && newSetting.type !== 'select') {
    newSetting.options.forEach((option) => {
      delete option.group;
    });
  }
  return newSetting;
}
