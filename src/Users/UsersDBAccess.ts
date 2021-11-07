import * as Nedb from 'nedb'
import { User } from '../Shared/Model'

export class UsersDBAccess {
  private nedb: Nedb

  public constructor() {
    this.nedb = new Nedb('database/Users.db')
    this.nedb.loadDatabase()
  }

  public async putUser(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      this.nedb.insert(user, (e: Error | null) => {
        if (e) {
          reject(e)
        } else {
          resolve()
        }
      })
    })
  }

  public async getUserById(id: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      this.nedb.find({ id }, (e: Error | null, users: User[]) => {
        if (e) {
          reject(e)
        } else {
          if (users.length === 0) {
            resolve(undefined)
          } else {
            const [user] = users
            resolve(user)
          }
        }
      })
    })
  }
}
