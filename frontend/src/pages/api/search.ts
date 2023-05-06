import { Inter } from "next/font/google";

import Searchkit from "searchkit";
import Client from "@searchkit/api";
import { NextApiRequest, NextApiResponse } from "next";

const inter = Inter({ subsets: ["latin"] });
const es_url = process.env.ES_URL || "http://localhost:9200";
const es_user = process.env.ES_USER || "elasticsearch";
const es_pass = process.env.ES_URL || "changeme";

const client = Client({
  connection: {
    host: es_url,
    // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-usernamepassword
    auth: {
      username: es_user,
      password: es_pass,
    },
  },
  search_settings: {
    highlight_attributes: ["name", "address", "categories"],
    search_attributes: [{ field: "name", weight: 3 }, "address", "categories"],
    result_attributes: ["name", "address", "price", "categories", "stars"],
    facet_attributes: [
      {
        attribute: "categories",
        field: "categories.keyword", // field must be a keyword type field
        type: "string",
      },
      // stars
      {
        attribute: "stars",
        field: "stars",
        type: "numeric",
      }
    ],
  },
});

// example API handler for Next.js
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const results = await client.handleRequest(req.body);
  res.send(results);
}
