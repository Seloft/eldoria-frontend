import api from "./api";

export interface Mod {
    project_id: string;
    title: string;
    description: string;
    body: string;
    updated: string;
    published: string;
    icon_url: string;
    downloads: number;
    followers: number;
    server_side: string;
    client_side: string;
    file_version_id: string;
    installed: boolean;
    ready: boolean;
    file_versions: any[];
    gallery: any[];
}

export interface AddMod {
    id: string;
    title: string;
    description: string;
    icon_url: string;
    download_url: string;
    project_id: string;
    file_name: string;
}

export const modService = {

    getProject: async (id: string): Promise<Mod> => {
        const response = await api.get(`/modrinth/mod/${id}`);
        return response.data;
    },

    addModToFile: async (mod: AddMod): Promise<string> => {
        const response = await api.post('/mods/add-new-mod', mod);
        return response.data;
    }

}