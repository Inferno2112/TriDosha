import { Readable } from 'node:stream'

/**
 * Vite dev-server plugin that mounts API route handlers written in the Web
 * Fetch API style (the same style Vercel serverless/edge functions use), so
 * `npm run dev` serves `/api/*` without a separate backend process.
 *
 * Each entry maps a URL path to a module path. The module must default-export
 * `async (request: Request) => Response`.
 */
export function apiPlugin(routes) {
  return {
    name: 'tridosha-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]
        const modulePath = url ? routes[url] : undefined
        if (!modulePath) return next()

        try {
          const mod = await server.ssrLoadModule(modulePath)
          const handler = mod.default
          if (typeof handler !== 'function') {
            res.statusCode = 500
            res.end(`Handler at ${modulePath} has no default export`)
            return
          }

          const request = nodeReqToWebRequest(req)
          const response = await handler(request)
          await writeWebResponseToNodeRes(response, res)
        } catch (err) {
          server.config.logger.error(
            `[api-plugin] handler error for ${url}: ${err?.stack || err}`,
          )
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('content-type', 'application/json')
          }
          res.end(JSON.stringify({ error: 'Internal server error' }))
        }
      })
    },
  }
}

function nodeReqToWebRequest(req) {
  const host = req.headers.host || 'localhost'
  const protocol =
    req.socket && 'encrypted' in req.socket && req.socket.encrypted
      ? 'https'
      : 'http'
  const url = `${protocol}://${host}${req.url}`

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v)
    } else {
      headers.set(key, String(value))
    }
  }

  const method = req.method || 'GET'
  const hasBody = method !== 'GET' && method !== 'HEAD'

  return new Request(url, {
    method,
    headers,
    body: hasBody ? Readable.toWeb(req) : undefined,
    // @ts-expect-error - Node's undici Request requires this when a body is a stream.
    duplex: hasBody ? 'half' : undefined,
  })
}

async function writeWebResponseToNodeRes(response, res) {
  res.statusCode = response.status
  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })

  if (!response.body) {
    res.end()
    return
  }

  const nodeStream = Readable.fromWeb(response.body)
  nodeStream.on('error', () => res.end())
  nodeStream.pipe(res)
}
