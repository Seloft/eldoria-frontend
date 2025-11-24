import './mod_details.css'
import {useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BasePage from '../../components/base_page/base';
import { modService, type AddMod, type Mod } from '../../services/mod';
import { Add } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import DownloadIcon from '@mui/icons-material/Download';

function formatDate(dateString?: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatNumber(num: number): string {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace('.0', '') + 'k';
    return num.toString();
}

function ModDetails() {

    const { id } = useParams<{ id: string }>();
    const [result, setResult] = useState<Mod | null>(null);
    const [message, setMessage] = useState<string | null>(null);


    const fetchModDetails = async (modId: string) => {
        try {
            const response = await modService.getProject(modId);
            setResult(response);
        } catch (error) {
            console.error("Error fetching mod details:", error);
        }
    }
    useEffect(() => { if (id) { fetchModDetails(id); } }, [id]);
    
    const handleAddMod = async (modToAdd: AddMod) => {
        try {
            const response = await modService.addModToFile(modToAdd);
            setMessage(response);
            setTimeout(() => setMessage(null), 2000);
            fetchModDetails(modToAdd.project_id);
        } catch (error) {
            setMessage("Failed to add mod.");
            setTimeout(() => setMessage(null), 2000);
            console.error("Error adding mod:", error);
        }
    }

    return (
        <BasePage>
            <div className="mod-details-page">

                {message && (
                    <div className="floating-message left">
                        <p>{message}</p>
                    </div>
                )}

                <div className='mod-details-header'>

                    <div className="header-image">
                            <img 
                                src={result?.icon_url === '' ? "src/assets/im-having-this-404-error-and-idk-why-v0-zg0r0v2va7fe1.webp" : result?.icon_url} 
                                alt={`${result?.title} Mod`} 
                            />
                    </div>

                    <div className='header-info'> 
                        <div>
                            <h1>{result?.title}</h1>
                            <p>{result?.description}</p>
                        </div>
                    
                        <div className='header-stats'>

                           <div className='stats-row'>
                                <p>Downloads: <span>{formatNumber(result?.downloads || 0)}</span></p>
                                <p>Followers: <span>{formatNumber(result?.followers || 0)}</span></p>
                           </div>

                            <div className='stats-row'>
                                <p>Updated: <span>{formatDate(result?.updated)}</span></p>
                                <p>Published: <span>{formatDate(result?.published)}</span></p>
                            </div>

                        </div>

                    </div>

                </div>    

                <h2>File Versions</h2>
                <div className='table-description'>
                    <p>Minecraft Version</p>
                    <p>Mod Version</p>
                    <p>Version Name</p>
                    <p>File Name</p>
                    <p>Downloads</p>
                    <span />
                </div>
                <div className='contents'>
                    {result?.file_versions.map((fileVersion, index) => (
                        <div key={index} className='file-version-row'>
                            <p>{fileVersion.game_versions.join(', ')}</p>
                            <p>{fileVersion.version_number}</p>
                            <p>{fileVersion.name}</p>
                            <p>{fileVersion.files[0].filename}</p>
                            <p>{formatNumber(fileVersion.downloads)}</p>
                            {result.installed && result.file_version_id === fileVersion.id ? (
                                <FileDownloadDoneIcon style={{color: "green"}} />
                            ) : result.ready && result.file_version_id === fileVersion.id ? (
                                <DownloadIcon style={{color: "blue"}} />
                            ) : (
                                <Add 
                                    style={{color: "var(--yellow-color)", cursor: "pointer"}}
                                    onClick={() => {
                                        const modToAdd: AddMod = {
                                            id: fileVersion.id,
                                            title: result?.title || '',
                                            description: result?.description || '',
                                            icon_url: result?.icon_url || '',
                                            download_url: fileVersion.files[0].url,
                                            project_id: result?.project_id || '',
                                            file_name: fileVersion.files[0].filename
                                        };
                                        handleAddMod(modToAdd);
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div> 

                <div className='markdown-body'>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    >
                        {result?.body || ''}
                    </ReactMarkdown>
                </div>      

                <h2>Galery</h2>
                <div className='contents-gallery'>
                    {result?.gallery.map((image, index) => (
                        <div key={index} className='gallery-image'>
                            <img 
                                src={image.url}
                                alt={`Gallery Image ${index + 1}`} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </BasePage>
    );
}

export default ModDetails;