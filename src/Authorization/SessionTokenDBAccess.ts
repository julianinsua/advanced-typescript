import * as Nedb from 'nedb'
import { SessionToken } from '../Server/Model'

export class SessionTokenDBAccess {
  private nedb: Nedb

  constructor() {
    this.nedb = new Nedb('database/SessionTokens.db')
    this.nedb.loadDatabase()
  }

  public async storeSessionToken(token: SessionToken): Promise<void> {
    return new Promise((resolve, reject) => {
      this.nedb.insert(token, (e: Error | null) => {
        if (e) {
          reject(e)
        } else {
          resolve()
        }
      })
    })
  }
}
