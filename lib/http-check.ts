import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'
import http from 'node:http'
import https from 'node:https'

export function isPublicAddress(address: string): boolean {
  const ip = address.replace(/^\[|\]$/g, '').toLowerCase()
  if (isIP(ip) === 4) {
    const [a, b, c] = ip.split('.').map(Number)
    return !(
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && (b === 168 || b === 0 || (b === 88 && c === 99))) ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 198 && (b === 18 || b === 19 || b === 51)) ||
      (a === 203 && b === 0 && c === 113)
    )
  }
  // Only globally routable IPv6; mapped IPv4, loopback, local, multicast,
  // documentation and transition prefixes are deliberately excluded.
  if (isIP(ip) === 6)
    return (
      /^[23][0-9a-f]{3}:/.test(ip) && !/^2001:(db8|0|10|20):|^2002:/.test(ip)
    )
  return false
}
export function normalizePublicURL(value: string): URL {
  const text = value.trim()
  const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`)
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.port ||
    (!url.hostname.includes('.') && !isIP(url.hostname.replace(/^\[|\]$/g, '')))
  )
    throw new Error(
      'Enter a public HTTP or HTTPS website without credentials or a custom port.'
    )
  url.hash = ''
  return url
}
export async function checkWebsite(value: string) {
  const start = Date.now()
  const deadline = start + 10000
  let url = normalizePublicURL(value)
  for (let redirect = 0; redirect <= 5; redirect++) {
    const remaining = deadline - Date.now()
    if (remaining <= 0) throw new Error('Website check timed out.')
    const host = url.hostname.replace(/^\[|\]$/g, '')
    const addresses = isIP(host)
      ? [{ address: host, family: isIP(host) }]
      : await Promise.race([
          lookup(host, { all: true }),
          new Promise<never>((_, reject) => {
            const timer = setTimeout(
              () => reject(new Error('DNS lookup timed out.')),
              remaining
            )
            timer.unref()
          }),
        ])
    if (
      !addresses.length ||
      addresses.some((item) => !isPublicAddress(item.address))
    )
      throw new Error(
        'Private, local, or reserved addresses cannot be checked.'
      )
    const pinned = addresses[0]
    const result = await new Promise<{ status: number; location?: string }>(
      (resolve, reject) => {
        const request = (url.protocol === 'https:' ? https : http).request(
          url,
          {
            method: 'HEAD',
            family: pinned.family,
            // Pin the validated DNS answer to avoid a second DNS resolution.
            lookup: (_hostname, _options, callback) =>
              callback(null, pinned.address, pinned.family),
            headers: { 'User-Agent': 'BuildnScale-Uptime/1.0' },
          },
          (response) => {
            const status = response.statusCode ?? 0
            const location = response.headers.location
            response.resume()
            resolve({ status, location })
          }
        )
        const timer = setTimeout(
          () => request.destroy(new Error('Website check timed out.')),
          Math.max(1, deadline - Date.now())
        )
        request.on('close', () => clearTimeout(timer))
        request.on('error', reject)
        request.end()
      }
    )
    if ([301, 302, 303, 307, 308].includes(result.status) && result.location) {
      url = normalizePublicURL(new URL(result.location, url).href)
      continue
    }
    return {
      url: url.href,
      isUp: result.status >= 200 && result.status < 400,
      statusCode: result.status,
      responseMs: Date.now() - start,
      region: process.env.VERCEL_REGION ?? 'server',
    }
  }
  throw new Error('Too many redirects.')
}
