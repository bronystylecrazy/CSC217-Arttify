import { Schema } from "mongoose";
import { User } from "@/interfaces/models/User";

export const UserSchema = new Schema<User>({
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required"],
    },
    access_token: {
        type: String,
    },
    refresh_token: {
        type: String,
    },
});

export const RepositorySchema = new Schema({
    
});