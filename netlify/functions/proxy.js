import { DataStream } from 'scramjet';
import fetch from 'node-fetch';

export async function handler(event, context) {
  const targetUrl = event.queryStringParameters?.url;

  if (!targetUrl) {
    return {
      statusCode: 400,
      body: "Missing 'url' query parameter"
    };
  }

  try {
    const response = await fetch(targetUrl);
    const text = await response.text();

    // Scramjet can transform the response if needed
    const stream = new DataStream([text]);
    const transformed = await stream.map(chunk => chunk.toUpperCase()).toArray();

    return {
      statusCode: 200,
      body: transformed.join(''),
      headers: { "Content-Type": "text/plain" }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Error fetching the URL: " + err.message
    };
  }
}
