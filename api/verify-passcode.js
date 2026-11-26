export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const { passcode } = req.body || {};
  const masterPasscode = process.env.ADMIN_PASSCODE || 'KW@2026#Admin';

  if (!passcode) {
    return res.status(400).json({ ok: false, error: 'Passcode is required.' });
  }

  const cleanInput = String(passcode).trim();
  const cleanMaster = String(masterPasscode).trim();

  if (cleanInput === cleanMaster) {
    return res.status(200).json({
      ok: true,
      message: 'Unlocked successfully'
    });
  } else {
    return res.status(401).json({
      ok: false,
      error: 'Incorrect passcode. Check the master passcode and try again.'
    });
  }
}
