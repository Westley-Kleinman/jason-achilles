# Deploy to SiteGround (automatic)

Every push to `main` builds the site and uploads it to SiteGround via FTP. You can also run the deploy manually from the **Actions** tab → **Deploy to SiteGround** → **Run workflow**.

## One-time setup: add 2 GitHub secrets

1. Open your repo on GitHub.
2. Go to **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret** and add each row below.

| Secret name | Value |
|-------------|-------|
| `SITEGROUND_FTP_USER` | `vimaldev@jasonachilles.com` |
| `SITEGROUND_FTP_PASSWORD` | Your SiteGround FTP password (from Site Tools → Site → FTP Accounts). **Never put this in the repo.** |

Host (`ftp.jasonachilles.com`) and folder (`public_html/`) are set in the workflow file so they cannot be mistyped in secrets.

### If you already added the old secrets

You can delete `SITEGROUND_FTP_HOST` and `SITEGROUND_FTP_PATH` — they are no longer used. Keep **user** and **password**.

## Troubleshooting a failed deploy

1. Confirm the FTP password works in SiteGround **Site Tools → FTP Accounts** (reset if unsure).
2. Username must be the **full** address: `vimaldev@jasonachilles.com`
3. In GitHub → **Actions** → failed run → open **Deploy to SiteGround** step for the error message.
4. Click **Re-run all jobs** after fixing the password.

## After deploy succeeds

The live site is at [https://jasonachilles.com](https://jasonachilles.com). Future updates: commit and push to `main`.
