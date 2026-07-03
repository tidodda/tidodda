const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.STORAGE_SUPABASE_URL,
  process.env.STORAGE_SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  const { data, error } = await supabase
    .from('counter')
    .select('count')
    .eq('id', 1)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ count: data.count });
};