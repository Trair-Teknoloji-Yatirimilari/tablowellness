import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/data/site";

const BASE = SITE.url;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { SERVICES } = await import("@/data/services");
        const urls = [
          { loc: `${BASE}/`, priority: "1.0" },
          { loc: `${BASE}/hizmetler`, priority: "0.9" },
          ...SERVICES.map((sv) => ({ loc: `${BASE}/hizmetler/${sv.slug}`, priority: "0.9" })),
          { loc: `${BASE}/kvkk`, priority: "0.3" },
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((u) => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`)
          .join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
