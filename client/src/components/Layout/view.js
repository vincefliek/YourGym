import style from './style.module.scss';

export const Layout = (props) => {
  const { topBar, bottomBar, children } = props;
  return (
    <div className={style.layout}>
      {topBar && <div className={style.layoutTop}>{topBar}</div>}
      <div className={style.layoutCenter}>
        <div className={style.layoutContent}>
          {children}
        </div>
      </div>
      {bottomBar && <div className={style.layoutBottom}>{bottomBar}</div>}
    </div>
  );
}
