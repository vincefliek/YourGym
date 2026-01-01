import { Layout, Navbar } from '../../components';

export function NotFound() {
  return (
    <Layout dataTestId="not-found-screen" bottomBar={<Navbar />}>
      <div style={{ padding: 12 }}>
        <h2>404 - Not Found</h2>
        <p>The page you are looking for does not exist.</p>
      </div>
    </Layout>
  );
}
