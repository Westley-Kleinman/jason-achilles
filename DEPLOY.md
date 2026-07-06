# Deploy to SiteGround (automatic)

Every push to `main` builds the site and uploads it to SiteGround via FTP. You can also run the deploy manually from the **Actions** tab → **Deploy to SiteGround** → **Run workflow**.

## One-time setup: add 3 GitHub secrets

1. Open your repo on GitHub.
2. Go to **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret** and add each row below.

| Secret name | Value |
|-------------|-------|
| `SITEGROUND_FTP_HOST` | **Exact FTP hostname** from SiteGround (see below). Copy/paste only—no `ftp://` prefix. |
| `SITEGROUND_FTP_USER` | `vimaldev@jasonachilles.com` |
| `SITEGROUND_FTP_PASSWORD` | Your SiteGround FTP password (from Site Tools → Site → FTP Accounts). **Never put this in the repo.** |

Upload folder (`public_html/`) is set in the workflow file.

### Where to find the FTP hostname

1. Log in to SiteGround and open **Site Tools** for this site.
2. Go to **Site** → **FTP Accounts**.
3. On the right, find the box labeled **FTP hostname** (or similar).
4. Copy that value **exactly** into the `SITEGROUND_FTP_HOST` secret.

SiteGround may show something like `ftp.jasonachilles.com` or a server name such as `giow1234.siteground.us`. Use whatever SiteGround displays—not a guess.

### If GitHub deploy fails with `getaddrinfo ENOTFOUND`

GitHub Actions resolves DNS on the public internet. If your secret hostname does not resolve publicly, the deploy will fail even if FTP works on your home network.

### Quick fix: add `ftp` DNS record in SiteGround

If SiteGround shows `ftp.jasonachilles.com` but GitHub says `ENOTFOUND`:

1. **Site Tools** → **Domain** → **DNS Zone Editor** (for `jasonachilles.com`).
2. **Add new record** → type **A**.
3. **Name:** `ftp` (SiteGround may show this as `ftp.jasonachilles.com`).
4. **Points to / Value:** same IP as your main `@` A record (currently `35.212.2.98` for `jasonachilles.com`).
5. Save. DNS can take 5–30 minutes to propagate.
6. Set GitHub secret `SITEGROUND_FTP_HOST` to `ftp.jasonachilles.com`.
7. **Actions** → **Re-run all jobs**.

**Alternate:** If SiteGround lists a server hostname like `giow1234.siteground.us` on the FTP page, use that as `SITEGROUND_FTP_HOST` instead—no DNS change needed if it already resolves.


## Troubleshooting a failed deploy

1. Confirm the FTP password works in SiteGround **Site Tools → FTP Accounts** (reset if unsure).
2. Username must be the **full** address: `vimaldev@jasonachilles.com`.
3. Confirm `SITEGROUND_FTP_HOST` matches SiteGround’s FTP hostname exactly.
4. In GitHub → **Actions** → failed run → open **Deploy to SiteGround** step for the error message.
5. Click **Re-run all jobs** after fixing secrets or DNS.

## After deploy succeeds

The live site is at [https://jasonachilles.com](https://jasonachilles.com). Future updates: commit and push to `main`.

The deploy workflow verifies that `/` returns the React build (`Live Terminal` title) and that the linked CSS/JS assets respond with HTTP 200.

### If the site looks unstyled (especially on mobile)

This usually means the domain root is still serving **WordPress** (`index.php`) instead of the Vite `index.html`. SiteGround’s nginx layer prefers `index.php` before Apache applies `.htaccess`, so **renaming `index.php` is required** — `.htaccess` alone is not enough.

The deploy workflow renames `public_html/index.php` → `index.php.wordpress-bak` automatically after each FTP upload. If `/` still shows the old WordPress page:

1. Push the latest `main` and run **Deploy to SiteGround** (or **Re-run all jobs** on the latest failed run). Each deploy uploads `public/index.php`, a tiny redirect stub that replaces the WordPress bootstrap so `/` → `/index.html`.
2. If the rename step fails, do it manually (steps below).
3. Hard-refresh on your phone (or open a private tab) and check:
   - Page title is **Jason Achilles // Live Terminal** (not the old WordPress title).
   - Terminal styling, fonts, and nav colors load.
   - DevTools → Network shows `/assets/index-*.css` and `/assets/index-*.js` with status 200.

#### Manual fix in SiteGround File Manager

1. Log in to SiteGround → **Site Tools** for `jasonachilles.com`.
2. Open **Site** → **File Manager**.
3. Go to `public_html/`.
4. Find `index.php` (WordPress bootstrap — **do not delete**; rename only).
5. Right-click → **Rename** → `index.php.wordpress-bak`.
6. Confirm `index.html` and `.htaccess` from the latest deploy are present in `public_html/`.
7. Optional: **Speed** → **Caching** → **Flush Cache** (Dynamic/NGINX).
8. Visit `https://jasonachilles.com/` in a private tab — you should see the React site.

To restore WordPress later, rename `index.php.wordpress-bak` back to `index.php`.
