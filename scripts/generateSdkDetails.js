const fs = require('fs');
const pkg = require('../package.json');

const content = `
export const sdkDetails = {
  name: "${pkg.name}",
  version: "${pkg.version}",
  reactNativeVersion: "${pkg.devDependencies['react-native']}"
};
`;

fs.writeFileSync('src/sdkDetails.ts', content);
