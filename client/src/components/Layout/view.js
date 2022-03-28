import './style.css';

export const Layout = (props) => {
  const { topBar, bottomBar, children } = props;
  return (
    <div className="layout">
      {topBar && <div className="layout-top">{topBar}</div>}
      <div className="layout-center">
        <div className="layout-content">
          {children}
        </div>
      </div>
      {bottomBar && <div className="layout-bottom">{bottomBar}</div>}
    </div>
  );
}
