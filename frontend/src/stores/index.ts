import { init, Models, RematchDispatch, RematchRootState } from "@rematch/core";
import { repository } from "./models/repository";
import { user } from "./models/user";

export interface RootModel extends Models<RootModel> {
    user: typeof user;
    repository: typeof repository;
}

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export const models: RootModel = { user, repository };

const store = init({ models });

export default store;