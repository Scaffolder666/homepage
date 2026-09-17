# Shuo Feng — personal homepage

A responsive, single-file research homepage for Shuo Feng. The site is plain HTML/CSS, so no build command or framework is required.

## Content

- About: Cornell Tech, HCI, digital fabrication, design tools.
- Research: CAMeleon, Y-AR, OriStitch, linked to the Matter of Tech Lab's project pages.
- Publications: selected published papers with primary source links.
- Contact: Cornell email, GitHub, lab.

Project imagery and portrait currently link to public assets hosted by Matter of Tech Lab; copy these assets into this repository in a follow-up if you'd like the site to be entirely independent from the lab's server. No résumé PDF or unpublished-project claims have been added. Check all copy, photos, and hyperlinks before launching.

## Deploy to Vercel

1. In Vercel, select **Add New → Project** and import `Scaffolder666/homepage`.
2. Select **Other** or let Vercel auto-detect static HTML; leave the build command empty and deploy. The root `index.html` is the entry point.
3. Confirm that the generated `*.vercel.app` preview looks correct first.
4. In **Project → Settings → Domains**, add `shuofeng.org` and `www.shuofeng.org`.
5. Only after Vercel shows its actual required DNS records, replace the legacy Wix A records for the apex domain and the `www` CNAME in Wix's DNS manager. Leave MX/TXT email verification records and unrelated records unchanged. Select one preferred hostname and redirect the other.
6. Confirm HTTPS and both hostname variants work before cancelling an unused Wix website plan. Keep the domain registration/renewal active.

The domain is not transferred merely by editing DNS. Do not change the Wix name servers or delete unrelated records just to point the website to Vercel.

## Editing

Edit `index.html`: content and styles are kept in one file for simplicity. Add a `resume.pdf` and a link only when an approved résumé is available. Unpublished work can be added later with confirmed disclosure and accurate status.
