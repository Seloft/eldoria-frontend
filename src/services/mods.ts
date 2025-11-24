import api from "./api";
import { type ApiResponse } from "./api";

export interface Mods {
    project_id: string;
    author: string;
    description: string;
    icon_url: string;
    title: string;
    server_side: string;
}

export const modsService = {

    getModsPaginated: async (query: string, index: string, limit: number, offset: number, minecraft_version: string): Promise<ApiResponse<Mods>> => {

        const response = await api.get(`/modrinth/search/fabric`, {
            params: {
                query: query,
                index: index,
                limit: limit,
                offset: offset,
                mc_version: minecraft_version
            }
        });

        return response.data;
    }

}