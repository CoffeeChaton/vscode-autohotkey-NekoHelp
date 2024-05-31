'use strict';

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const mainPath = path.join(__dirname, '../doc');

const files = fs.readdirSync(mainPath);
for (const file of files) {
    const fsPathNext = `${mainPath}/${file}`;
    execSync('attrib +r ' + fsPathNext);
}

// // Remove Hidden and system attributes:
// execSync("attrib -r " + mainPath);

// // Add Hidden attribute:
// execSync("attrib +r " + mainPath);
