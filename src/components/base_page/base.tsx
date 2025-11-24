import './base.css';

type Props = {
    children: React.ReactNode;
};

function BasePage( { children }: Props ) {
    return (
        <div className="base-page">
            {children}
        </div>
    );
}

export default BasePage;