const hiddenFields = ['uuid', 'expanded'];

function indentString(str, indent, level) {
  return Array(indent * level).fill(' ').join('') + str;
}

function stringifyObject(obj, indent, level) {
  let objectString = '';
  const entries = Object.entries(obj);
  entries.filter(([key]) => !hiddenFields.includes(key)).forEach(([id, setting], index) => {
    if (Array.isArray(setting)) {
      objectString += indentString(`"${id}": [\n`, indent, level);
      level++;
      objectString += stringifyObjects(setting, indent, level) + '\n';
      level--;
      objectString += indentString(']', indent, level);
    } else if (typeof setting === 'object' && setting !== null) {
      objectString += indentString(`"${id}": {\n`, indent, level);
      level++
      objectString += stringifyObject(setting, indent, level);
      level--;
      objectString += indentString('}', indent, level);
    } else {
      objectString += indentString(`"${id}": ${JSON.stringify(setting)}`, indent, level);
    }
    if (index < entries.length - 1) {
      objectString += ',';
    }
    objectString += '\n';
  });
  return objectString;
}

function stringifyObjects(objects, indent, level) {
  return objects.map((obj) => {
    let objectString = indentString('{\n', indent, level);
    level++;
    const entries = Object.entries(obj).filter(([key]) => !hiddenFields.includes(key));
    entries.forEach(([key, value], index) => {
      if (Array.isArray(value)) {
        objectString += indentString(`"${key}": [\n`, indent, level);
        level++;
        objectString += stringifyObjects(value, indent, level) + '\n';
        level--;
        objectString += indentString(']', indent, level);
      } else if (typeof value === 'object' && value !== null) {
        objectString += indentString(`"${key}": {\n`, indent, level);
        level++
        objectString += stringifyObject(value, indent, level);
        level--;
        objectString += indentString('}', indent, level);
      } else {
        objectString += indentString(`"${key}": ${JSON.stringify(value)}`, indent, level);
      }
      if (index < entries.length - 1) {
        objectString += ',';
      }
      objectString += '\n';
    });
    level--;
    objectString += indentString('}', indent, level);
    return objectString;
  }).join(',\n');
}

export function generateSchema({ name, tag, sectionClass, limit, maxBlocks, settings, blocks, locales, presets, defaultPreset, codeOptions }) {
  let indent = codeOptions.tabSize;
  let level = codeOptions.indentFirstLine ? 1 : 0;

  let schema = '{% schema %}\n';
  schema += indentString('{\n', indent, level);
  level++;
  schema += indentString(`"name": "${name}",\n`, indent, level);
  if (tag) {
    schema += indentString(`"tag": "${tag}",\n`, indent, level);
  }
  if (sectionClass) {
    schema += indentString(`"class": "${sectionClass}",\n`, indent, level);
  }
  if (limit) {
    schema += indentString(`"limit": ${limit},\n`, indent, level);
  }
  if (maxBlocks) {
    schema += indentString(`"max_blocks": ${maxBlocks},\n`, indent, level);
  }
  schema += indentString(`"settings": [\n`, indent, level);
  level++;
  schema += stringifyObjects(settings, indent, level) + '\n';
  level--;
  schema += indentString(`]`, indent, level);
  if (blocks.length) {
    schema += `,\n`;
    schema += indentString(`"blocks": [\n`, indent, level);
    level++;
    schema += stringifyObjects(blocks, indent, level) + '\n';
    level--;
    schema += indentString(`]`, indent, level);
  }
  if (locales && Object.keys(locales).length) {
    schema += `,\n`;
    schema += indentString(`"locales": {\n`, indent, level);
    level++;
    const localesWithoutHidden = Object.entries(locales).filter(([key]) => !hiddenFields.includes(key));
    const structuredLocales = localesWithoutHidden.reduce((carry, [language, { translations }]) => {
      carry[language] = carry[language] || {};
      translations.forEach(({ key, value }) => {
        carry[language][key] = value;
      });
      return carry;
    }, {});
    schema += stringifyObject(structuredLocales, indent, level);
    level--;
    schema += indentString(`}`, indent, level);
  }
  if (presets.length) {
    schema += `,\n`;
    schema += indentString(`"presets": [\n`, indent, level);
    level++;
    schema += stringifyObjects(presets, indent, level) + '\n';
    level--;
    schema += indentString(`]`, indent, level);
  }
  if (!presets.length && Object.keys(defaultPreset || {}).length > 0) {
    schema += `,\n`;
    schema += indentString(`"default": {\n`, indent, level);
    level++;
    schema += stringifyObject(defaultPreset, indent, level);
    level--
    schema += indentString('}', indent, level);
  }
  schema += '\n';
  level--;
  schema += indentString('}\n', indent, level);
  schema += '{% endschema %}';

  return schema;
}

export default generateSchema;
