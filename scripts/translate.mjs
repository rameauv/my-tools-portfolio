import OpenAI from "openai";
import input from "./input.mjs";

const client = new OpenAI({
  apiKey: "flp_lAVP0Z9B0ShNjSiKZiHeO2t11zNR5meG6YL4z6CPXIo041",
  baseURL: "https://api.friendli.ai/serverless/v1",
});

async function main() {
  const completion = await client.chat.completions.create({
    model: "meta-llama/Llama-3.1-8B-Instruct",
    messages: [
      { role: "system", content: "You are a helpful assistant that translates english to korean." },
      { role: "user", content: input },
    ],
  });

  console.log(completion.choices[0].message.content);
}

main().catch(console.error);