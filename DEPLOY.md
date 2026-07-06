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

- **`ftp.jasonachilles.com` does not resolve in public DNS today** (only `jasonachilles.com` resolves). If SiteGround shows `ftp.jasonachilles.com`, either add a public DNS record for that name in SiteGround **Site Tools → DNS Zone Editor** (or your DNS provider), **or** use the **server hostname** SiteGround gives you (often on the FTP Accounts page or **Dashboard** / account info), e.g. `giowXXXX.siteground.us`.
- After updating the secret, re-run the failed workflow: **Actions** → failed run → **Re-run all jobs**.

Contact SiteGround support if you cannot find a hostname that works from outside your network.

## Troubleshooting a failed deploy

1. Confirm the FTP password works in SiteGround **Site Tools → FTP Accounts** (reset if unsure).
2. Username must be the **full** address: `vimaldev@jasonachilles.com`.
3. Confirm `SITEGROUND_FTP_HOST` matches SiteGround’s FTP hostname exactly.
4. In GitHub → **Actions** → failed run → open **Deploy to SiteGround** step for the error message.
5. Click **Re-run all jobs** after fixing secrets or DNS.

## After deploy succeeds

The live site is at [https://jasonachilles.com](https://jasonachilles.com). Future updates: commit and push to `main`.
