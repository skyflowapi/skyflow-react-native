/* eslint-disable @typescript-eslint/no-var-requires */
const components = require('../../docs/json/components.json');
const fs = require('fs');
const path = require('path');

function formatTypeColumn(str, propType) {
  if (!str) {
    return '';
  }
  const parts = str.split('|').map((s) => s.trim());
  if (parts.length === 1) {
    return `\`${str}\``;
  }
  if (!propType) {
    return `\`${parts[0]}\``;
  }
  return `\`${parts[0]} / ${parts[1]}\``;
}

// Output directory for Markdown files
const outputDir = './docs/markdown';

// Overview page to list elements
let overviewContent = `
{% env enable="reactNativeSdkRef" %}

# React-Native

Some documentation for the overview page.
`;

// Loop through each component in the JSON object
Object.keys(components).forEach((key) => {
  overviewContent += `\n## ${
    key == 'core'
      ? 'Skyflow Provider'
      : key == 'elements'
      ? 'Components'
      : key.charAt(0).toUpperCase() + key.slice(1)
  }\n\n`;

  components[key]
    .filter((component) => component)
    .forEach((component) => {
      // Create the Markdown file path based on the component name
      const componentPath = path.join(
        outputDir,
        key,
        `${component.displayName}.md`
      );

      const name = `${component.displayName}`;
      overviewContent += `- [${name}](/sdks/skyflow-react-native/${key}/${name})\n`;

      const sortedProps = Object.entries(component.props)
        .sort(([_, propA], [__, propB]) => {
          if (propA.required && !propB.required) {
            return -1; // propA comes before propB
          } else if (!propA.required && propB.required) {
            return 1; // propB comes before propA
          }
          return 0; // no change in order
        })
        .reduce((sorted, [key, value]) => {
          sorted[key] = value;
          return sorted;
        }, {});

      // Generate the Markdown content for the component
      let markdownContent = `---
id: ${component.displayName}
title: ${component.displayName}
sidebar_label: ${component.displayName}
---

{% env enable="reactNativeSdkRef" %}

# ${component.displayName}

${component.description}

## Import

\`\`\`
import {${component.displayName}} from 'skyflow-react-native';
\`\`\`
`;
      const propsDetails = `
## Props

| Name                    | Type                 | Description                                             | Required         | 
|-------------------------|----------------------|---------------------------------------------------------|------------------|
${Object.keys(sortedProps)
  .map((propName) => {
    const prop = sortedProps[propName];
    return `| ${prop.name} | ${formatTypeColumn(
      prop.type.name,
      prop.required
    )} | ${prop.description} | ${prop.required} |`;
  })
  .join('\n')}

`;
      if (Object.keys(component.props).length) {
        markdownContent += propsDetails;
      }

      if (Object.keys(component.tags).length > 0 && component.tags['returns']) {
        markdownContent += `\n## Returns\n${component.tags['returns']}\n\n`;
      }

      markdownContent += '{% /env %}';
      const folderPath = path.dirname(componentPath);

      // Create the folder if it doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      // Write the Markdown content to the file
      fs.writeFileSync(componentPath, markdownContent);
    });
});
overviewContent += '\n{% /env %}';
fs.writeFileSync(path.join(outputDir, 'Overview.md'), overviewContent);
console.log('markdown files generated at docs/markdown');
