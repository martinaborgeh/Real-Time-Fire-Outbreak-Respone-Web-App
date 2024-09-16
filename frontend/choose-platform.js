const fs = require('fs');

// Read the environment setting from config.json
const configPath = './platform_type_config.json';
let config;

try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  console.error('Error reading config.json:', error.message);
  process.exit(1);
}

const environment = config.environment;

if (!['virtual', 'native'].includes(environment)) {
  console.error('Invalid environment setting in config.json. Please set it to "virtual" or "native".');
  process.exit(1);
}

// Define platform-specific commands
const platformCommands = {
  virtual: {
    start: "npm run start-virtual-js",
    build: "npm run build-virtual-js"
  },
  native: {
    start: "npm run start-native-js",
    build: "npm run build-native-js"
  }
};

// Create a temp file with platform-specific commands
const tempFilePath = './.platform-commands.json';
fs.writeFileSync(tempFilePath, JSON.stringify(platformCommands[environment], null, 2));

console.log(`Detected platform: ${environment}`);
