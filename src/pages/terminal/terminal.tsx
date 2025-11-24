import { useEffect, useState, useRef } from "react";
import BasePage from "../../components/base_page/base";
import { terminalService, type TerminalCommand, type TerminalCommandPayload } from "../../services/terminal";
import './terminal.css';

function formatTimestamp(iso: string) {
    const date = new Date(iso);
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function Server() {

  const [logs, setLogs] = useState<string[]>([]);
  const [lastsCommands, setLastsCommands] = useState<TerminalCommandPayload<TerminalCommand> | null>(null);
  const logsOutputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fechLastCommands();
        const ws = new WebSocket('ws://localhost/api/mc-server/logs');

        ws.onmessage = (event) => {
            setLogs((prevLogs) => [...prevLogs, event.data]);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.close();
        };
    }, []);

    useEffect(() => {
        if (logsOutputRef.current) {
            logsOutputRef.current.scrollTop = logsOutputRef.current.scrollHeight;
        }
    }, [logs]);

    const fechLastCommands = async () => {
        try {
            const commands = await terminalService.getLastCommands();
            setLastsCommands(commands);
        } catch (error) {
            console.error("Failed to fetch last commands:", error);
        }
    };

    const handleSendCommand = async (command: string) => {
        try {
            const sentCommand = await terminalService.sendCommand(command);
            setLastsCommands(sentCommand);
        } catch (error) {
            console.error("Failed to send command:", error);
        }
    };

  return (
    <BasePage>
      <div className="terminal-rows">
        
        <div className="terminal">
          <h2>Minecraft Terminal</h2>
          <div className="terminal-output">
            {lastsCommands?.commands_history.map((cmd, index) => (
              <p key={index}>
                <span className="timestamp">[{formatTimestamp(cmd.timestamp)}]</span> &gt; {cmd.command}
              </p>
            ))}
          </div>
          <div>
            <input 
              type="text" 
              className="terminal-input" 
              placeholder="Exemple: say Hello World" 
              onKeyDown={e => {
                  if (e.key === 'Enter') {
                      handleSendCommand((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                  }
              }}
            />
          </div>
        </div>

        <div className="logs">
          <h2>Minecraft Logs</h2>
          <div className="logs-output" ref={logsOutputRef}>
            {logs.map((log, index) => (
              <p key={index}>{log}</p>
            ))}
          </div>
        </div>

      </div>
    </BasePage>
  )
}

export default Server;