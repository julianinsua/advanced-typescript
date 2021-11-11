import { Handler, TokenValidator } from './Model'
import { IncomingMessage, ServerResponse } from 'http'
import { UsersDBAccess } from '../Users/UsersDBAccess'
import { AccessRight, HTTP_CODES, HTTP_METHODS, User } from '../Shared/Model'
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
      case HTTP_METHODS.PUT:
        await this.handlePut()
        break
      case HTTP_METHODS.DELETE:
        await this.handleDelete()
        break
      default:
        await this.handleNotFound()
    }
  }

  private async handleGet() {
    const isAuthorized = await this.operationAuthorized(AccessRight.READ)
    if (isAuthorized) {
      const {
        query: { id, name },
      } = Utils.getUrlParameters(this.req.url)!
      if (id) {
        const user = await this.usersDbAccess.getUserById(id as string)
        if (user) {
          await this.writeResponse(HTTP_CODES.OK, user)
        } else {
          await this.handleNotFound()
        }
      } else if (name) {
        const users = await this.usersDbAccess.getUserByName(name as string)
        if (users) {
          this.writeResponse(HTTP_CODES.OK, { users })
        } else {
          this.writeResponse(HTTP_CODES.OK, { users: [] })
        }
      } else {
        await this.handleBadRequest('No user id on request')
      }
    } else {
      await this.handleNotAuthenticated()
    }
  }

  private async handlePut(): Promise<void> {
    const isAuthorized = await this.operationAuthorized(AccessRight.CREATE)
    if (isAuthorized) {
      try {
        const user: User = await this.getRequestBody()
        await this.usersDbAccess.putUser(user)
        await this.writeResponse(HTTP_CODES.OK, { message: `user ${user.name} created` })
      } catch (e: any) {
        await this.handleBadRequest(e.message)
      }
    } else {
      await this.handleNotAuthenticated()
    }
  }

  private async handleDelete(): Promise<void> {
    const isAuthorized = await this.operationAuthorized(AccessRight.DELETE)
    if (isAuthorized) {
      try {
        const {
          query: { id },
        } = Utils.getUrlParameters(this.req.url)!
        if (id) {
          const deleteResult = await this.usersDbAccess.deleteUser(id as string)
          if (deleteResult) {
            await this.writeResponse(HTTP_CODES.OK, { message: `user ${id} deleted` })
          } else {
            await this.writeResponse(HTTP_CODES.NOT_FOUND, { message: 'no user with that id' })
          }
        }
      } catch (e) {
        await this.handleNotAuthenticated()
      }
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
