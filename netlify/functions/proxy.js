import { DataStream } from 'scramjet';
import fetch from 'node-fetch';

export async function handler(event, context) {
  const targetUrl = event.queryStringParameters?.url;

  if (!targetUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'url' query parameter" }),
    };
  }

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Error fetching URL: ${response.statusText}`,
      };
    }

    // Stream and transform response with Scramjet
    const stream = new DataStream(response.body)
      .map(chunk => chunk.toString())
      .map(text => text.toUpperCase()); // Example transformation

    let result = '';
    await stream.forEach(chunk => result += chunk);

    return {
      statusCode: 200,
      body: result,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Internal server error: ${err.message}`,
    };
  }
}
