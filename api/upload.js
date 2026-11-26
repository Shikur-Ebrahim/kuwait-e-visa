import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { image } = req.body || {};
  if (!image) {
    return res.status(400).json({ error: 'Missing image payload' });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'ujbsqmo3';
  const apiKey = process.env.CLOUDINARY_API_KEY || '998338667221592';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '4HoFV9yGgxipZQJ6Donceqd7k8g';
  const folder = process.env.CLOUDINARY_FOLDER || 'kuwait';

  const timestamp = Math.floor(Date.now() / 1000);
  const strToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

  const formData = new URLSearchParams();
  formData.append('file', image);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('folder', folder);
  formData.append('signature', signature);

  try {
    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await cloudinaryRes.json();
    if (!cloudinaryRes.ok) {
      console.error('Cloudinary API upload error:', data);
      return res.status(cloudinaryRes.status).json({
        error: (data && data.error && data.error.message) || 'Cloudinary upload failed'
      });
    }

    return res.status(200).json({
      url: data.secure_url || data.url,
      public_id: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height
    });
  } catch (err) {
    console.error('Upload handler exception:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
