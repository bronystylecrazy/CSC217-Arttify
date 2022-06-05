import { model } from 'mongoose'
import { RepositorySchema, UserSchema, BuildSchema } from './schema'

export const User = model("User", UserSchema);
export const Repository = model("Repository", RepositorySchema);
export const Building = model("Building", BuildSchema);