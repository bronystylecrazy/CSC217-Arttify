import { Building, Repository } from '@/interfaces/models/Repository';
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

export const RepositorySchema = new Schema<Repository>({
    id: {
        type: Number,
        unique: true,
        required: [true, "Repository id is required"],
    },
    name: {
        type: String,
    },
    full_name: {
        type: String,
    },
    owner_id: {
        type: Schema.Types.ObjectId,
    },
    clone_url: {
        type: String,
    },
    build_cmd: {
        type: String,
    },
    build_dir: {
        type: String
    },
    status: {
        type: String,
    },
    created_at: {
        type: Date,
    },
    updated_at: {
        type: Date,
    },
});

export const BuildSchema = new Schema<Building>({
    repository_id: {
        type: Number
    },
    owner_id: {
        type: Schema.Types.ObjectId,
    },
    status: {
        type: String,
    },
    created_at: {
        type: Date,
    },
    time: {
        type: Number,
    },
    updated_at: {
        type: Date,
    }
});