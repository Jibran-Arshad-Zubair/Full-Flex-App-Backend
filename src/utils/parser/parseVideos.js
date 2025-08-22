export function parseVideosFromBody(body) {
  if (!body || !body.videos) return [];
  // Case 1: videos passed as JSON string
  try {
    return JSON.parse(body.videos);
  } catch {
    // Case 2: videos passed as form-data fields
    const videos = [];
    Object.keys(body).forEach((key) => {
      const match = key.match(/^videos\[(\d+)\]\[(title|url)\]$/);
      if (match) {
        const index = parseInt(match[1], 10);
        const field = match[2];
        videos[index] = videos[index] || {};
        videos[index][field] = body[key];
      }
    });
    return videos;
  }
}
