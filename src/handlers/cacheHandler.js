const { directoryExist, readData, writeData } = require('./fileHandler');

const cacheDir = directoryExist('cache');

// Helper function to generate a new unique ID
function generateID(filename) {
    const data = readData(filename, cacheDir);
    if (data.length === 0) return 1;
    return Math.max(...data.map((row) => row.id)) + 1;
}

// CRUD Operations

// Create a new Record with an auto-generated ID
function createRecord(filename, obj) {
    try {
        const newObj = { ...obj, id: generateID(filename) };
        const data = readData(filename, cacheDir);
        data.push(newObj);
        writeData(filename, data, cacheDir);
        console.log(`✅ Created new record in ${filename}.`);
    } catch (error) {
        console.error(`❌ Unable to create new record in file ${filename}: ${error}`);
    }
}

// Fetch all records in a file, or fetch a specific record
function fetchRecord(filename, obj = {}) {
    try {
        const data = readData(filename, cacheDir);

        if (!obj) return data;
        
        const keyValueArray = Object.entries(obj);

        let matchingRecord = data.filter((row) => {
            for (const [key, value] of keyValueArray) {
                if (!row.hasOwnProperty(key) || row[key] !== value) {
                    return false;
                }
            }
            return true;
        });

        if (!matchingRecord[0]) return;

        return matchingRecord[0];
    } catch (error) {
        console.error(`❌ An error occurred fetching record(s) from ${filename}: ${error}`);
    }
}

// Update a record by ID
function updateRecord(filename, id, updates) {
    try {
        const data = readData(filename, cacheDir);
        
        const index = data.findIndex((row) => row.id === id);
        if (index !== -1) {
            Object.assign(data[index], updates);
            writeData(filename, data, cacheDir);
            console.log(`✅ Updated record ${index}.`);
        } else {
            console.warn(`⚠️ Record not found.`);
        }
    } catch (error) {
        console.error(`❌ Unable to update record ${id} from file ${filename}: ${error}`);
    }
}

// Delete a record by ID and renumber the IDs
function deleteRecord(filename, id) {
    try {
        const data = readData(filename, cacheDir);
        
        const index = data.findIndex((row) => row.id === id);
        if (index !== -1) {
            data.splice(index, 1);

            for (let i = 0; i < data.length; i++) {
                data[i].id = i + 1;
            }
            
            writeData(filename, data, cacheDir);
            console.log(`✅ Record deleted from file ${filename}.`);
        } else {
            console.warn(`⚠️ Record not found.`);
        }
    } catch (error) {
        console.error(`❌ Unable to delete record ${id} from file ${filename}: ${error}`);
    }
}

module.exports = {
    createRecord,
    fetchRecord,
    updateRecord,
    deleteRecord
}