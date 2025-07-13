import { FunctionCallingConfigMode, GoogleGenAI, Type } from "@google/genai";
import { config } from "dotenv";
import express from "express";
import { getHistory, addHistory } from "./memory.js";
import toolsDeclaration from "./toolsDeclaration.js";
import availableTools, { getCurrentTime } from "./actualTools.js";
config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const app = express();

app.use(express.json());
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const agent = async () => {
  // console.log(JSON.stringify(conversation, null, 2));
  // const systemPrompt = `
  // You are a powerful AI assistant that helps users perform actions on their Android phone.
  // You can control various phone functions like making calls, sending WhatsApp messages, sending emails, turning off the screen, and playing music.
  // Your job is to:
  // - Clearly understand the user's intention.
  // - Call the correct tool with accurate and minimal parameters.
  // - Never guess parameters like phone numbers or emails; always confirm or ask if missing.
  // - If a tool is not needed (e.g., answering general questions), reply directly.
  //
  // Be natural and helpful in your tone. Only use a tool when necessary.
  //
  // ### Available tools:
  // ${JSON.stringify(toolsDeclaration, null, 2)}
  //
  // Examples:
  // - "Call mom" → callPhone({ contactName: "mom" })
  // - "Send 'I'm on the way' to John on WhatsApp" → sendWhatsAppMessage({ contactName: "John", message: "I'm on the way" })
  // - "Email boss the meeting notes" → sendEmail({ to: "boss@example.com", subject: "Meeting Notes", body: "..." })
  // - "Turn off the screen" → turnScreenOff({})
  // - "Play some music" → playMusic({})
  // `;

  const systemPrompt = `
You are a powerful AI assistant that helps users in two ways:

1️⃣ You can **perform actions on their Android phone**, like making calls, sending WhatsApp messages, sending emails, turning off the screen, and playing music and more. 

2️⃣ You can **answer general questions**, such as telling stories, writing rhymes, providing facts, or assisting with any kind of natural language query — without using phone functions when not needed.

Your job is to:
- Clearly understand the user's intention.
- Call the correct tool with accurate and minimal parameters when **a phone action is requested**.
- Never guess sensitive parameters (e.g., phone numbers, email addresses). If missing, either confirm with the user or reply that the information is needed.
- When the user asks for general knowledge (e.g., "Tell me a story", "Write a rhyme", "What is the capital of France?"), **answer directly** without using a tool.
- Keep your responses clear, friendly, and natural.

Only use a tool when necessary for performing a phone action. If no tool is needed, respond directly with the best possible answer.

### Available tools:
${JSON.stringify(toolsDeclaration, null, 2)}

### Examples:
- "call dady" -> if you don't know daddy's or any buddy number to direct tool call getAllContacts then phonecall dady with number 
- "Call mom" → callPhone({ contactName: "mom" })
- "Send 'I'm on the way' to John on WhatsApp" → sendWhatsAppMessage({ contactName: "John", message: "I'm on the way" })
- "Email boss the meeting notes" → sendEmail({ to: "boss@example.com", subject: "Meeting Notes", body: "..." })
- "Turn off the screen" → turnScreenOff({})
- "Play some music" → playMusic({})
- "Tell me a bedtime story" → Respond directly with a creative story. No tool needed.
- "Write a rhyme about the moon" → Respond directly with a rhyme. No tool needed.
- "What is 5 + 7?" → Respond directly: "The answer is 12."
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: conversation,
    systemInstruction: systemPrompt,
    config: {
      temperature: 1.5,
      tools: [{ functionDeclarations: toolsDeclaration }],
    },
  });
  //console.log(JSON.stringify(response, null, 2));

  conversation.push({
    role: "model",
    parts: [
      {
        text: JSON.stringify(
          text(response.text || JSON.stringify(response.functionCalls))
        ),
      },
    ],
  });
  tempConversation.push({
    role: "model",
    parts: [
      {
        text: JSON.stringify(
          text(response.text || JSON.stringify(response.functionCalls))
        ),
      },
    ],
  });
  return response;
};

const conversation = [...(await getHistory())];
let tempConversation = [];

const text = (text) => ({
  text: text,
  timestamp: getCurrentTime(),
});
app.post("/api/v1/gemini-agent", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.send("prompt is not defined ");
      return;
    }

    conversation.push({
      role: "user",
      parts: [{ text: JSON.stringify(text(prompt)) }],
    });
    tempConversation.push({
      role: "user",
      parts: [{ text: JSON.stringify(text(prompt)) }],
    });

    let maxLoop = 10;
    while (maxLoop-- > 0) {
      const response = await agent();

      //console.log()

      // "text": "{\"text\":\"[{\\\"name\\\":\\\"setTimerForTask\\\",\\\"args\\\":{\\\"second\\\":120,\\\"message\\\":\\\"whatsapp suraj\\\"}}]\",\"timestamp\":\"13 July 2025 at 8:07:51 pm\"}",
      //   "mode": "text" // 5:30 = 3300 seconds
      let functionCalls;
      try {
        let parsedText = JSON.parse(response.text);
        console.log({ parsedText });
        parsedText = JSON.parse(parsedText.text);
        console.log({ parsedText });
        functionCalls = parsedText;
      } catch (error) {}

      functionCalls = response.functionCalls || functionCalls;

      if (functionCalls) {
        console.log("Function calls detected:", functionCalls);

        const FunName = functionCalls[0].name;
        const FunArgs = functionCalls[0].args;
        // console.log({ FunArgs });
        const gottenFunction = availableTools[FunName];

        if (gottenFunction) {
          const toolResponse = await gottenFunction(FunArgs);
          conversation.push({
            role: "user",
            parts: [
              {
                functionResponse: {
                  name: FunName,
                  response: {
                    response: {
                      stringValue: toolResponse,
                    },
                  },
                },
              },
            ],
          });
          tempConversation.push({
            role: "user",
            parts: [
              {
                functionResponse: {
                  name: FunName,
                  response: {
                    response: {
                      stringValue: toolResponse,
                    },
                  },
                },
              },
            ],
          });
        } else {
          res.send({
            // text: response.text,
            functionCalls,
            mode: functionCalls ? "functionCalls" : "text",
          });
          break;
        }
      } else {
        res.send({
          text: response.text,
          // functionCalls: response.functionCalls,
          mode: response.text ? "text" : "functionCalls",
        });
        break;
      }
    }
    await addHistory(tempConversation);
    tempConversation = [];
  } catch (e) {
    console.log(e);
  }
});

app.get("/api/v1/gemini-agent/history", async (req, res) => {
  try {
    const history = await getHistory();
    res.send(history);
  } catch (e) {
    console.log(e);
    res.status(500).send("Error fetching history");
  }
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
app.post("/api/v1/gemini-agent/fix-memory", async (req, res) => {
  try {
    const allMemory = await getHistory();
    res.send({ text: "fixing memory for ", memory: allMemory });

    const maxLoop = allMemory.length / 10;
    for (let i = 2; i < maxLoop; i++) {
      const from = req.body.from ?? i * 10;
      const to = req.body.to ?? from + 10;

      console.log("from", from, "to", to);
      const tenMemory = allMemory.slice(from, to); // Get 10 messages at a time
      // console.log("first 10 messages:", JSON.stringify(tenMemory, null, 2));

      const systemPrompt = ` You are an intelligent AI assistant designed to analyze conversation history and extract only important personal and household information.
      Your job:

      Identify and extract facts related to:

      Personal info: user’s name, age, contact details

      Family info: names, relationships, phone numbers

      Relatives & friends info: names, relationships, phone numbers

      Home-related info: arrival of milk, groceries, bills, repairs, chores, items bought or needed

      Daily activities & routines: work done, tasks planned, reminders set

      Events or time-sensitive info: when someone visited, time of delivery, etc.

      📌 How to respond:
      example Output in:

      [
          {
            "role": "user|model",
            "parts":[{
                        "text":"timestamp: <timestamp>,
      category: <personal|family|friend|home_item|daily_work|other>,
      info: <short description of the fact>,
      details: more details "
            }]
          }
      ]

      📌 Ignore:

      Greetings, small talk, generic responses

      Anything unrelated to personal/home life (unless linked)

      📌 Examples of what to extract:

      “Suraj ko call karo” → friend info + action

      “Milk aaya kya?” → home_item info

      “Kal light bill dena hai” → daily_work info

      “Mummy ka number +91XXXX” → family info

      💡 Example Output
      [
        {
          "role": "user|model",
          "parts":[{
                        "text":"timestamp: 7/5/2025, 11:15:11 PM,
      category: friend,
      info: User requested call to friend Suraj Kumar Jio,
      details:
        name: Suraj Kumar Jio,
        phone_number: +916204216011
           }]
        },
        {
          "role": "user|model",
          "parts":[{
                        "text":"timestamp: 7/5/2025, 11:17:30 PM,
      category: personal,
      info: User identity shared,
      details:
        name: Bhuwneshwar Mandal
        }]
        },
      {
          "role": "user|model",
          "parts":[{
                        "text":"timestamp: 7/5/2025, 11:17:30 PM,
      category: personal,
      info: User identity shared,
      details:
        name: Bikram
        }]

      }
      ]  `;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: [
          ...tenMemory,
          {
            role: "user",
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
        ],
        systemInstruction: systemPrompt,

        config: {
          temperature: 1,
          // responseSchema:"application/json"
          toolConfig: {
            functionCallingConfig: {
              // Force it to call any function
              mode: FunctionCallingConfigMode.ANY,
              allowedFunctionNames: ["insertFactsIntoMemory"],
            },
          },
          tools: [
            {
              functionDeclarations: [
                {
                  name: "insertFactsIntoMemory",
                  description: "Insert extracted facts into memory",
                  parameters: {
                    type: Type.OBJECT,
                    properties: {
                      contents: {
                        type: Type.ARRAY,
                        description:
                          "Array of extracted facts containing timestamp, category, info, and details contents",
                        items: {
                          type: Type.OBJECT,
                          description: "Extracted fact object",
                          required: ["role", "parts"],
                          properties: {
                            role: {
                              type: Type.STRING,
                              description:
                                "Role of the message (user or model)",
                              enum: ["user", "model"],
                            },
                            parts: {
                              type: Type.ARRAY,
                              description: "Array of message parts",
                              items: {
                                type: Type.OBJECT,
                                description: "Message part containing text",
                                properties: {
                                  text: {
                                    type: Type.STRING,
                                    description:
                                      "Main Text content of the message part",
                                    example: `timestamp: <timestamp>,
      category: <personal|family|friend|home_item|daily_work|other>,
      info: <short description of the fact>,
      details: more details`,
                                  },
                                },
                                required: ["text"],
                              },
                            },
                          },
                        },
                      },
                    },
                    required: ["contents"],
                  },
                },
              ],
            },
          ],
        },
      });

      // console.log(JSON.stringify(response, null, 2));
      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0];
        if (functionCall.name === "insertFactsIntoMemory") {
          const facts = functionCall.args.contents;
          // console.log("Extracted facts:", JSON.stringify(facts, null, 2));
          if (!facts || !Array.isArray(facts) || facts.length === 0) {
            // res.status(400).send("No facts extracted");
            return;
          }
          availableTools.insertFactsIntoMemory(facts);

          // Here you would insert the facts into your memory system
          // For example, save to a database or file

          // res.send({ success: true, facts });
        } else {
          // res.status(400).send("Unexpected function call name");
          console.log(
            `Unexpected function call name: ${functionCall.name}. Expected 'insertFactsIntoMemory'.`
          );
        }
      } else {
        // res.status(400).send("No function calls found in response");
        console.log("No function calls found in response");
      }

      // Usage:
      await wait(5000); // waits for 10 seconds
    }
    console.log("All memory fixed successfully");
  } catch (e) {
    console.log(e);
    res.status(500).send("Error clearing history");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
