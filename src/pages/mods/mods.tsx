import './mods.css';
import { modsService, type Mods } from '../../services/mods';
import { useEffect, useState, useCallback } from 'react';
import type { ApiResponse } from '../../services/api';
import { useModsContext } from '../../context/context';
import { useNavigate } from 'react-router-dom';
import BasePage from '../../components/base_page/base';

function ModsPage() {
    const { query, sortedBy, qtdMods, currentPage, setLastPage } = useModsContext();
    const [result, setResult] = useState<ApiResponse<Mods> | null>(null);
    const navigate = useNavigate();

    const fetchModsPage = useCallback(async () => {
        try {
            const offset = currentPage * qtdMods;
            const result = await modsService.getModsPaginated(
                query,
                sortedBy.toLowerCase(),
                qtdMods,
                offset,
                "1.20.1"
            );
            setResult(result);
            const totalPages = Math.ceil(result.total_hits / qtdMods);
            setLastPage(totalPages);
        } catch (error) {
            console.error("Erro ao buscar mods:", error);
        }
    }, [query, sortedBy, qtdMods, currentPage, setLastPage]);

    useEffect(() => { fetchModsPage(); }, [fetchModsPage]);

    return (
        <BasePage>
            <div className="mods-container">
                {result?.results.map((mod: Mods) => (
                    <div key={mod.project_id} className="mod-card"
                        onClick={() => {
                            navigate(`/mod/${mod.project_id}`);
                        }}
                    >
                        <div className="img-background">
                            <img 
                                src={mod.icon_url === '' ? "src/assets/im-having-this-404-error-and-idk-why-v0-zg0r0v2va7fe1.webp" : mod.icon_url} 
                                alt={`${mod.title} Mod`} 
                            />
                        </div>
                        <div className='mod-info'>
                            <h2>{mod.title}</h2>
                            <span>Author: <p>{mod.author}</p></span>
                            <span>Server: <p>{mod.server_side}</p></span>
                        </div>
                        <p className='mod-description'>{mod.description}</p>
                    </div>
                ))}
            </div>
        </BasePage>
    );
}

export default ModsPage;