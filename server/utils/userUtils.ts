import { IUser, IUserTokenData } from '../interfaces/User.interface'
import { APP_SECRET } from './constants'
import mongoose from '../lib/database'
const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('apollo-server-core')

export function getUserID(ctx: any) {
  const Authorization = ctx.req.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userID } = jwt.verify(token, APP_SECRET) as {
      userID: string
    }

    return userID
  }

  throw new AuthenticationError('Your session expired. Sign in again.')
}

export async function getUserFromId(ctx: any, id: string) {
  const ObjectId = mongoose.Types.ObjectId

  const [user] = await ctx.models.User.aggregate([
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        as: 'permissions', // Alias
        foreignField: '_id', // Field in the 'permission' schema
        from: 'permissions', // collection name in db
        localField: 'permissions' // Field in the user schema
      }
    }
  ])

  return user
}

export function getUserTokenData(user: IUser): IUserTokenData {
  return {
    id: user._id,
    permissions: user.permissions.map(permission => permission.enum)
  }
}
