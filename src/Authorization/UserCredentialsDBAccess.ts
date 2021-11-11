import { UserCredentials } from '../Shared/Model'
import Nedb = require('nedb')

export class UserCredentialsDBAccess {
  private nedb: Nedb

  constructor() {
    this.nedb = new Nedb('database/UserCredentials.db')
    this.nedb.loadDatabase()
  }

  public async putUserCredential(userCredentials: UserCredentials): Promise<any> {
    return new Promise((resolve, reject) => {
      this.nedb.insert(userCredentials, (e: Error | null, docs: any) => {
        if (e) {
          reject(e)
        } else {
          resolve(docs)
        }
      })
    })
  }

  public async getUserCredential(
    username: string,
    password: string
  ): Promise<UserCredentials | undefined> {
    try {
      return new Promise((resolve, reject) => {
        this.nedb.find({ username, password }, (e: Error | null, docs: UserCredentials[]) => {
          if (e) {
            reject(e)
          }
          if (docs.length === 0) {
            resolve(undefined)
          } else {
            resolve(docs[0])
          }
        })
      })
    } catch (e) {
      return undefined
    }
  }
}
