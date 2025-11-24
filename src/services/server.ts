import api from "./api";

export interface InstalledMod {
    id: string;
    title: string;
    description: string;
    icon_url: string;
    download_url: string;
    project_id: string;
    file_name: string;
    dependency_of: string[];
    installedAt: string;
}

export interface ReadyToInstallMod {
    id: string;
    title: string;
    description: string;
    icon_url: string;
    download_url: string;
    project_id: string;
    file_name: string;
    dependency_of: string[];
}

export interface ServerPropertiesLite {
    difficulty: string;
    gamemode: string;
    hardcore: string;
    "simulation-distance": string;
    "server-port": string;
    pvp: string;
    "rcon.password": string;
    "rcon.port": string;
    "enable-rcon": string;
    "level-seed": string;
    "max-world-size": string;
    "max-tick-time": string;
    "max-players": string;
    motd: string;
    "white-list": string;
    "view-distance": string;
}

export interface PlayersData {
    "banned-ips": string[];
    "banned-players": string[];
    whitelist: string[];
    ops: string[];
}

export const serverService = {

    getInstalledMods: async () => {
        const response = await api.get<InstalledMod[]>("/mc-server/mods");
        return response.data;
    },

    getReadyToInstallMods: async () => {
        const response = await api.get<ReadyToInstallMod[]>("/mc-server/mods/ready");
        return response.data;
    },

    installReadyMods: async () => {
        const response = await api.post("/mc-server/mods/install");
        return response.data;
    },

    getServerPropertiesLite: async () => {
        const response = await api.get<ServerPropertiesLite>("/files/server-config-lite");
        return response.data;
    },

    getPlayersPermissions: async () => {
        const response = await api.get<PlayersData>("/files/players-data");
        return response.data;
    },

    startServer: async () => {
        const response = await api.post("/mc-server/start");
        return response.data;
    },

    stopServer: async () => {
        const response = await api.post("/mc-server/stop");
        return response.data;
    },

    restartServer: async () => {
        const response = await api.post("/mc-server/restart");
        return response.data;
    },

    getServerStatus: async () => {
        const response = await api.get("/mc-server/status");
        return response.data;
    },

    removeMod: async (modId: string) => {
        const response = await api.post(`/mc-server/mods/remove/${modId}`);
        return response.data;
    },

    removeReadyMod: async (modId: string) => {
        const response = await api.post(`/mc-server/mods/ready/remove/${modId}`);
        return response.data;
    },

    downloadAllMods: async () => {
        const response = await api.get("/files/mods/download-all", {
            responseType: 'blob'
        });
        return response.data;
    }
}