import React from 'react';

import { connect } from '../../utils';
import { controller } from './controller';
import type { TrainingAggregate } from '../../model/aggregation';
import { TrainingProgressChart, Paper } from '..';

import style from './style.module.scss';

interface Props {
  last7: TrainingAggregate[];
  totals: { totalVolumeKg: number; sessions: number };
}

const PureCard: React.FC<Props> = ({ last7, totals }) => {
  return (
    <Paper shadow="sm" p="xs" withBorder className={style.card}>
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
    </Paper>
  );
};

export const TrainingProgressCard = connect({ controller }, (ctrl) => ({
  last7: ctrl.getLast7DaysAggregates(),
  totals: ctrl.getTotalsForLast7Days(),
}))(PureCard);

export default TrainingProgressCard;
