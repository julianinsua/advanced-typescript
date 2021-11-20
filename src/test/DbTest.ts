import { UserCredentialsDBAccess } from '../Authorization/UserCredentialsDBAccess'
import { UsersDBAccess } from '../Users/UsersDBAccess'
import { WORKING_POSITION } from '../Shared/Model'

class DbTest {
  public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess()
  public userDbAccess: UsersDBAccess = new UsersDBAccess()
}

new DbTest().userDbAccess.putUser({
  id: '123',
  name: 'pepito',
  age: 12,
  email: 'pepito@pepito.com',
  workingPosition: WORKING_POSITION.JUNIOR,
})
