import api from "./api";

export interface TerminalCommandPayload<TerminalCommand> {
    response: string;
    commands_history: TerminalCommand[];
}

export interface TerminalCommand {
    timestamp: string;
    command: string;
}


export const terminalService = {

    sendCommand: async (command: string): Promise<TerminalCommandPayload<TerminalCommand>> => {
        const response = await api.post(`/mc-server/command`, { command });
        return response.data;
    },

    getLastCommands: async (): Promise<TerminalCommandPayload<TerminalCommand>> => {
        const response = await api.get(`/mc-server/commands-history`);
        return response.data;
    }

}