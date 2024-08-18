// accessing environment variables
require("dotenv").config();

// Importing packages/external libraries
const pm2 = require('pm2');
const osu = require('node-os-utils');
const cpu = osu.cpu;

// environment variables/constant
const ALLOWED_RESTART_SYSTEM = process.env.ALLOW_RESTART == 'true' ? true : false;


/**
 * Monitors CPU usage and restarts the server if usage exceeds a given threshold.
 *
 * @param {number} threshold - The CPU usage percentage threshold for triggering a restart (default is 70).
 * @param {number} interval - The interval in milliseconds between checks (default is 60000ms).
 * @returns {void} - No return value. The function performs an action based on CPU usage.
 */
async function monitorCPU(threshold = 70, interval = 60000) {
    try {
        // Get the current CPU usage percentage
        const cpuUsage = await cpu.usage();
        console.log(`Current CPU Usage: ${cpuUsage}%`);

        // Check if automatic restart is allowed
        if (!ALLOWED_RESTART_SYSTEM) {
            console.log(process.env.ALLOW_RESTART);
            return; // Exit function if restart is not allowed
        }

        // Restart the server if CPU usage exceeds the threshold
        if (cpuUsage > threshold) {
            console.log(`CPU usage exceeded ${threshold}%. Restarting server...`);
            restartServer(); // Call function to restart the server
        }
    } catch (error) {
        // Log any errors that occur during CPU monitoring
        console.error("Error in monitorCPU:", error);
    }

    // Schedule the next CPU check after the specified interval
    setTimeout(() => monitorCPU(threshold, interval), interval);
}



/**
 * Restart the server using PM2
 * 
 * Input Parameters: None
 * Output: Console logs indicating the success or failure of the restart operation
 */
function restartServer() {
    // Connect to PM2
    pm2.connect((err) => {
        if (err) {
            // Log error if connection to PM2 fails
            console.error('Error connecting to PM2:', err);
            return; // Exit the function if connection fails
        }

        // Restart all applications managed by PM2
        pm2.restart('all', (err) => {
            // Disconnect from PM2 after attempting to restart
            pm2.disconnect();

            if (err) {
                // Log error if restarting the server fails
                console.error('Error restarting the server:', err);
            } else {
                // Log success message if the server restarted successfully
                console.log('Server restarted successfully.');
            }
        });
    });
}


// Start monitoring CPU with a 70% threshold and check every minute
module.exports = {
    monitorCPU
}
