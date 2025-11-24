import './search.css';
import { useModsContext } from '../../context/context';
import { Search } from '@mui/icons-material';
import { useState, useEffect } from 'react';

function SearchBar() {
    const { query: globalQuery, setQuery, setCurrentPage } = useModsContext();
    const [localQuery, setLocalQuery] = useState(globalQuery);

    useEffect(() => {
        const handler = setTimeout(() => {
            setQuery(localQuery);
            if (globalQuery !== localQuery) { setCurrentPage(0); }
        }, 1000);

        return () => { clearTimeout(handler); };
        
    }, [localQuery, setQuery, setCurrentPage]);
    useEffect(() => { setLocalQuery(globalQuery); }, [globalQuery]);


    const handleSearchNow = () => {
        setQuery(localQuery);
        setCurrentPage(0);
    };

    return (
        <div className='search-container'>
            <button
                className="search-icon-btn"
                onClick={handleSearchNow}
                aria-label="Search"
                type="button"
            >
                <Search />
            </button>
            <input
                value={localQuery}
                onChange={e => setLocalQuery(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        handleSearchNow();
                    }
                }}
                placeholder="Search for a mod to install"
            />
        </div>
    );
}

export default SearchBar;