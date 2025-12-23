import { config } from "dotenv";
import axios from "axios";
import fs from "fs";
import { ai } from "./index.js";
import { exec } from "node:child_process";
import fsPromiss from "fs/promises";
import path from "path";

import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Polyfill for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

export const getCurrentTime = () => {
    return new Date(Date.now()).toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
        timeZone: "Asia/Kolkata"
    });
};

function msToIndianTime({ ms }) {
    // console.log({ ms });
    return new Date(+ms).toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
        timeZone: "Asia/Kolkata"
    });
}

const insertFactsIntoMemory = async newMemory => {
    try {
        // append the new memory to a file  name `fixedMemory.json`
        // console.log("New Memory to insert:", newMemory); //this is array of objects
        if (!Array.isArray(newMemory)) {
            throw new Error("New memory must be an array of objects");
        }

        const memoryFilePath = "fixedMemory.json"; // Adjust the path as needed
        if (!fs.existsSync(memoryFilePath)) {
            fs.writeFileSync(memoryFilePath, JSON.stringify([])); // Create an empty array if file doesn't exist
        }

        const existingMemory = JSON.parse(
            fs.readFileSync(memoryFilePath, "utf8")
        );

        existingMemory.push(...newMemory);
        const uniqueMemory = existingMemory.filter(
            (item, index, self) =>
                index ===
                self.findIndex(
                    t =>
                        t.role === item.role &&
                        JSON.stringify(t.parts) === JSON.stringify(item.parts)
                )
        );

        // console.log("Unique Memory before insertion:", uniqueMemory);

        // Write the updated memory back to the file
        fs.writeFileSync(memoryFilePath, JSON.stringify(uniqueMemory, null, 2));

        return "contents inserted successfully";
        // console.log("Facts inserted successfully");
        // return "Facts inserted successfully";
    } catch (error) {
        console.error("Error inserting facts into memory:", error);
        return "Error inserting facts into memory: " + error.message;
    }
};

const getWeatherInfo = async () => {
    try {
        console.log("calling getWeatherInfo");
        const API_KEY = process.env.OPENWEATHER_API_KEY;
        const city = "Katihar"; // You can change city dynamically

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await axios.get(url);
        const data = response.data;
        console.log(JSON.stringify(response.data, null, 2));

        return (
            `🌤 Weather in ${data.name}, ${data.sys.country}` +
            `Temperature: ${data.main.temp} °C` +
            `Condition: ${data.weather[0].description}` +
            `Humidity: ${data.main.humidity}%` +
            `Wind Speed: ${data.wind.speed} m/s`
        );
    } catch (err) {
        console.error(
            "Error fetching weather:",
            err.response ? err.response.data : err.message
        );
        return "Error fetching weather:" + err.response
            ? err.response.data
            : err.message;
    }
};

const conversation = [];
const askAnyThingToAi = async ({ prompt }) => {
    const systemPrompt = `your name is sweety mandal. made by Bhuwneshwar mandal. your work :
    any types of questions you have to answer in hinglish langluage
`;
    console.log(systemPrompt);

    conversation.push({
        role: "user",
        parts: [
            {
                text: prompt
            }
        ]
    });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: conversation,
        systemInstruction: systemPrompt
        // config: {
        //     temperature: 1.5,
        //     tools: [{ functionDeclarations: toolsDeclaration }]
        // }
    });
    //  console.log(JSON.stringify(response, null, 2));

    conversation.push({
        role: "model",
        parts: [
            {
                text: response.text
            }
        ]
    });
    return response.text;
};

const NOTES_FILE = "importantNotes.json";

// Ensure the file exists
function initFile() {
    if (!fs.existsSync(NOTES_FILE)) {
        fs.writeFileSync(NOTES_FILE, JSON.stringify([]), "utf-8");
    }
}

// Add a new note
function addImportantNote({ note }) {
    initFile();
    const notes = JSON.parse(fs.readFileSync(NOTES_FILE, "utf-8"));
    notes.push(note);
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), "utf-8");
    return { message: "Note added successfully", note };
}

// Get all notes
function getAllImportantNotes() {
    initFile();
    const notes = JSON.parse(fs.readFileSync(NOTES_FILE, "utf-8"));
    return notes;
}

// Replace all notes
function updateAllImportantNotes({ notes }) {
    try {
        const parsed = JSON.parse(notes); // Must be a stringified array
        if (!Array.isArray(parsed))
            throw new Error("Invalid format. Expected JSON stringified array.");
        fs.writeFileSync(NOTES_FILE, JSON.stringify(parsed, null, 2), "utf-8");
        return { message: "Notes updated successfully" };
    } catch (err) {
        return { error: err.message };
    }
}

const runNodeJsCode = async ({ code }) => {
    try {
        const dir = join(__dirname, "customCode");
        const filePath = join(dir, "index.js");

        // Step 1: Ensure folder exists (create if not)
        await fsPromiss.mkdir(dir, { recursive: true });

        // Step 2: Write the code to index.js
        await fsPromiss.writeFile(filePath, code, "utf8");
        console.log("✅ Code written to customCode/index.js");

        // Step 3: Run the code using exec

        const result = await runLinuxCommand({
            command: "node customCode/index.js"
        });
    } catch (err) {
        console.error("Error on runNodeJsCode:", err);
        return `Error on runNodeJsCode:` + err;
    }
};

// 🔽 Example usage
// const code = `
// console.log("Hello from dynamically created file!");
// const sum = 5 + 3;
// console.log("Sum:", sum);
// `;

// runNodeJsCode({ code });

const runLinuxCommand = async ({ command }) => {
    try {
        let Output;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                Output = `Error: ${error.message}`;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                Output = `Stderr: ${stderr}`;
            }
            console.log(`Output:\n${stdout}`);
            Output = `Output:\n${stdout}`;
        });
        return Output;
    } catch (err) {
        console.error("Error on runNodeJsCode:", err);
        return `Error on runNodeJsCode:` + err;
    }
};

const availableTools = {
    getCurrentTime,
    msToIndianTime,
    getWeatherInfo,
    askAnyThingToAi,
    addImportantNote,
    getAllImportantNotes,
    updateAllImportantNotes,
    runLinuxCommand,
    runNodeJsCode,
    insertFactsIntoMemory
};
export default availableTools;
