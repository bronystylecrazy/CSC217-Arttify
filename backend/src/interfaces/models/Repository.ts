export type Repository = {
    _id: string;
    id: number;
    owner_id: string;
    name: string;
    full_name: string;
    clone_url: string;
    current_build: string;
    created_at: Date;
    updated_at: Date;
    build_dir: string;
    build_cmd: string;
    status: string;
};

export type Building = {
    _id: string;
    repository_id: number;
    owner_id: string;
    status: string;
    time: number;
    created_at: Date;
    updated_at: Date;
};