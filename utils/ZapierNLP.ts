import { OpenAI } from "langchain/llms/openai";
import { ZapierNLAWrapper } from "langchain/tools";
import {
  initializeAgentExecutorWithOptions,
  ZapierToolKit,
} from "langchain/agents";

export const emailAgent = async (data:string) => {
    const model = new OpenAI({ temperature: 0 });
    const zapier = new ZapierNLAWrapper();
    const toolkit = await ZapierToolKit.fromZapierNLAWrapper(zapier);

    const executor = await initializeAgentExecutorWithOptions(
        toolkit.tools,
        model,
        {
          agentType: "zero-shot-react-description",
          verbose: true,
        }
      );

      return executor
}