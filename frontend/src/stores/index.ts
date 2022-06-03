import { init, Models, RematchDispatch, RematchRootState } from "@rematch/core";
import { user } from "./models/user";

export interface RootModel extends Models<RootModel> {
    user: typeof user;
}

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export const models: RootModel = { user };

const store = init({ models });

export default store;