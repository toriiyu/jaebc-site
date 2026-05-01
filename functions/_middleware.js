// Cloudflare Pages Functions middleware
// Password-gates the entire site. Password: "jaebc"
// Sets a 30-day HttpOnly cookie on success.

const PASSWORD = "jaebc";
const COOKIE_NAME = "jaebc_auth";
// The cookie value is a constant token; only servers that know PASSWORD can mint it.
// Rotating PASSWORD will invalidate this token automatically because we use it as part of the value.
const COOKIE_VALUE = "ok-" + PASSWORD;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const onRequest = async ({ request, next }) => {
  const url = new URL(request.url);

  // Allow OPTIONS preflight to pass through (rare for static, but safe)
  if (request.method === "OPTIONS") return next();

  const cookieHeader = request.headers.get("Cookie") || "";
  const isAuthed = cookieHeader
    .split(";")
    .map(s => s.trim())
    .some(c => c === `${COOKIE_NAME}=${COOKIE_VALUE}`);

  // Login submission
  if (url.pathname === "/__auth" && request.method === "POST") {
    const form = await request.formData();
    const password = (form.get("password") || "").toString();
    const redirect = (form.get("redirect") || "/").toString();
    const safeRedirect = redirect.startsWith("/") ? redirect : "/";
    if (password === PASSWORD) {
      return new Response(null, {
        status: 303,
        headers: {
          "Location": safeRedirect,
          "Set-Cookie": `${COOKIE_NAME}=${COOKIE_VALUE}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
          "Cache-Control": "no-store"
        }
      });
    }
    return new Response(loginHTML({ error: true, redirect: safeRedirect }), {
      status: 401,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }

  if (!isAuthed) {
    const redirect = url.pathname + url.search;
    return new Response(loginHTML({ error: false, redirect }), {
      status: 401,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }

  return next();
};

function loginHTML({ error, redirect }) {
  // Escape redirect for HTML attribute context
  const safeRedirect = (redirect || "/")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const errorBox = error
    ? `<div class="err"><span>合言葉が違います / Wrong passphrase</span></div>`
    : "";

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex,nofollow">
<title>JAEBC | 合言葉 / Passphrase</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Noto+Sans+JP:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  :root{
    --green:#1FA24A;--yellow:#F4C52E;--red:#E53935;
    --ink:#111;--muted:#666;--line:#E8E8E8;--cream:#FFFCF5;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{
    font-family:'Inter','Noto Sans JP',-apple-system,BlinkMacSystemFont,sans-serif;
    background:
      radial-gradient(circle at 85% 15%,rgba(229,57,53,.13),transparent 42%),
      radial-gradient(circle at 5% 85%,rgba(31,162,74,.13),transparent 45%),
      radial-gradient(circle at 55% 60%,rgba(244,197,46,.13),transparent 45%),
      var(--cream);
    color:var(--ink);min-height:100vh;
    display:flex;align-items:center;justify-content:center;padding:24px;
    font-feature-settings:"palt";-webkit-font-smoothing:antialiased;
  }
  .top-bar{position:fixed;top:0;left:0;right:0;display:flex;height:6px}
  .top-bar span{flex:1}
  .top-bar .g{background:var(--green)}
  .top-bar .y{background:var(--yellow)}
  .top-bar .r{background:var(--red)}
  .gate{
    width:100%;max-width:440px;background:#fff;border:2px solid var(--ink);
    border-radius:24px;padding:48px 40px;
    box-shadow:0 30px 60px rgba(0,0,0,.12);position:relative;overflow:hidden;
  }
  .gate::before{
    content:"";position:absolute;top:0;left:0;right:0;height:8px;
    background:linear-gradient(90deg,var(--green),var(--yellow),var(--red));
  }
  .lock{
    width:64px;height:64px;border-radius:50%;background:var(--ink);
    display:flex;align-items:center;justify-content:center;
    font-size:28px;color:var(--yellow);margin:0 auto 24px;
    box-shadow:0 10px 24px rgba(0,0,0,.18);
  }
  .brand{
    text-align:center;margin-bottom:8px;
    font-size:11px;font-weight:900;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);
  }
  h1{
    text-align:center;font-size:28px;font-weight:900;letter-spacing:-.01em;line-height:1.3;
    margin-bottom:6px;
  }
  .sub{
    text-align:center;font-size:13px;color:var(--muted);margin-bottom:28px;line-height:1.7;
  }
  .err{
    background:#FDE8E7;color:var(--red);border:1px solid var(--red);
    border-radius:12px;padding:12px 14px;font-size:13px;font-weight:700;
    margin-bottom:16px;text-align:center;
  }
  form{display:flex;flex-direction:column;gap:14px}
  input[type="password"]{
    font-family:inherit;font-size:16px;font-weight:600;
    width:100%;padding:16px 18px;border:2px solid var(--line);
    border-radius:14px;background:#fff;color:var(--ink);
    transition:border-color .2s ease,box-shadow .2s ease;
  }
  input[type="password"]:focus{
    outline:0;border-color:var(--ink);
    box-shadow:0 0 0 4px rgba(244,197,46,.35);
  }
  button{
    font-family:inherit;font-size:14px;font-weight:800;letter-spacing:.05em;
    background:var(--ink);color:var(--yellow);
    padding:16px 24px;border:0;border-radius:999px;cursor:pointer;
    transition:transform .15s ease,box-shadow .15s ease;
    box-shadow:0 6px 16px rgba(0,0,0,.18);
    display:inline-flex;align-items:center;justify-content:center;gap:10px;
  }
  button:hover{transform:translateY(-1px);box-shadow:0 10px 24px rgba(0,0,0,.25)}
  .foot{
    margin-top:24px;text-align:center;font-size:11px;color:var(--muted);
    letter-spacing:.06em;line-height:1.7;
  }
  .foot strong{color:var(--ink);font-weight:700}
  .flag{
    display:inline-flex;gap:3px;margin-left:6px;vertical-align:middle;
  }
  .flag span{width:6px;height:6px;border-radius:50%}
  .flag .g{background:var(--green)}
  .flag .y{background:var(--yellow)}
  .flag .r{background:var(--red)}
</style>
</head>
<body>
<div class="top-bar"><span class="g"></span><span class="y"></span><span class="r"></span></div>
<main class="gate">
  <div class="lock">🔒</div>
  <div class="brand">JAEBC<span class="flag"><span class="g"></span><span class="y"></span><span class="r"></span></span></div>
  <h1>合言葉を入力してください</h1>
  <p class="sub">日本アフリカエンタメ事業協議会のサイトはご招待制です。<br>This site is invitation-only.</p>
  ${errorBox}
  <form method="POST" action="/__auth" autocomplete="off">
    <input type="hidden" name="redirect" value="${safeRedirect}">
    <input type="password" name="password" placeholder="合言葉 / passphrase" autofocus required>
    <button type="submit">
      <span>サイトに入る / Enter</span>
      <span aria-hidden="true">→</span>
    </button>
  </form>
  <div class="foot">
    合言葉が分からない方は <strong>info@jaebc.com</strong> までご連絡ください。<br>
    For passphrase, please contact <strong>info@jaebc.com</strong>.
  </div>
</main>
</body>
</html>`;
}
