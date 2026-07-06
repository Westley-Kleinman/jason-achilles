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
