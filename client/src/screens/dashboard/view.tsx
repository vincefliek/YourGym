import React from 'react';

import { connect } from '../../utils';
import { controller } from './controller';
import { Layout, Navbar, TrainingProgressChart } from '../../components';

const PureDashboard: React.FC<any> = ({ aggregates }) => {
  return (
    <Layout bottomBar={<Navbar />}>
      <div style={{ padding: 12 }}>
        <h2>Progress dashboard</h2>
        <section style={{ marginTop: 12 }}>
          <h3>Volume trend (last 30 days)</h3>
          <div style={{ height: 240 }}>
            <TrainingProgressChart
              data={aggregates.slice(-30)}
              variant="detailed"
              height={240}
            />
          </div>
        </section>
        <section style={{ marginTop: 12 }}>
          <h3>Sessions (last 30 days)</h3>
          <div style={{ height: 160 }}>
            <TrainingProgressChart
              data={aggregates.slice(-30)}
              variant="bar"
              height={160}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export const Dashboard = connect({ controller }, ctrl => ({
  aggregates: ctrl.getAggregates(),
}))(PureDashboard);
