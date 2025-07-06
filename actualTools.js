import { config } from "dotenv";
import axios from "axios";
config();

export const getCurrentTime = () => {
    return Date.now();
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
    getWeatherInfo
};
export default availableTools;
