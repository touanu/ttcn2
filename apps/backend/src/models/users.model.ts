import type { Document, InferSchemaType } from 'mongoose'
import { model, Schema } from 'mongoose'

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
})

export type UserType = InferSchemaType<typeof UserSchema>
export const UserModel = model<UserType & Document>('User', UserSchema)
