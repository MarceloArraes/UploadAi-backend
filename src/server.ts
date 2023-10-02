import { fastify } from "fastify";
import { prisma } from "./lib/prisma";
import { getAllPromptsRoutes } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";

const app = fastify();

app.register(getAllPromptsRoutes);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoute);

app.get("/", async () => {
  const prompts = await prisma.prompt.findMany();

  return "Hello World";
});

app.listen({ port: 3333 }).then((data) => {
  console.log("server running port 3333", data);
});
