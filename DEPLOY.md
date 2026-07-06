# Deploy to SiteGround (automatic)

Every push to `main` builds the site and uploads it to SiteGround via FTP. You can also run the deploy manually from the **Actions** tab → **Deploy to SiteGround** → **Run workflow**.

## One-time setup: add 4 GitHub secrets

1. Open your repo on GitHub.
2. Go to **Settings** → **Secrets and variables** → **Actions**.
3. Click **New repository secret** and add each row below.

| Secret name | Value |
|-------------|-------|
| `SITEGROUND_FTP_HOST` | `ftp.jasonachilles.com` |
| `SITEGROUND_FTP_USER` | `vimaldev@jasonachilles.com` |
| `SITEGROUND_FTP_PASSWORD` | Your SiteGround FTP password (from Site Tools → Site → FTP Accounts). **Never put this in the repo.** |
| `SITEGROUND_FTP_PATH` | `public_html/` |

**Path note:** Use `public_html/` with a trailing slash and **no** leading slash (e.g. not `/public_html`). That is what the FTP deploy action expects on SiteGround.

## After secrets are saved

Push to `main` (or run the workflow manually). The first deploy will fail until all four secrets exist.

When it succeeds, the live site is at [https://jasonachilles.com](https://jasonachilles.com).
