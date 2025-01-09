/* eslint-disable @typescript-eslint/no-explicit-any */
import { Worker } from 'worker_threads';

/**
 * For CPU intensive tasks only
 * Creates a new thread running the specified worker file.
 * @param {string} workerFile - The path to the worker file.
 * @param {any} workerData - Data to be passed to the worker thread.
 * @returns {Promise<any>} - A promise that resolves with the worker's result.
 */
function createThread(workerFile: string, workerData: any): Promise<any> {
    console.log(workerFile);
    return new Promise((resolve, reject) => {
        const worker = new Worker(workerFile, {workerData});
        worker.on("message", (data) => {
            resolve(data);
        });
        worker.on("error", (error) => {
            reject(`An error occurred: ${error}`);
        });
    });
}

export default createThread;
