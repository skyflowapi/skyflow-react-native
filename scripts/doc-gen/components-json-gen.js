/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const docgen = require('react-docgen-typescript');

const tsConfigParser = docgen.withCustomConfig('./tsconfig.json', {
  savePropValueAsString: true,
  skipChildrenPropWithoutDoc: false,
  propFilter: {
    skipPropsWithoutDoc: false,
    skipPropsWithName: 'children',
  },
  shouldExtractLiteralValuesFromEnum: true,
});

const paths = ['components', 'hooks'];
const excludeDirs = [];

function getFiles(dir, files = []) {
  const fileNames = fs.readdirSync(dir);

  fileNames.forEach((fileName) => {
    const filePath = path.join(dir, fileName);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !excludeDirs.includes(fileName)) {
      getFiles(filePath, files);
    } else if (fileName === 'index.tsx' || fileName === 'index.ts') {
      files.push(filePath);
    }
  });

  return files;
}

function generateDocumentationJson() {
  const docJson = {};
  const rootPath = path.join(__dirname, '../../');

  paths.forEach((item) => {
    const pathJsonArray = [];
    const folderPath = path.join(rootPath, 'src', item);
    const files = getFiles(folderPath);
    files.forEach((file) => {
      const relativePath = path.relative(rootPath, file);
      const docs = tsConfigParser.parse(relativePath);
      pathJsonArray.push(docs[0]);
    });
    docJson[item] = pathJsonArray;
  });
  return docJson;
}

function createDocJsonFile(json) {
  const dirPath = path.join(__dirname, '../../', 'docs', 'json');
  const filePath = path.join(dirPath, 'components.json');

  // Create docs/json folder if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  // Write to components.json file
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  console.log('Json documentation is generated at docs/json');
}

createDocJsonFile(generateDocumentationJson());
