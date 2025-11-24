import { Download, PlayArrow, RestartAlt, Stop } from "@mui/icons-material";
import BasePage from "../../components/base_page/base";
import SearchBar from "../../components/search/search";
import { serverService, type InstalledMod, type PlayersData, type ReadyToInstallMod, type ServerPropertiesLite } from "../../services/server";
import './server.css';
import { useState } from "react";

function Server() {

    const [installedResult, setInstalledResult] = useState<InstalledMod[] | null>(null);
    const [readyResult, setReadyResult] = useState<ReadyToInstallMod[] | null>(null);
    const [playersData, setPlayersData] = useState<PlayersData | null>(null);
    const [serverProperties, setServerProperties] = useState<ServerPropertiesLite | null>(null);
    const [serverStatus, setServerStatus] = useState<string | null>(null);

    const downloadFile = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const fetchAllData = async () => {
        try {
            const installedMods = await serverService.getInstalledMods();
            setInstalledResult(installedMods);
            const readyMods = await serverService.getReadyToInstallMods();
            setReadyResult(readyMods);
            const players = await serverService.getPlayersPermissions();
            setPlayersData(players);
            const serverProps = await serverService.getServerPropertiesLite();
            setServerProperties(serverProps);
            const status = await serverService.getServerStatus();
            setServerStatus(status);
        } catch (error) {
            console.error("Failed to fetch mods data:", error);
        }
    }
    useState(() => { fetchAllData(); });

    return (
        <BasePage>
            <div className="server-header">
                
                <div style={{display:"flex", flexDirection: "row", gap: "32px"}}>
                    <div className="header-image">
                        <img 
                            src="src/assets/Grass_Block_(graphics_fast)_JE3.png" 
                            alt="Grass Block" 
                        />
                    </div>

                    <div className="header-info">
                        <div>
                            <h1>Minecraft Server</h1>
                            <p>{serverProperties?.motd}</p>
                        </div>

                        <p>Server Status: <span>{serverStatus}</span></p>
                    </div>
                </div>

                <div className="header-actions"> 

                    { serverStatus === "running" ? (
                        <div className="header-actions">
                            <button
                                onClick={() => {
                                    serverService.stopServer().then(() => { fetchAllData(); });
                                }}
                            >
                                <Stop />
                                Stop
                            </button>
                            
                            <button
                                onClick={() => {
                                    serverService.restartServer().then(() => { fetchAllData(); });
                                }}
                            >
                                <RestartAlt />
                                Restart
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                serverService.startServer().then(() => { fetchAllData(); });
                            }}
                        >
                            <PlayArrow />
                            Start
                        </button>
                    )}
                </div>

            </div>

            <div className="divider" />

            <div style={{gap: "32px", display: "flex", flexDirection: "column"}}>
                <h2>Server Information</h2>

                <div className="minecraft-server-information">
                    {serverProperties && Object.entries(serverProperties).filter(([key]) => key !== "motd").map(([key, value], index) => (
                        <div key={index} className="info-row">
                            <p>{key}:</p>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>

            </div>

            <div className="divider" />

            <div className="world-data-grid">
                
                <div className="data-container">
                    <h2>OPs</h2>
                    <div className="data-contents">
                        {!playersData?.ops || !Array.isArray(playersData.ops) || playersData.ops.length === 0 ? (
                            <p>No OPs added.</p>
                        ) : (
                            playersData.ops.map((op, index) => (
                                <p key={index}>{op}</p>
                            ))
                        )}
                    </div>
                </div>

                <div className="data-container">
                    <h2>Whitelist</h2>
                    <div className="data-contents">
                        {!playersData?.whitelist || !Array.isArray(playersData.whitelist) || playersData.whitelist.length === 0 ? (
                            <p>No Whitelist added.</p>
                        ) : (
                            playersData.whitelist.map((whitelist, index) => (
                                <p key={index}>{whitelist}</p>
                            ))
                        )}
                    </div>
                </div>

                <div className="data-container">
                    <h2>Banned Players</h2>
                    <div className="data-contents">
                        {!playersData?.["banned-players"] || !Array.isArray(playersData["banned-players"]) || playersData["banned-players"].length === 0 ? (
                            <p>No Banned Players added.</p>
                        ) : (
                            playersData["banned-players"].map((bannedPlayer, index) => (
                                <p key={index}>{bannedPlayer}</p>
                            ))
                        )}
                    </div>
                </div>

                <div className="data-container">
                    <h2>Banned IPs</h2>
                    <div className="data-contents">
                        {!playersData?.["banned-ips"] || !Array.isArray(playersData["banned-ips"]) || playersData["banned-ips"].length === 0 ? (
                            <p>No Banned IPs added.</p>
                        ) : (
                            playersData["banned-ips"].map((bannedIP, index) => (
                                <p key={index}>{bannedIP}</p>
                            ))
                        )}
                    </div>
                </div>


            </div>

            <div className="divider" />

            <div className="mods-grid">

                <div className="mods-contents">
                    <div className="mods-header">
                        <h2>Installed Mods</h2>
                        <button
                            className="install-all-button"
                            onClick={async () => {
                                try {
                                    const blob = await serverService.downloadAllMods();
                                    downloadFile(blob, 'mods.tar.gz');
                                } catch (error) {
                                    console.error("Failed to download mods:", error);
                                }
                            }}
                        >
                            <Download />
                            Download Zip
                        </button>
                    </div>
                    <div className="mods-list">
                        
                        <SearchBar />
                        {installedResult?.map((mod, index) => (
                            <div key={index} className="mod-item">
                                <div className="mod-image">
                                    <img 
                                        src={mod.icon_url ?? "src/assets/Grass_Block_(graphics_fast)_JE3.png"}
                                        alt={mod.title} 
                                    />
                                </div>
                                <div className="mod-informations">
                                    <h3>{mod.title}</h3>
                                    <p>{mod.description}</p>
                                    <div className="mod-meta">
                                        <p>Installed at: <span>{mod.installedAt}</span></p>
                                        <p 
                                            className="remove"
                                            onClick={() => {
                                                serverService.removeMod(mod.id).then(() => { fetchAllData(); });
                                            }}
                                        >
                                            Remove
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                <div className="mods-contents">
                    <div className="mods-header">
                        <h2>Ready to install</h2>
                        <button
                            className="install-all-button"
                            onClick={() => {
                                serverService.installReadyMods().then(() => { fetchAllData(); });
                            }}
                        >
                            <Download />
                            Install All
                        </button>
                    </div>
                    <div className="mods-list">
                        <SearchBar />
                        {readyResult?.map((mod, index) => (
                            <div key={index} className="mod-item">
                                <div className="mod-image">
                                    <img 
                                        src={mod.icon_url ?? "src/assets/Grass_Block_(graphics_fast)_JE3.png"} 
                                        alt={mod.title} 
                                    />
                                </div>

                                <div className="mod-informations">
                                    <h3>{mod.title}</h3>
                                    <p>{mod.description}</p>
                                    <div className="mod-meta">
                                        <p/>
                                        <p 
                                            className="remove"
                                            onClick={() => {
                                                serverService.removeReadyMod(mod.id).then(() => { fetchAllData(); });
                                            }}
                                        >
                                            Remove
                                        </p>
                                    </div>
                                </div>

                            </div>
                        ))}
                        
                    </div>
                </div>

            </div>
                        
        </BasePage>
    );
}

export default Server;