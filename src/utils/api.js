export async function readApiResponse(response, fallbackMessage) {
  const body = await response.text();

  if (response.status === 502) {
    throw new Error(
      `${fallbackMessage} The API server could not be reached. Start it from the server directory with "npm run dev" (port 3000).`,
    );
  }

  if (!body.trim()) {
    throw new Error(
      `${fallbackMessage} The server returned an empty response (HTTP ${response.status}).`,
    );
  }

  try {
    const result = JSON.parse(body);

    if (!response.ok) {
      throw new Error(
        result.error || `${fallbackMessage} (HTTP ${response.status}).`,
      );
    }

    return result;
  } catch {
    throw new Error(
      `${fallbackMessage} The server returned an invalid response (HTTP ${response.status}).`,
    );
  }
}
