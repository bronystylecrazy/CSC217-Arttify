import { createModel } from "@rematch/core";
import { RootModel } from "..";
import { axios } from '@/utils/api';
import { Repository } from "@/interfaces/Repository";
import { InfoResponse } from "@/interfaces/handler";

export type RepositoryStoreState = {
    repositories?: Repository[];
};

export const repository = createModel<RootModel>()({
    state: {
        repositories: []
    } as RepositoryStoreState,
    reducers: {
        SET_REPOSITORIES(state, payload: Repository[]) {
            return { ...state, repositories: payload };
        }
    },
    effects: (dispatch) => ({
        async sync() {
            const repositories = JSON.parse(localStorage.getItem('repositories'));
            if (repositories) {
                dispatch.repository.SET_REPOSITORIES(repositories || []);
            }
        },
        async getRepositories() {
            const { data } = await axios.get<InfoResponse<Repository[]>>(`/api/repo`);
            dispatch.repository.SET_REPOSITORIES(data.data || []);
            localStorage.setItem('repositories', JSON.stringify(data.data || []));
        },
    })
});