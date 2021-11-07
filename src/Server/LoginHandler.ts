import { IncomingMessage, ServerResponse } from 'http'
import { Account, Handler, TokenGenerator } from './Model'
import { HTTP_CODES, HTTP_METHODS } from '../Shared/Model'
import { GenericHandler } from './GenericHandler'

export class LoginHandler extends GenericHandler implements Handler {
  private tokenGenerator: TokenGenerator

  public constructor(req: IncomingMessage, res: ServerResponse, tokenGenerator: TokenGenerator) {
    super(req, res)
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
      const body: Account = await this.getRequestBody()
      const sessionToken = await this.tokenGenerator.generateToken(body)
      if (sessionToken) {
        this.writeResponse(HTTP_CODES.CREATED, sessionToken)
      } else {
        await this.handleNotFound()
      }
    } catch (e) {
      // @ts-ignore
      this.res.write('error: ' + e.message)
    }
  }
}
