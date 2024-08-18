// Import required modules from libraries.
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { Worker } = require('worker_threads');

// Import function/method from helpers.
const { checkFileOrFolderExists, deleteFile } = require("../../../helpers/utils/fileSystemHelper");
const { mainApiResponse } = require("../../../helpers/responses/apiResponse");
const { randomString } = require("../../../helpers/utils/helperFile")


const agent = require("../../../modles/agentModel");
const user = require("../../../modles/usersModel");
const userAccount = require("../../../modles/usersAccountModel");
const lobModel = require("../../../modles/lobModel");
const policyModel = require("../../../modles/policyModel");
const carrierModel = require("../../../modles/carrierModel");
const connection = require("../../../connections/connection");

/**
 * Middleware to fetch data from an uploaded XLS or CSV file and attach it to the request object.
 * 
 * This middleware:
 * 1. Extracts data from the uploaded file.
 * 2. Deletes the file after extracting the data.
 * 3. Attaches the extracted data to the `req` object for downstream handlers.
 * 4. Handles errors and sends a 500 response if any operation fails.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
async function extractDataFromUploadedFile(req, res, next) {
    try {
        // Extract data from the uploaded XLS or CSV file using the getDataFromXlsCsv function.
        // The extracted data is then attached to the `req` object as `req.data`.
        req.data = await getDataFromXlsCsv(req.file);

        // Store the file path of the uploaded file for later deletion.
        const filePath = req.file.path;

        // Delete the file after successfully reading and processing its data to free up resources.
        await deleteFile(filePath);

        // Call the next middleware in the stack, allowing the request to proceed.
        next();
    } catch (error) {
        //console.log("err : ", error)
        // If any error occurs during data extraction or file deletion, catch it.
        // Respond with a 500 Internal Server Error status and a descriptive message.
        return mainApiResponse(res, 500, 'failed', "Unable to upload file.", []);
    }
}


async function handelUploadedFileWithWorker(req, res, next) {
    try {
        const filePath = path.join(__dirname, `../../../${req.file.path}`);
        const workerFile = path.join(__dirname, `./dataInsertion.worker.js`);

        const worker = new Worker(workerFile, { workerData: filePath });

        worker.on('message', (message) => {
            //console.log("Worker message:", message);
        });

        worker.on('error', (error) => {
            //console.log("Worker stopped with error", error);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                //console.log("Worker stopped with exit code", code);
            }
        });

        return mainApiResponse(res, 200, 'success', "Processing policy data.", []);
    }
    catch (err) {
        return mainApiResponse(res, 500, 'failed', "Unable to process policy data.", []);
    }
}


async function dataPreparationAndInsertionService(req, res, next) {
    try {

        processAndInsertData(req.data);
        // return res.json({ data: req.data })
        return mainApiResponse(res, 200, 'success', "Processing policy data.", []);
    } catch (error) {
        return mainApiResponse(res, 500, 'failed', "Unable to upload file.", []);
    }
}

/**
 * Reads data from an XLS or CSV file and returns it as a JSON object.
 * 
 * This function checks if the specified file exists, then reads the first sheet from
 * the file (whether XLS or CSV) and converts it into a JSON object.
 * 
 * @param {Object} file - The file object, which should include the file path.
 * @returns {Promise<Array>} - Resolves to an array of objects representing the data from the first sheet.
 * @throws {Error} - If the file does not exist or cannot be read.
 */
function getDataFromXlsCsv(file) {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if the file exists at the given path
            const fileExists = await checkFileOrFolderExists(file.path);

            // If the file does not exist, reject the promise with an error
            if (!fileExists) {
                return reject(new Error("File does not exist."));
            }

            // Read the workbook from the file at the given path
            const workbook = XLSX.readFile(file.path);

            // Get the list of sheet names in the workbook
            const sheetNameList = workbook.SheetNames;

            // Convert the first sheet's data into a JSON object
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]], {
                raw: false, // This ensures that all cells are read as strings
                defval: ''  // Ensures empty cells are filled with an empty string
            })

            // Resolve the promise with the data
            resolve(data);
        } catch (error) {
            // If any error occurs during file reading or conversion, reject the promise
            reject(new Error(`Failed to read data from file: ${error.message}`));
        }
    });
}


async function findPloicyByuserName(req, res, next) {
    try {
        await connection();
        const { username } = req.params;
        const user_data = await user.findOne({ firstName: username })

        if (!user_data) {
            return mainApiResponse(res, 404, 'failed', 'User not found.', []);
        }

        const policies = await policyModel.find({ user_id: user_data._id }).populate('carrier_id').populate('lob_id');

        const result = policies.map((policy) => {
            return {
                policy_number: policy.policy_number,
                carrier_name: policy.carrier_id.company_name,
                lob_name: policy.lob_id.category_name,
                policy_start_date: policy.policy_start_date,
                policy_end_date: policy.policy_end_date
            }
        })

        return mainApiResponse(res, 200, 'success', 'User policies fetched successfully.', { ...user_data._doc, plicy: result });
    }
    catch (err) {
        return mainApiResponse(res, 500, 'failed', "Unable to fetch data.", []);
    }
}

async function processAndInsertData(data) {
    try {

        data = [...data?.map((item) => ({ ...item, userName: item?.userName?.trim() ? item?.userName?.trim() : randomString(9) }))];

        const agentData = data.map((data) => {
            return { agent_name: data.agent }
        }).filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.agent_name === value.agent_name
            ))
        );

        const company_data = data.map((data) => ({
            company_name: data.company_name,
            category_name: data.category_name
        })).filter((value, index, self) =>
            index === self.findIndex((t) => (t.company_name === value.company_name)));


        const userData = data.map((ele) => ({
            userName: ele.userName,
            firstname: ele.firstname,
            dob: ele.dob,
            address: ele?.address?.trim() ? ele?.address?.trim() : '',
            phone: ele?.phone?.trim() ? ele?.phone?.trim() : '',
            state: ele?.state?.trim() ? ele?.state?.trim() : '',
            zip: ele?.zip?.trim() ? ele?.zip?.trim() : '',
            gender: ele?.gender?.trim() ? ele?.gender?.trim() : '',
            userType: ele?.userType?.trim() ? ele?.userType?.trim() : '',
        }))


        const lobData = data.map((ele) => ({ category_name: ele.category_name }))
            .filter((value, index, self) => index === self.findIndex((t) => t.category_name === value.category_name));


        const agentDataInsertion = await agent.insertMany(agentData);
        const userDataInsertion = await user.insertMany(userData);
        const companyDataInsertion = await carrierModel.insertMany(company_data);
        const lobDataInsertion = await lobModel.insertMany(lobData);


        const tempAgentData = {};
        const tempUserData = {};
        const tempCompanyData = {};
        const tempLobData = {};

        agentDataInsertion.forEach((item) => {
            tempAgentData[item.agent_name] = item;
        });
        userDataInsertion.forEach((item) => {
            tempUserData[item.userName] = item;
        });
        companyDataInsertion.forEach((item) => {
            tempCompanyData[item.company_name] = item;
        });
        lobDataInsertion.forEach((item) => {
            tempLobData[item.category_name] = item;
        });

        const userAccountData = [];
        const policyData = [];

        data.forEach((ele, index) => {
            userAccountData.push({
                account_name: ele.account_name,
                account_type: ele.account_type,
                user_id: tempUserData[ele.userName]?._id
            });
            policyData.push({
                policy_number: ele.policy_number,
                policy_start_date: ele.policy_start_date,
                policy_end_date: ele.policy_end_date,
                lob_id: tempLobData[ele.category_name]?._id,
                carrier_id: tempCompanyData[ele.company_name]?._id,
                user_id: tempUserData[ele.userName]?._id
            });
        });


        const userAccountDataInsertion = await userAccount.insertMany(userAccountData);
        const policyDataInsertion = await policyModel.insertMany(policyData);

        return []
    } catch (error) {
        //console.log("err processAndInsertData: ", error)
        throw new Error("Failed to insert data into the database.");
    }
}

module.exports = {
    extractDataFromUploadedFile,
    dataPreparationAndInsertionService,
    handelUploadedFileWithWorker,
    processAndInsertData,
    findPloicyByuserName
};