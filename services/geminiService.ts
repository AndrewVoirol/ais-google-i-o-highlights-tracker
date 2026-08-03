
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Headline } from '../types';

// Ensure API_KEY is accessed from import.meta.env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY for Google GenAI is not set in environment variables. Gemini API calls will fail. Please ensure it is configured.");
}

// Initialize GoogleGenAI with a fallback API_KEY to prevent immediate crash if undefined,
// allowing the application to load and display an error message.
const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY_FALLBACK" });

function generateUniqueId(title?: string): string {
  const prefix = title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'item';
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export async function fetchHeadlines(): Promise<Headline[]> {
  if (!API_KEY || API_KEY === "MISSING_API_KEY_FALLBACK") {
    console.error("Gemini API Key is not configured.");
    throw new Error("VITE_GEMINI_API_KEY for Gemini API is not configured. Please set the VITE_GEMINI_API_KEY environment variable.");
  }

  const targetUrl = "https://io.google/2025/explore";

  const prompt = `
    You are an AI assistant generating plausible, fictional announcements for Google I/O 2025.
    This is a simulated two-day event: Monday, May 19th, 2025, and Tuesday, May 20th, 2025.
    The opening keynote announcements should occur on May 19th, 2025, between 09:00 AM PST and 11:00 AM PST.
    Subsequent announcements should follow sequentially throughout May 19th and May 20th, 2025.
    All timestamps MUST be in ISO 8601 UTC format (e.g., 09:00 AM PST on May 19, 2025 is 2025-05-19T16:00:00Z).

    **CRITICAL INSTRUCTION**: Use your Google Search tool to gather information and inspiration primarily from the website URL: ${targetUrl}.
    The announcements you generate should reflect the kinds of topics, products, or themes that might be featured on such an "explore" page for Google I/O 2025.
    If you find specific information on that URL (or related official Google sources found via search), prioritize it.
    If direct content from the URL is unavailable or sparse, generate plausible announcements consistent with typical Google I/O themes (AI, Android, Web, Cloud, etc.), but still as if they would fit on an "explore" page for the 2025 event.

    The output MUST be a valid JSON array. Each element in the array MUST be a JSON object strictly adhering to the following structure.
    All string values within the JSON objects MUST be properly JSON escaped (e.g., double quotes within strings should be represented as \\", newlines as \\n).

    The JSON object structure is:
    {
      "id": "string", // Unique slug-like identifier based on the title
      "title": "string", // Headline of the announcement
      "category": "string", // e.g., "AI & Machine Learning", "Android & Mobile", "Web Platform", "Cloud", "Sustainable Tech"
      "summary": "string", // Brief 1-2 sentence summary. Ensure newlines and quotes are escaped.
      "imageUrl": "string", // Placeholder image URL using picsum.photos
      "actionText": "string", // e.g., "Explore Feature", "Read the Blog", "Watch Session"
      "actionLink": "string", // Plausible fictional URL (e.g., blog.google, developers.google.com, io.google/2025/sessions/) related to the announcement.
      "learnMoreLink": "string | null", // Optional plausible fictional URL or null
      "learnMoreText": "string | null", // Optional text for learn more link or null. Ensure quotes are escaped.
      "status": "Available" | "Waitlist" | "Preview" | "Beta", // Status of the announcement
      "statusColor": "string", // Tailwind CSS classes for status badge
      "announcementTimestamp": "string" // ISO 8601 UTC timestamp, sequential for announcements.
    }

    Field specific requirements:
    - "id": A unique slug-like string based on the title.
    - "title": The headline of the announcement, inspired by ${targetUrl} or general I/O themes.
    - "category": A relevant category, potentially derived from ${targetUrl}.
    - "summary": A concise and engaging 1-2 sentence summary.
    - "imageUrl": Use "https://picsum.photos/seed/UNIQUE_KEYWORD/600/400", replacing UNIQUE_KEYWORD with a relevant term from the title.
    - "actionText": A clear call to action.
    - "actionLink": Generate a realistic fictional URL for a blog, developer doc, or I/O session page related to the announcement.
    - "learnMoreLink": Optional. If present, a realistic fictional URL.
    - "learnMoreText": Optional. If present, text like "Developer Guide", "API Reference".
    - "status": One of "Available", "Waitlist", "Preview", "Beta".
    - "statusColor": Corresponding Tailwind CSS classes:
        "Available": "bg-green-100 text-green-800", "Waitlist": "bg-purple-100 text-purple-800",
        "Preview": "bg-yellow-100 text-yellow-800", "Beta": "bg-sky-100 text-sky-800"
    - "announcementTimestamp": An ISO 8601 formatted string (UTC). Generate timestamps sequentially reflecting the event flow:
        Keynote (May 19th, 2025, 16:00-18:00 UTC): e.g., "2025-05-19T16:00:00Z", "2025-05-19T16:20:00Z".
        Post-keynote Day 1 (May 19th, 2025, after 18:00 UTC): e.g., "2025-05-19T18:30:00Z".
        Day 2 (May 20th, 2025, e.g., 17:00-20:00 UTC): e.g., "2025-05-20T17:00:00Z".

    Example of a single item:
    {
      "id": "project-greenlight-io25",
      "title": "Project Greenlight: Sustainable AI for a Better Future",
      "category": "Sustainable Tech",
      "summary": "Discover Project Greenlight, leveraging AI to optimize energy consumption in data centers and promote sustainable development. Inspired by initiatives potentially found on ${targetUrl}.",
      "imageUrl": "https://picsum.photos/seed/greenlightAI/600/400",
      "actionText": "Learn About Sustainability",
      "actionLink": "https://blog.google/technology/sustainability/project-greenlight-io25/",
      "learnMoreLink": "https://sustainability.google/reports/project-greenlight/",
      "learnMoreText": "Read Impact Report",
      "status": "Preview",
      "statusColor": "bg-yellow-100 text-yellow-800",
      "announcementTimestamp": "2025-05-19T16:15:00Z"
    }

    Generate 3-5 such announcements. Ensure the entire response is ONLY the JSON array, without any surrounding text, comments, or markdown formatting outside of the JSON array itself.
  `;

  let jsonStrToParse = "";
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}], // Enable Google Search grounding
        // responseMimeType: "application/json", // Must be removed when using googleSearch tool
      }
    });

    console.log("Raw response.text from Gemini API:", response.text);
    console.log("Grounding Metadata from Gemini API:", response.candidates?.[0]?.groundingMetadata);

    jsonStrToParse = response.text.trim();
    
    // Regex to find a JSON block within ```json ... ``` or ``` ... ```
    const fenceRegex = /```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/;
    const match = jsonStrToParse.match(fenceRegex);
    if (match && match[1]) {
      jsonStrToParse = match[1].trim();
    }
    // If no fence is found, jsonStrToParse remains response.text.trim(),
    // and we'll try to parse it directly. This handles cases where
    // the API might return raw JSON without fences.

    // Basic check if it might be an error message instead of JSON
    if (jsonStrToParse.startsWith("<") || (!jsonStrToParse.startsWith("{") && !jsonStrToParse.startsWith("["))) {
      const lowerCaseContent = jsonStrToParse.toLowerCase();
      if (lowerCaseContent.includes("error") || lowerCaseContent.includes("cannot") || lowerCaseContent.includes("unable")) {
        console.error("Gemini API might have returned a non-JSON error string:", jsonStrToParse);
        throw new Error(`Gemini API returned a non-JSON error like response: ${jsonStrToParse.substring(0, 100)}...`);
      }
    }
    
    const parsedData = JSON.parse(jsonStrToParse);

    if (Array.isArray(parsedData)) {
      return parsedData.map((item: any, index: number) => ({
        id: item.id || generateUniqueId(item.title || `item-${index}`),
        title: item.title || "Untitled Announcement",
        category: item.category || "General",
        summary: item.summary || "No summary available.",
        imageUrl: item.imageUrl || `https://picsum.photos/seed/default${index}/600/400`,
        actionText: item.actionText || "Learn More",
        actionLink: item.actionLink || "#",
        learnMoreLink: item.learnMoreLink,
        learnMoreText: item.learnMoreText,
        status: item.status || "Available",
        statusColor: item.statusColor || "bg-slate-100 text-slate-800",
        announcementTimestamp: item.announcementTimestamp,
      })).filter(item => item.title && item.summary) as Headline[];
    } else {
      console.error("Parsed data is not an array. Received:", parsedData);
      throw new Error("Gemini API returned data that is not a valid JSON array.");
    }

  } catch (error) {
    console.error("Error fetching or processing headlines from Gemini API:", error);
    if (error instanceof SyntaxError) {
      // Log the string that caused the syntax error for easier debugging.
      console.error("Problematic JSON string that failed to parse:", jsonStrToParse);
      throw new Error(`Failed to parse JSON response from Gemini API: ${error.message}. Review the logged 'Problematic JSON string' in the console.`);
    }
    // Re-throw other errors to be caught by the caller.
    throw error;
  }
}
