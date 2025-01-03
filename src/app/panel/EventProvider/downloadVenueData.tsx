"use server";
import { XMLParser } from "fast-xml-parser";

export async function downloadVenueData() {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    // get multiple XML files
    const urls: { [key: string]: string } = {
      venue:
        "https://res.data.gov.hk/api/get-download-file?name=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fvenues.xml",
    };
    const venueData = await Promise.all(
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
      venue: [],
    } as {
      venue: {
        "@_id": string;
        "@_eventCount": number;
        latitude: number;
        longitude: number;
      }[];
    };
    const [venue] = venueData;

    if (venue) {
      const venues = venue?.venue?.venues?.venue;
      output.venue = Array.isArray(venues)
        ? venues.filter((v) => v["latitude"] && v["longitude"])
        : [];
    }

    return JSON.stringify(output.venue);
  } catch (e) {
    return JSON.stringify([]);
  }
}
