import { Type } from "@google/genai";

const toolsDeclaration = [
  {
    name: "flashlightOn",
    description: "turn on flash light ",
  },
  {
    name: "getWeatherInfo",
    description: "get weather info",
  },
  {
    name: "flashlightOff",
    description: "turn off flash light ",
  },
  {
    name: "getAllContacts",
    description: "get all contacts from device",
  },
  {
    name: "getCurrentTime",
    description: "get current date and time in readable format in string ",
  },
  {
    name: "msToIndianTime",
    description: "convert milliseconds time to Indian format time",
    parameters: {
      type: Type.OBJECT,
      properties: {
        ms: {
          type: Type.STRING,
          description: "milliseconds to convert",
        },
      },
      required: ["ms"],
    },
  },
  {
    name: "setTimerForTask",
    description:
      "set time for tasks after given seconds with message e.g. 2 minutes bad light off kar do",
    parameters: {
      type: Type.OBJECT,
      properties: {
        second: {
          type: Type.NUMBER,
          description:
            "seconds to set for call me e.g 2 minutes = 120 seconds or 1 hour = 3600 seconds",
        },
        message: {
          type: Type.STRING,
          description: "message to send when time is up e.g. light off kar do",
        },
      },
      required: ["second", "message"],
    },
  },
  {
    name: "takeSelfie",
    description: "take selfie. ",
  },
  {
    name: "openLastPhoto",
    description: "Open last taken photo",
  },
  {
    name: "soundRecorderStart",
    description: "Start sound recorder ",
  },
  {
    name: "soundRecorderStop",
    description: "Stop sound recorder ",
  },
  {
    name: "sendWhatsAppMessage",
    description: "send WhatsApp message to given number with message ",
    parameters: {
      type: Type.OBJECT,
      description: "send WhatsApp message to given number with message ",

      properties: {
        number: {
          type: Type.STRING,
          description: "number to send",
        },
        message: {
          type: Type.STRING,
          description: "Message to send",
        },
      },
      required: ["number", "message"],
    },
  },
  {
    name: "phoneCall",
    description: "call to given number ",
    parameters: {
      type: Type.OBJECT,
      properties: {
        number: {
          type: Type.STRING,
          description: "number to call",
        },
      },
      required: ["number"],
    },
  },
];
export default toolsDeclaration;
