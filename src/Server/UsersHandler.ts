import { Handler, TokenValidator } from './Model'
import { IncomingMessage, ServerResponse } from 'http'
import { UsersDBAccess } from '../Users/UsersDBAccess'
import { AccessRight, HTTP_CODES, HTTP_METHODS } from '../Shared/Model'
import { Utils } from './Utils'
import { GenericHandler } from './GenericHandler'

export class UsersHandler extends GenericHandler implements Handler {
  private usersDbAccess: UsersDBAccess
  private tokenValidator: TokenValidator

  public constructor(req: IncomingMessage, res: ServerResponse, tokenValidator: TokenValidator) {
    super(req, res)
    this.usersDbAccess = new UsersDBAccess()
    this.tokenValidator = tokenValidator
  }
  public async handleRequest(): Promise<void> {
    switch (this.req.method) {
      case HTTP_METHODS.GET:
        await this.handleGet()
        break
      default:
        await this.handleNotFound()
    }
  }

  private async handleGet() {
    const isAuthorized = await this.operationAuthorized(AccessRight.READ)
    if (isAuthorized) {
      const {
        query: { id },
      } = Utils.getUrlParameters(this.req.url)!
      if (id) {
        const user = await this.usersDbAccess.getUserById(id as string)
        if (user) {
          await this.writeResponse(HTTP_CODES.OK, user)
        } else {
          await this.handleNotFound()
        }
      } else {
        await this.handleBadRequest('No user id on request')
      }
    } else {
      await this.writeResponse(HTTP_CODES.BAD_REQUEST, { message: 'not authenticated' })
    }
  }

  public async operationAuthorized(operation: AccessRight): Promise<boolean> {
    const token = this.req.headers.authorization
    if (token) {
      const tokenRights = await this.tokenValidator.validateToken(token)
      return !!tokenRights.accessRights.includes(operation)
    } else {
      return false
    }
  }
}
