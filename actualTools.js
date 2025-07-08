import { config } from "dotenv";
import axios from "axios";
import fs from "fs";

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
    timeZone: "Asia/Kolkata",
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
    timeZone: "Asia/Kolkata",
  });
}

const insertFactsIntoMemory = async (newMemory) => {
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

    const existingMemory = JSON.parse(fs.readFileSync(memoryFilePath, "utf8"));

    existingMemory.push(...newMemory);
    const uniqueMemory = existingMemory.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) =>
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

// Example

const availableTools = {
  getCurrentTime,
  msToIndianTime,
  getWeatherInfo,
  insertFactsIntoMemory,
};
export default availableTools;
