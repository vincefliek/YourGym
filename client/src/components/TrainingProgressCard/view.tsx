import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from '../../utils';
import { controller } from './controller';
import { TrainingProgressChart } from '../TrainingProgressChart';
import { Button } from '../Button';
import style from './style.module.scss';
import { TrainingAggregate } from '../../model/aggregation';

interface Props {
  last7: TrainingAggregate[];
  totals: { totalVolumeKg: number; sessions: number };
}

const PureCard: React.FC<Props> = ({ last7, totals }) => {
  return (
    <div className={style.card}>
      <div className={style.header}>
        <h4>Progress</h4>
        <div className={style.actions}>
          <Link to="/dashboard">
            <Button skin="primary" size="small">Open</Button>
          </Link>
        </div>
      </div>
      <div className={style.kpis}>
        <div className={style.kpiItem}>
          <div className={style.kpiLabel}>7d volume</div>
          <div className={style.kpiValue}>
            {Math.round(totals.totalVolumeKg)} kg
          </div>
        </div>
        <div className={style.kpiItem}>
          <div className={style.kpiLabel}>sessions</div>
          <div className={style.kpiValue}>{totals.sessions}</div>
        </div>
      </div>
      <div style={{ height: 64 }}>
        <TrainingProgressChart data={last7} variant="sparkline" height={64} />
      </div>
    </div>
  );
};

export const TrainingProgressCard = connect({ controller }, ctrl => ({
  last7: ctrl.getLast7DaysAggregates(),
  totals: ctrl.getTotalsForLast7Days(),
}))(PureCard);

export default TrainingProgressCard;
