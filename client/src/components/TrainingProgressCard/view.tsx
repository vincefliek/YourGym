import React from 'react';

import { connect } from '../../utils';
import { controller } from './controller';
import { TrainingProgressChart } from '../TrainingProgressChart';
import { Button } from '../Button';
import style from './style.module.scss';
import { TrainingAggregate } from '../../model/aggregation';

interface Props {
  last7: TrainingAggregate[];
  totals: { totalVolumeKg: number; sessions: number };
  onOpen: () => void;
}

const PureCard: React.FC<Props> = ({ last7, totals, onOpen }) => {
  return (
    <div className={style.card}>
      <div className={style.header}>
        <h4>Progress</h4>
        <div className={style.actions}>
          <Button skin="primary" size="small" onClick={onOpen}>
            Open
          </Button>
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

export const TrainingProgressCard = connect({ controller }, (ctrl) => ({
  last7: ctrl.getLast7DaysAggregates(),
  totals: ctrl.getTotalsForLast7Days(),
  onOpen: ctrl.onOpen,
}))(PureCard);

export default TrainingProgressCard;
