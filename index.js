import { GoogleGenAI } from "@google/genai";
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
    //console.log(JSON.stringify(conversation, null, 2));
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
        model: "gemini-2.5-pro",
        contents: conversation,
        systemInstruction: systemPrompt,
        config: {
            temperature: 1.5,
            tools: [{ functionDeclarations: toolsDeclaration }]
        }
    });
    //console.log(JSON.stringify(response, null, 2));
    conversation.push({
        role: "model",
        parts: [
            {
                text:
                    response.text ||
                    JSON.stringify(response.functionCalls) +
                        " | timestamp: " +
                        getCurrentTime()
            }
        ]
    });
    tempConversation.push({
        role: "model",
        parts: [
            {
                text:
                    response.text ||
                    JSON.stringify(response.functionCalls) +
                        " | timestamp: " +
                        getCurrentTime()
            }
        ]
    });
    return response;
};

const conversation = [...(await getHistory())];
let tempConversation = [];
app.post("/api/v1/gemini-agent", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            res.send("prompt is not defined ");
            return;
        }

        conversation.push({
            role: "user",
            parts: [{ text: prompt + " | timestamp: " + getCurrentTime() }]
        });
        tempConversation.push({
            role: "user",
            parts: [{ text: prompt + " | timestamp: " + getCurrentTime() }]
        });

        let maxLoop = 10;
        while (maxLoop-- > 0) {
            const response = await agent();
            //console.

            if (response.functionCalls) {
                const FunName = response.functionCalls[0].name;
                const FunArgs = response.functionCalls[0].args;
                // console.log({ FunArgs });
                const gottenFunction = availableTools[FunName];

                if (gottenFunction) {
                    const toolResponse = await gottenFunction(FunArgs);
                    conversation.push({
                        role: "user",
                        parts: [
                            {
                                text:
                                    `tool says: ${toolResponse}` +
                                    " | timestamp: " +
                                    getCurrentTime()
                            }
                        ]
                    });
                    tempConversation.push({
                        role: "user",
                        parts: [
                            {
                                text:
                                    `tool says: ${toolResponse}` +
                                    " | timestamp: " +
                                    getCurrentTime()
                            }
                        ]
                    });
                } else {
                    res.send({
                        text: response.text,
                        functionCalls: response.functionCalls,
                        mode: response.text ? "text" : "functionCalls"
                    });
                    break;
                }
            } else {
                res.send({
                    text: response.text,
                    functionCalls: response.functionCalls,
                    mode: response.text ? "text" : "functionCalls"
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

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
