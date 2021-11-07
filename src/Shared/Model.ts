import { Account } from '../Server/Model'

export enum AccessRight {
  CREATE,
  READ,
  UPDATE,
  DELETE,
}

export interface UserCredentials extends Account {
  accessRights: AccessRight[]
}

export enum HTTP_CODES {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
}

export enum HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
}

export interface User {
  id: string
  name: string
  age: number
  email: string
  workingPosition: WORKING_POSITION
}

export enum WORKING_POSITION {
  JUNIOR,
  PROGRAMMER,
  ENGINEER,
  EXPERT,
  MANAGER,
}
