const { exec } = require("child_process");
const util = require("util");

const execAsync = util.promisify(exec);

try {
  execAsync('node plan.config.js', { stdio: 'inherit' });
  execAsync('node home.config.js', { stdio: 'inherit' });
  execAsync('node ./writedocs/styles.config.js', { stdio: 'inherit' });
  execAsync('node ./src/utils/parseConfig.js', { stdio: 'inherit' });
  execAsync('node sidebar.config.js', { stdio: 'inherit' });
  execAsync('node transpiler.config.js', { stdio: 'inherit' });
  console.log('Prebuild steps completed successfully.');
} catch (error) {
  console.error('Error during precli steps:', error);
  process.exit(1);
}