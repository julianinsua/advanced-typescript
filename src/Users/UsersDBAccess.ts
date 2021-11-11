import Nedb = require('nedb')
import { User } from '../Shared/Model'

export class UsersDBAccess {
  private nedb: Nedb

  public constructor() {
    this.nedb = new Nedb('database/Users.db')
    this.nedb.loadDatabase()
  }

  public async putUser(user: User): Promise<void> {
    if (!user.id) {
      user.id = this.generateRandomId()
    }
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

  public async getUserByName(name: string): Promise<User[]> {
    const regEx = new RegExp(name)
    return new Promise((resolve, reject) => {
      this.nedb.find({ name: regEx }, (e: Error | null, users: User[]) => {
        if (e) {
          reject(e)
        } else {
          resolve(users)
        }
      })
    })
  }

  public async deleteUser(userId: string): Promise<boolean> {
    const success = await this.deleteUserById(userId)
    this.nedb.loadDatabase()
    return success
  }

  private async deleteUserById(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.nedb.remove({ id }, (e, numRemoved) => {
        if (e) {
          reject(e)
        } else {
          if (numRemoved === 0) {
            resolve(false)
          } else {
            resolve(true)
          }
        }
      })
    })
  }

  private generateRandomId(): string {
    return Math.random().toString(36).slice(2)
  }
}
