import { XMLParser } from "fast-xml-parser";

export async function getRssArticles() {
  try {
    const response = await fetch(``);

    const xmlString = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const result = parser.parse(xmlString);

    return result.rss.channel.item;
  } catch (error) {
    console.error(error);
  }
}
