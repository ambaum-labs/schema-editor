function indentString(str, indent, level) {
  return Array(indent * level).join(' ') + str;
}

function stringifyObjects(objects, indent, level) {
  return objects.map((obj) => {
    let objectString = indentString('{\n', indent, level);
    level++;
    const entries = Object.entries(obj);
    entries.forEach(([key, value], index) => {
      objectString += indentString(`"${key}": ${JSON.stringify(value)}`, indent, level);
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

function generateSchema({ name, tag, sectionClass, limit, maxBlocks, settings, blocks, presets }) {
  let indent = 2;
  let level = 1;
  let schema = '{% schema %}\n{\n';
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
  level--;
  if (blocks.length) {
    schema += `,\n`;
    schema += indentString(`"blocks": [\n`, indent, level);
    level++;
    schema += stringifyObjects(blocks, indent, level) + '\n';
    schema += indentString(`]`, indent, level);
  }
  if (presets.length) {
    schema += `,\n`;
    schema += indentString(`"presets": [\n`, indent, level);
    level++;
    schema += stringifyObjects(presets, indent, level) + '\n';
    schema += indentString(`]`, indent, level);
  }
  schema += '\n}\n{% schema %}'

  return schema;
}

export default generateSchema;
