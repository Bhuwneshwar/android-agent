import fs from "fs";
import { promisify } from "util";

// Promisify readFile and writeFile
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const getHistory = async () => {
    try {
        const data = await readFileAsync("history.json", "utf8");
        const DataArr = JSON.parse(data);
        // console.log(DataArr);
        return DataArr;
    } catch (err) {
        console.error("Error reading or parsing file:", err);
        return []; // Return an empty array in case of error
    }
};

const addHistory = async recentMemory => {
    try {
        const DataArr = await getHistory();
        recentMemory.forEach(obj => {
            DataArr.push(obj);
        });

        const jsonData = JSON.stringify(DataArr, null, 2);

        await writeFileAsync("history.json", jsonData);
        // console.log("File has been written successfully");
    } catch (err) {
        console.error("Error updating history:", err);
    }
};

const addTenItem = (userPrompt, modelAns, arr) => {
    arr.push({
        role: "user",
        parts: [{ text: userPrompt }]
    });
    arr.push({
        role: "model",
        parts: [{ text: modelAns }]
    });
    if (arr.length > 20) {
        const removeCount = arr.length - 20;
        arr.splice(-removeCount);
    }
};

const removeUnwantedMemories = async () => {
    try {
    } catch (e) {
        console.log(e);
    }
};
// addHistory("hi I'm Bhuwneshwar", "hello Bhubaneswar");
export { getHistory, addHistory, addTenItem };
