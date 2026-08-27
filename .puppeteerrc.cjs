const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Directs Puppeteer to store and find Chrome inside the project root folder
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
