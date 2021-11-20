import { IncomingMessage, ServerResponse } from 'http'
import { HTTP_CODES } from '../Shared/Model'

export abstract class GenericHandler {
  protected req: IncomingMessage
  protected res: ServerResponse

  protected constructor(req: IncomingMessage, res: ServerResponse) {
    this.req = req
    this.res = res
  }

  abstract handleRequest(): Promise<void>

  protected async getRequestBody(): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = ''
      this.req.on('data', (data: string) => {
        body += data
      })
      this.req.on('end', () => {
        try {
          resolve(JSON.parse(body))
        } catch (e) {
          reject(e)
        }
      })
      this.req.on('error', (e) => {
        reject(e)
      })
    })
  }

  protected async writeResponse(statusCode: HTTP_CODES, payload: any | undefined) {
    this.res.statusCode = statusCode
    this.res.writeHead(statusCode, { 'Content-Type': 'application/json' })
    this.res.write(JSON.stringify(payload))
  }

  protected async handleNotFound(): Promise<void> {
    this.res.statusCode = HTTP_CODES.NOT_FOUND
    this.res.write('not found')
  }

  protected async handleBadRequest(message: string): Promise<void> {
    await this.writeResponse(HTTP_CODES.BAD_REQUEST, message)
  }

  protected async handleNotAuthenticated(): Promise<void> {
    await this.writeResponse(HTTP_CODES.NOT_AUTHENTICATED, {message: "Not authenticated"})
  }
}
