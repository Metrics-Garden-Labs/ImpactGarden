//import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { openai } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText, StreamData } from "ai";
import { stream } from "fast-check";

export async function POST(req: Request) {
  try {
    // const body = await req.json();
    // const messages: ChatCompletionMessage[] = body.messages;

    // const messagesTruncated = messages.slice(-6);
    // //this only sends the last 6 messages to keep it cheaper, can change depending on performance

    // const systemMessage: ChatCompletionMessage = {
    //   role: "assistant",
    //   content:
    //     "You are a helpful assistant. You will help governance members of the optimsim ecosystem in ethereum and grantees applying to grants using metrics garden.",
    // };
    // const result = await openai.chat.create({
    //   model: openai("gpt-3.5-turbo"),
    //   stream: true,
    //   messages: [systemMessage, ...messagesTruncated],
    // });

    const { messages } = await req.json();

    const result = await streamText({
      messages,
      model: openai("gpt-3.5-turbo"),
    });

    const data = new StreamData();

    const stream = result.toAIStream({
      onFinal(_) {
        data.close();
      },
    });

    return new StreamingTextResponse(stream, {}, data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
