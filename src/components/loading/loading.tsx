import './loading.css';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
  overlay?: boolean;
}

function Loading({ 
  fullScreen = false, 
  text = 'Carregando...', 
  overlay = false 
}: LoadingProps) {
  const loadingContainerClasses = `
    loading-container
    ${fullScreen ? 'loading-container--fullscreen' : ''}
    ${overlay ? 'loading-container--overlay' : ''}
  `;

  return (
    <div className={loadingContainerClasses}>
      <div className="loading-spinner">
        <div className="loading-spinner__circle"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}

export default Loading;