import { Helmet } from "react-helmet-async";
import { data } from "../data";

export function SEO() {
  const title = `${data.name} | ${data.roles.join(" • ")}`;
  const description = data.about.intro;
  const url = window.location.href;
  const image = "https://meril-parmar-portfolio.vercel.app/favicon.png";

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": data.name,
    "jobTitle": data.roles[0],
    "url": "https://meril-parmar-portfolio.vercel.app/",
    "sameAs": [
      "https://github.com/MERIL2026",
      "https://www.linkedin.com/in/meril-parmar-940366363/",
      "https://www.instagram.com/meril_parmar_/",
      "https://about.me/merilparmar"
    ],
    "email": "merilpu37@gmail.com",
    "description": data.about.intro,
    "worksFor": {
      "@type": "Organization",
      "name": "Pixel Forge"
    },
    "knowsAbout": [
      ...data.skills.programming,
      ...data.skills.frontend,
      ...data.skills.backend,
      ...data.skills.ai,
      ...data.skills.iot,
      ...data.skills.tools
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={`${data.name} Portfolio`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content="@MerilParmar" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
    </Helmet>
  );
}
