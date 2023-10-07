import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { openai } from "../lib/openai";
export const generateAiCompletionRoute = async (app: FastifyInstance) => {
  app.post("/ai/complete", async (req, response) => {
    const bodySchema = z.object({
      videoId: z.string().uuid(),
      template: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    });

    const { videoId, template, temperature } = bodySchema.parse(req.body);
    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    if (!video.transcription) {
      return response
        .status(400)
        .send({ error: "video transcription was not generated" });
    }
    const promptMessage = template.replace(
      "{transcription}",
      video.transcription
    );

    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      temperature: temperature,
      messages: [
        {
          role: "user",
          content: promptMessage,
        },
      ],
    });
    return openaiResponse;
  });
};