/**
 * OpenSearch descriptor, served at /docs/opensearch.xml.
 *
 * The previous site emitted this file from the Docusaurus build. Templates now
 * point at the canonical apex surface; every URL resolves through the
 * niftyleague.com /docs proxy.
 */
import type { APIRoute } from 'astro'

const DESCRIPTOR = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"
                       xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>Nifty League Docs</ShortName>
  <Description>Search Nifty League Docs</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="16" height="16" type="image/x-icon">https://niftyleague.com/docs/favicon/nl_purple/favicon.ico</Image>
  <Url type="text/html" method="get" template="https://niftyleague.com/docs/search?q={searchTerms}"/>
  <Url type="application/opensearchdescription+xml" rel="self" template="https://niftyleague.com/docs/opensearch.xml" />
  <moz:SearchForm>https://niftyleague.com/docs/</moz:SearchForm>
</OpenSearchDescription>
`

export const GET: APIRoute = () =>
  new Response(DESCRIPTOR, {
    headers: { 'Content-Type': 'application/opensearchdescription+xml; charset=utf-8' },
  })
