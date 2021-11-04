import { Account, SessionToken, TokenGenerator } from '../Server/Model'
import { UserCredentialsDBAccess } from './UserCredentialsDBAccess'
import { SessionTokenDBAccess } from './SessionTokenDBAccess'

export class Authorizer implements TokenGenerator {
  private userCredentialsDBAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess()
  private sessionTokenDBAccess: SessionTokenDBAccess = new SessionTokenDBAccess()

  async generateToken(account: Account): Promise<SessionToken | undefined> {
    const { username, password } = account
    const resultAccount = await this.userCredentialsDBAccess.getUserCredential(username, password)

    if (resultAccount) {
      const token: SessionToken = {
        accessRights: resultAccount.accessRights,
        expirationTime: this.generateExpirationTime(),
        username,
        valid: true,
        tokenId: this.generateRandomTokenId(),
      }
      await this.sessionTokenDBAccess.storeSessionToken(token)

      return token
    } else {
      return undefined
    }
  }

  private generateExpirationTime(): Date {
    return new Date(Date.now() + 60 * 60 * 1000)
  }

  private generateRandomTokenId(): string {
    return Math.random().toString(36).slice(2)
  }
}
