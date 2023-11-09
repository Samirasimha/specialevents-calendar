const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.NODE_APP_SUPABASE_URL;
const supabaseKey = process.env.NODE_APP_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
