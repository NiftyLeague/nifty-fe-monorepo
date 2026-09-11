import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        /**
         * Suppress Starlight's generated page heading so a document that carries
         * its own leading `<h1>` keeps that heading as the visible title, while
         * `title` still drives the `<title>`, sidebar and pagination labels.
         *
         * This mirrors Docusaurus, which used the frontmatter title for
         * navigation but rendered a body H1 as the article heading when present.
         */
        hideTitle: z.boolean().optional(),
      }),
    }),
  }),
}
