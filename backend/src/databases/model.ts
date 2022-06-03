import { model } from 'mongoose'
import { UserSchema } from './schema'

export const User = model("User", UserSchema);