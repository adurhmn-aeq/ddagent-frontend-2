import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    //@ts-ignore
    model: "gpt-3.5-turbo-16k",
    temperature: 0.9,
});

export const sentimentAnalysis = async (conversationString:string) => {
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
        //   "You are a helpful assistant that translates {input_language} to {output_language}."
        `Given the content in ${conversationString}, analyze the dialogue between the assistant and the user. Evaluate the communication, clarity, Knowledge, fluency and professionalism present in the conversation. Provide ratings on a scale from 1 to 10, where 1 indicates poor and 10 indicates excellent.  so it should go like this communication:1/10, clarity:7/10, Knowledge: 2/10, fluency: 7/10 and Professionalism: 5/10. Provide only these ratings without any extra text.

        `
    ),
    HumanMessagePromptTemplate.fromTemplate(`${conversationString}`),
    ]);

    const chain = new LLMChain({ llm: model, prompt: chatPrompt });

    try {
    // The result is an object with a `text` property.
    const resA = await chain.call({ conversation: conversationString });
    // console.log( resA.text );

    console.log("Analysis:", resA);
    return resA
    } catch (error) {
    console.log("Error:", error);
    return error
    } finally {
    console.log("done analysing");
    }
}

