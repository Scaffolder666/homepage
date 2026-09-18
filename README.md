# Shuo Feng — personal academic website

Source for `https://www.shuofeng.org/`, a static HTML/CSS website hosted on Vercel from the `main` branch of this repository.

## Pages and files

- `index.html`: About, News, research/project list, topic filters and Contact. Project titles and images link to the relevant lab or project website where available.
- `cv.html`: HTML academic CV and browser Print / Save PDF control.
- `cameleon.html`: CAMeleon research overview, paper, interactive demo and click-to-load video.
- `tom.html`: assistive technology search research overview and demo.
- `news.html`: archive of older announcements, reachable through the homepage News section.
- `styles.css`: shared academic-style layout; the homepage also includes compact filter styling.
- `robots.txt`, `sitemap.xml`: search engine discovery files.
- `vercel.json`: legacy URL redirects.

## Publication and disclosure checklist

- Check publication author names, ordering, paper titles, venues and links against publishers' official records. The published OriStitch link uses DOI `10.1145/3745778.3766666`.
- Unpublished projects on the public homepage and CV are intentionally limited to names and a generic status. Do **not** add project descriptions, methods, figures, screenshots, manuscript titles, target venues or detailed keywords until public disclosure is approved.
- Deleting text or images from the latest branch does not delete previously published Git commit history or external caches. Treat the repository and its history as publicly accessible.
- Confirm linked demos and external resources manually in a browser if automated checks are blocked by authentication, JavaScript, publisher rate limits or hosting protections.
- The TOM research page contains a text-only figure placeholder; replace it only when an approved figure is provided.

## Deployment and domain

The site uses plain HTML/CSS; there is no build command. Vercel is linked to this repository. `www.shuofeng.org` is the preferred hostname and the apex redirects to it. The domain registration and DNS are maintained separately in Wix. Preserve verification, email MX/TXT and other unrelated DNS records.

A GitHub commit is not proof that production has deployed successfully. Confirm the latest Vercel production deployment and then check the live website in a browser.

## Maintenance

When changing the research filters, keep each filter's `data-filter` aligned with project `data-topics`; `All` must show every project and counts must reflect visible items. When adding a public page, give it an internal link, a distinct page title and description, a canonical URL, and an entry in `sitemap.xml` if indexing is intended. Keep unpublished assets out of the public repository until disclosure is approved.
