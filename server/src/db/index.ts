import { createClient } from '@supabase/supabase-js';

/**
 * Create Supabase client for server usage.
 * Crucial options for server:
 *   - persistSession: false -> don't use browser-like storage
 *   - autoRefreshToken: false -> avoid automatic background refresh
 */
export const initSupabase = () => createClient(
  process.env.DB_URL!,
  process.env.DB_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// const { createServerClient, parseCookieHeader, serializeCookieHeader } = require('@supabase/ssr')
// exports.createClient = (context) => {
//   return createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
//     cookies: {
//       getAll() {
//         return parseCookieHeader(context.req.headers.cookie ?? '')
//       },
//       setAll(cookiesToSet) {
//         cookiesToSet.forEach(({ name, value, options }) =>
//           context.res.appendHeader('Set-Cookie', serializeCookieHeader(name, value, options))
//         )
//       },
//     },
//   })
// }


// const { createClient } = require("./lib/supabase")
// ...
// app.get("/auth/confirm", async function (req, res) {
//   const token_hash = req.query.token_hash
//   const type = req.query.type
//   const next = req.query.next ?? "/"
//   if (token_hash && type) {
//     const supabase = createClient({ req, res }) // <<<<<<----------------
//     const { error } = await supabase.auth.verifyOtp({
//       type,
//       token_hash,
//     })
//     if (!error) {
//       res.redirect(303, `/${next.slice(1)}`)
//     }
//   }
//   // return the user to an error page with some instructions
//   res.redirect(303, '/auth/auth-code-error')
// })
