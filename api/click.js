const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.STORAGE_SUPABASE_URL,
  process.env.STORAGE_SUPABASE_ANON_KEY
);

const lastClick = new Map();

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0] ?? req.socket.remoteAddress;
  const now = Date.now();
  if (lastClick.has(ip) && now - lastClick.get(ip) < 1000) {
    return res.status(429).json({ error: 'Too fast' });
  }
  lastClick.set(ip, now);

  const { data: current, error: readError } = await supabase
    .from('counter')
    .select('count')
    .eq('id', 1)
    .single();
  if (readError) return res.status(500).json({ error: readError.message });

  const newCount = current.count + 1;
  const { error: writeError } = await supabase
    .from('counter')
    .update({ count: newCount })
    .eq('id', 1);
  if (writeError) return res.status(500).json({ error: writeError.message });

  res.status(200).json({ count: newCount });
};
