import { useState, useRef, useEffect } from 'react';
import './pagination_options.css';
import { useModsContext } from '../../context/context';

type PaginationOptionsProps = {
    title: string;
    textItems: string;
    dropDownItems?: string[];
}

function PaginationOptions( { title, textItems, dropDownItems = [] }: PaginationOptionsProps ) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(textItems);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { setSortedBy, setQtdMods } = useModsContext(); 

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleItemClick = (item: string) => {
        setSelectedItem(item);
        setIsOpen(false);
        
        if (title === "Items per page") {
            setQtdMods(Number(item));
        } else if (title === "Sort by") {
            setSortedBy(item);
        }
    };

    return (
        <div className='item' ref={dropdownRef}>
            <p>{title}</p>
            <button 
                className='dropdown-button'
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedItem}
            </button>
            
            {isOpen && dropDownItems.length > 0 && (
                <div className='dropdown-menu'>
                    {dropDownItems.map((item, index) => (
                        <div 
                            key={index}
                            className={`dropdown-item ${item === selectedItem ? 'selected' : ''}`}
                            onClick={() => 
                                handleItemClick(item)
                                
                            }
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PaginationOptions;