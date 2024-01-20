import { OpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import z from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";
import { loadQARefineChain } from "langchain/chains";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

//schema and result defination using zod
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe(
        "the mood of the person who wrote the journal entry. Example is positive, 'negative', 'neutral' and so on. If you don't have enough context, return some key word from the entry and must never  return unrelated info"
      ),
    summary: z
      .string()
      .describe(
        "quick summary of the entire entry. If you don't have enough context, return some key word and make a comprehensive sentence or statement from the entry and must never return unrelated info, also summary should never be more than 15 words the whole sentence irrespective of the entry length"
      ),
    subject: z.string().describe("the subject of the journal entry."),
    negative: z.boolean().describe("is the journal entry negative? (i.e. does it contain negative emotions?)."),
    color: z
      .string()
      .describe("a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing positive."),
    sentimentScore: z
      .number()
      .describe(
        "sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive."
      ),
  })
);

//get prompt ready for analysis
const getPrompt = async (content: string) => {
  //format zod
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      "Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}",
    inputVariables: ["entry"],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({
    entry: content,
  });

  return input;
};

//analyze journal
export const analyze = async (content: string) => {
  const input = await getPrompt(content);
  const model = new OpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
  });

  const result = await model.invoke(input);
  try {
    return parser.parse(result);
  } catch (error) {
    console.log(error);
  }
};

// answer questions based on your previous journals
export const qa = async (question: string, entries: { id: string; content: string; createdAt: Date }[]) => {
  const docs = entries.map((entry) => {
    return new Document({
      pageContent: entry.content,
      metadata: { id: entry.id, createdAt: entry.createdAt },
    });
  });

  const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" });
  const chain = loadQARefineChain(model);
  const embeddings = new OpenAIEmbeddings();
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const relevantDocs = await store.similaritySearch(question);

  const res = await chain.invoke({
    input_documents: relevantDocs,
    question: `Be a genuine and good psychologist, and return a well refined answer only. Must Give me only my answer, no fluff or pointers like ('Refined answer:'). So the question is: ${question}`,
  });
  console.log(res);
  return res.output_text;
};
