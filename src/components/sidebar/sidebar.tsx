import './sidebar.css';
import { Terminal, Storage, ViewInAr } from '@mui/icons-material';
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const options = [
        { icon: <ViewInAr />, label: "Mods", path: "/mods" },
        { icon: <Storage />, label: "Server", path: "/server" },
        { icon: <Terminal />, label: "Terminal", path: "/terminal" },
    ];

    const navigateTo = (path: string) => {
        navigate(path);
    };

    return (
        <div className="sidebar">
            {options.map((option, index) => {
                const isActive = location.pathname === option.path;
                return (
                    <div
                        key={index}
                        className={`sidebar-option${isActive ? ' active' : ''}`}
                        onClick={() => navigateTo(option.path)}
                    >
                        <div className={`sidebar-icon${isActive ? ' colored' : ''}`}>{option.icon}</div>
                        <div className={`sidebar-label${isActive ? ' colored' : ''}`}>{option.label}</div>
                    </div>
                );
            })}
        </div>
    );
}

export default Sidebar;