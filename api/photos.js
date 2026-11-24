// This file runs on the SERVER (a Vercel serverless function), never in the browser.
// It asks YOUR Cloudinary account for your latest images, using your API key and secret.
// The secret never leaves the server: the browser only receives the image links.

export default async function handler(req, res) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({
      error:
        'Cloudinary keys are missing. On your laptop: fill CLOUDINARY_* in .env. On Vercel: add them in Settings → Environment Variables, then redeploy.',
    });
  }

  // Cloudinary Admin API: list the 10 most recent images of your account.
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?max_results=10`;
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  try {
    const response = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
    const data = await response.json();

    if (!response.ok) {
      // 401 = wrong key or secret, 404 = wrong cloud name.
      return res.status(response.status).json({ error: data?.error?.message || 'Cloudinary returned an error.' });
    }

    // Ask Cloudinary for a resized, optimised version of each image (c_fill, f_auto, q_auto).
    const photos = data.resources.map((image) => ({
      url: image.secure_url.replace('/upload/', '/upload/c_fill,g_auto,w_800,h_500,f_auto,q_auto/'),
      alt: image.public_id.split('/').pop().replace(/[-_]/g, ' '),
    }));

    return res.status(200).json({ photos });
  } catch {
    return res.status(502).json({ error: 'Could not reach Cloudinary. Check your internet connection.' });
  }
}
