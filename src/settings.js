export const hiddenFields = [
  { field: 'guid', defaultValue: () => guid() },
  { field: 'expanded', defaultValue: true },
];

export const settingTypes = [
  {
    type: 'checkbox',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'number',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info', 'placeholder'],
  },
  {
    type: 'radio',
    requiredFields: ['type', 'id', 'label', 'options'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'range',
    requiredFields: ['type', 'id', 'label', 'min', 'max', 'step'],
    optionalFields: ['default', 'info', 'unit'],
  },
  {
    type: 'select',
    requiredFields: ['type', 'id', 'label', 'options'],
    optionalFields: ['default', 'info', 'group'],
  },
  {
    type: 'text',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info', 'placeholder'],
  },
  {
    type: 'textarea',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info', 'placeholder'],
  },
  {
    type: 'article',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'blog',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'collection',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info']
  },
  {
    type: 'collection_list',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info', 'limit'],
  },
  {
    type: 'color',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'color_background',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'color_scheme',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info']
  },
  {
    type: 'color_schemes',
    requiredFields: ['type', 'id', 'label', 'definition', 'role'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'font_picker',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'html',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info', 'placeholder'],
  },
  {
    type: 'image_picker',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'inline_richtext',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'link_list',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'liquid',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'page',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'product',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'product_list',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info', 'limit'],
  },
  {
    type: 'richtext',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'url',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'video',
    requiredFields: ['type', 'id', 'label'],
    optionalFields: ['default', 'info'],
  },
  {
    type: 'video_url',
    requiredFields: ['type', 'id', 'label', 'accept'],
    optionalFields: ['default', 'info', 'placeholder'],
  },
];

export function createSetting(type = 'text') {
  const setting = { type };
  hiddenFields.forEach(({ field, defaultValue }) => {
    if (!setting[field]) {
      setting[field] = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }
  });
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
      newSetting[property] = '';
    }
  });
  return newSetting;
}

/**
 * Generates a GUID string.
 * @returns {string} The generated GUID.
 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
 * @author Slavik Meltser.
 * @link http://slavik.meltser.info/?p=142
 */
export function guid() {
  function _p8(s) {
    const p = (Math.random().toString(16)+"000000000").substr(2,8);
    return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
};