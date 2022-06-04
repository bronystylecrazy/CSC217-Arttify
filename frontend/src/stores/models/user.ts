import { Profile } from '../../../../backend/src/interfaces/models/User';
import { createModel } from "@rematch/core";
import { RootModel } from "..";
import { axios } from '@/utils/api';
import Cookies from 'js-cookie';


export type UserStoreType = {
    isAuthenticated?: boolean;
    profile?: Partial<Profile>;
}

export const user = createModel<RootModel>()({
    state: {
        isAuthenticated: false,
        profile: {
            login: "",
            id: -1,
            node_id: "",
            avatar_url: "",
            gravatar_id: "",
            url: "",
            html_url: "",
            followers_url: "",
            following_url: "",
            gists_url: "",
            starred_url: "",
            subscriptions_url: "",
            organizations_url: "",
            repos_url: "",
            events_url: "",
            received_events_url: "",
            type: "",
            site_admin: false,
            name: "",
            company: "",
            blog: "",
            location: "",
            email: null,
            hireable: false,
            bio: "",
            twitter_username: null,
            public_repos: 0,
            public_gists: 0,
            followers: 0,
            following: 0,
            created_at: new Date(),
            updated_at: new Date(),
        }
    } as UserStoreType, // initial state
    reducers: {
        SET_STATE(state, payload: Partial<UserStoreType>) {
            return { ...state, ...payload };
        }
    },
    effects: (dispatch) => ({
        async setState(payload: Partial<UserStoreType>) {
            dispatch.user.SET_STATE(payload);
        },
        async setProfile(payload: Partial<Profile>) {
            dispatch.user.SET_STATE({ profile: payload });
        },
        async fetchProfile() {
            try {
                const pfStorage: Partial<Profile> = JSON.parse(localStorage.getItem('user'));
                if (pfStorage) {
                    dispatch.user.SET_STATE({ isAuthenticated: true, profile: pfStorage });
                }
                const { data } = await axios.get('/api/auth/me');
                dispatch.user.SET_STATE({ isAuthenticated: true, profile: data.data });
            } catch (e) {
                console.error(e);
            }
        },
        async sync() {
            const state = Cookies.get('user');
            if (state) {
                dispatch.user.SET_STATE({ isAuthenticated: true });
            }
            return state;
        },
        async logout() {
            localStorage.removeItem('repositories');
            localStorage.removeItem('user');
            Cookies.remove('user', { path: '/' });
            dispatch.user.SET_STATE({ isAuthenticated: false, profile: { login: "", id: -1, node_id: "", avatar_url: "", gravatar_id: "", url: "", html_url: "", followers_url: "", following_url: "", gists_url: "", starred_url: "", subscriptions_url: "", organizations_url: "", repos_url: "", events_url: "", received_events_url: "", type: "", site_admin: false, name: "", company: "", blog: "", location: "", email: null, hireable: false, bio: "", twitter_username: null, public_repos: 0, public_gists: 0, followers: 0, following: 0, created_at: new Date(), updated_at: new Date(), } });
        }
    }),
});