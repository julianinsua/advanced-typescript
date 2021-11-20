import { AccessRight } from '../Shared/Model'

export interface Account {
  username: string
  password: string
}

export interface Handler {
  handleRequest(): void
}

export interface SessionToken {
  tokenId: string
  username: string
  valid: boolean
  expirationTime: Date
  accessRights: AccessRight[]
}

export enum TOKEN_STATUS {
  VALID,
  INVALID,
  EXPIRED,
}

export interface TokenRights {
  accessRights: AccessRight[]
  state: TOKEN_STATUS
}

export interface TokenGenerator {
  generateToken(account: Account): Promise<SessionToken | undefined>
}

export interface TokenValidator {
  validateToken(tokenId: string): Promise<TokenRights>
}
