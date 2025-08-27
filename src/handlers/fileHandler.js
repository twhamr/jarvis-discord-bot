const fs = require('fs');
const path = require('path');

// Does the given directory exist? If none is given, defaults to 'data' directory
function directoryExist(dir = '') {
    const dirPath = dir? path.join(__dirname, '..', 'data', dir) : path.join(__dirname, '..', 'data');
    
    if (!fs.existsSync(dirPath)) {
        console.warn(`⚠️ ${dirPath} does not exist, attempting to create it.`);

        try {
            fs.mkdirSync(dirPath);
            console.log(`📁 ${dirPath} has been created.`);
        } catch (error) {
            console.error(`❌ Could not create ${dirPath}: ${error}`);
        }
    }

    return dirPath;
}

const dataDir = directoryExist();

function readData(filename, dir = '') {
    const filePath = dir? path.join(dir, filename): path.join(dataDir, filename);

    try {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    } catch (error) {
        console.error(`❌ Error reading file ${filename}: ${error}`);
        return [];
    }
}

function writeData(filename, data, dir = '') {
    const filePath = dir? path.join(dir, filename): path.join(dataDir, filename);

    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`❌ Error writing to file ${filename}: ${error}`);
    }
}


module.exports = {
    directoryExist,
    readData,
    writeData
};