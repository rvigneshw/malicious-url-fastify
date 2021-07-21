import { db } from "./db.js";
import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

fastify.route({
  method: "GET",
  url: "/check",
  schema: {
    querystring: {
      url: { type: "string" },
    },
    response: {
      200: {
        type: "object",
        properties: {
          malicious: { type: "boolean" },
        },
      },
    },
  },
  preHandler: async (request, reply) => {
    // Todo check request headers
  },
  handler: async (request, reply) => {
    const { url } = request.query;
    const processedUrl = url.toLowerCase();
    const key = generateHashKey(processedUrl);
    const filteredData = db[key] || false;

    return { malicious: filteredData && filteredData.includes(processedUrl) };
  },
});

const generateHashKey = (url) => {
  return `${url.charAt(0)}${url.length}`;
};
const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
