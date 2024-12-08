"use server";
import { XMLParser } from "fast-xml-parser";

export async function downloadData() {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    // get multiple XML files
    const urls: { [key: string]: string } = {
      event:
        "https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fevents.xml",
    };
    const data = await Promise.all(
      Object.entries(urls).map(([key, url]) =>
        fetch(url)
          .then((res) => res.text())
          .then((data) => {
            const parsed = parser.parse(data);
            return { [key]: parsed };
          })
      )
    );

    const output = {
      event: {},
    } as {
      event: { id: string; venueid: string }[];
    };
    const [event] = data;

    const events = event?.event?.events?.event;
    output.event = Array.isArray(events) ? events : [];

    return output;
  } catch (e) {
    return {};
  }
}
