import { IncomingMessage, ServerResponse } from 'http'
import { Account, Handler, TokenGenerator } from './Model'
import { HTTP_CODES, HTTP_METHODS } from '../Shared/Model'

// @TODO Should use a base class to get request and response and extend from it.
export class LoginHandler implements Handler {
  private req: IncomingMessage
  private res: ServerResponse
  private tokenGenerator: TokenGenerator

  public constructor(req: IncomingMessage, res: ServerResponse, tokenGenerator: TokenGenerator) {
    this.req = req
    this.res = res
    this.tokenGenerator = tokenGenerator
  }

  public async handleRequest(): Promise<void> {
    switch (this.req.method) {
      case HTTP_METHODS.POST:
        await this.handlePost()
        break
      default:
        await this.handleNotFound()
        break
    }
  }

  private async handlePost(): Promise<void> {
    try {
      const body = await this.getRequestBody()
      const sessionToken = await this.tokenGenerator.generateToken(body)
      if (sessionToken) {
        this.res.statusCode = HTTP_CODES.CREATED
        this.res.writeHead(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' })
        this.res.write(JSON.stringify(sessionToken))
      } else {
        this.handleNotFound()
      }
    } catch (e) {
      // @ts-ignore
      this.res.write('error: ' + e.message)
    }
  }

  private async handleNotFound(): Promise<void> {
    this.res.statusCode = HTTP_CODES.NOT_FOUND
    this.res.write('Not found')
  }

  private async getRequestBody(): Promise<Account> {
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
}
