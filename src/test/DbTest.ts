import { UserCredentialsDBAccess } from '../Authorization/UserCredentialsDBAccess'

class DbTest {
  public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess()
}

new DbTest().dbAccess.putUserCredential({
  username: 'pepito',
  password: '123456',
  accessRights: [1, 2, 3],
})
