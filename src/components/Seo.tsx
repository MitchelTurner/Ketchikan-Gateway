import { useEffect } from 'react'
import type { PageMeta } from '../lib/seo/meta'
import { absoluteUrl, SITE_NAME } from '../lib/seo/site'

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string,
) {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    document.head.appendChild(el)
  }
  el.href = href
}

export function Seo({
  meta,
  jsonLd,
}: {
  meta: PageMeta
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}) {
  useEffect(() => {
    document.title = meta.title
    upsertMeta('name', 'description', meta.description)
    upsertMeta('name', 'robots', meta.robots ?? 'index, follow')
    const url = absoluteUrl(meta.canonicalPath)
    upsertLink('canonical', url)
    upsertMeta('property', 'og:type', meta.ogType ?? 'website')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', meta.title)
    upsertMeta('property', 'og:description', meta.description)
    upsertMeta('property', 'og:url', url)
    const imageUrl = meta.image
      ? meta.image.startsWith('http')
        ? meta.image
        : absoluteUrl(meta.image)
      : undefined
    if (imageUrl) {
      upsertMeta('property', 'og:image', imageUrl)
      upsertMeta('name', 'twitter:card', 'summary_large_image')
      upsertMeta('name', 'twitter:image', imageUrl)
    } else {
      upsertMeta('name', 'twitter:card', 'summary')
    }
    upsertMeta('name', 'twitter:title', meta.title)
    upsertMeta('name', 'twitter:description', meta.description)
    if (meta.dateModified) {
      upsertMeta('name', 'dateModified', meta.dateModified)
    }

    const scriptId = 'ktn-jsonld'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script')
        script.id = scriptId
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      const payload = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
      script.textContent = JSON.stringify(
        payload.length === 1 ? payload[0] : payload,
      )
    } else if (script) {
      script.remove()
    }
  }, [meta, jsonLd])

  return null
}
