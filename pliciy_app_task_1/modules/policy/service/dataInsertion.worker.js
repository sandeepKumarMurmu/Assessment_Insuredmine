// importing from libraries
const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');

// importing from local files
const { checkFileOrFolderExists } = require("../../../helpers/utils/fileSystemHelper");
const { processAndInsertData } = require("./xls_csv.service");
const connect = require("../../../connections/connection")


const filePath = workerData;
const fileExtension = filePath.split('.').pop();


// Check the file extension to determine how to process the file
if (fileExtension === 'csv') {
    console.log("worker inside csv file"); // Log message indicating the file type being processed

    // Read and process CSV file
    readCsvFile(filePath) // Function to read the CSV file at the specified filePath
        .then(async (data) => { // On successful reading of the CSV file
            try {
                await connect(); // Connect to the database

                // Process and insert the data into the database
                await processAndInsertData(data);

                // Notify parent thread of successful processing
                parentPort.postMessage('CSV file successfully processed');
            } catch (err) {
                // Handle errors during processing or insertion
                console.log("err : ", err);
                parentPort.postMessage('Unable to process CSV file');
            }
        })
        .catch((error) => {
            // Handle errors in reading the CSV file
            parentPort.postMessage('Unable to process CSV file');
        });

} else if (fileExtension === 'xlsx') {
    console.log("worker inside xlsx file"); // Log message indicating the file type being processed

    // Read and process XLSX file
    getDataFromXls(filePath) // Function to read the XLSX file at the specified filePath
        .then(async (data) => { // On successful reading of the XLSX file
            try {
                await connect(); // Connect to the database

                // Process and insert the data into the database
                await processAndInsertData(data);

                // Notify parent thread of successful processing
                parentPort.postMessage('XLSX file successfully processed');
            } catch (err) {
                // Handle errors during processing or insertion
                console.log("err : ", err);
                parentPort.postMessage('Unable to process XLSX file');
            }
        })
        .catch((error) => {
            // Handle errors in reading the XLSX file
            console.log("error : ", error);
            parentPort.postMessage('Unable to process XLSX file');
        });
}


/**
 * Reads data from an XLSX file and converts it to a JSON object.
 * 
 * @param {string} path - The path to the XLSX file to read.
 * @returns {Promise<Object[]>} - A promise that resolves with the data from the first sheet of the XLSX file as a JSON array, or rejects with an empty array if an error occurs.
 */
function getDataFromXls(path) {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if the file exists at the given path
            const fileExists = await checkFileOrFolderExists(path);

            // If the file does not exist, reject the promise with an error
            if (!fileExists) {
                return reject(new Error("File does not exist."));
            }

            // Read the workbook from the file at the given path
            const workbook = xlsx.readFile(path);

            // Get the list of sheet names in the workbook
            const sheetNameList = workbook.SheetNames;

            // Convert the first sheet's data into a JSON object
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]], {
                raw: false, // Read all cells as strings
                defval: ''  // Fill empty cells with an empty string
            });

            // Resolve the promise with the data
            resolve(data);
        } catch (error) {
            console.log("err : ", error);
            // If any error occurs during file reading or conversion, reject the promise with an empty array
            reject([]);
        }
    });
}



/**
 * Reads a CSV file and returns its content.
 * 
 * @param {string} filePath - The path to the CSV file to be read.
 * @returns {Promise<Object[]>} A promise that resolves with an array of objects representing the rows of the CSV file, or rejects with an empty array if an error occurs.
 */
function readCsvFile(filePath) {

    return new Promise(async (resolve, reject) => {
        // Check if the file exists at the given path
        const fileExists = await checkFileOrFolderExists(filePath);

        // If the file does not exist, reject the promise with an empty array
        if (!fileExists) {
            return reject([]);
        }

        const results = []; // Array to store all rows

        // Create a readable stream for the CSV file and parse it
        fs.createReadStream(filePath)
            .pipe(csv()) // Pipe the file stream to the CSV parser
            .on('data', (row) => {
                results.push(row); // Add each row to the results array
            })
            .on('end', () => {
                resolve(results); // Resolve the promise with the array of rows
            })
            .on('error', (error) => {
                reject([]); // Reject the promise with an empty array if an error occurs
            });
    });
}
