import { useState } from 'react';
import { AppProvider, useApp } from './store';
import type { Scenario } from './store';
import { Button, Modal, Select } from './components';
import Admin from './Admin';
import Mobile from './Mobile';

function AppViews() {
  const { route, toast, reset, scenario, setScenario } = useApp();
  const [resetOpen, setResetOpen] = useState(false);
  const options: [string, string][] = [['normal', 'Default']];
  if (['offices', 'bookings', 'results', 'parking'].includes(route.page)) options.push(['empty', 'No results'], ['error', 'Service unavailable']);
  if (['review', 'park-review'].includes(route.page)) options.push(['conflict', 'Availability conflict'], ['error', 'Booking failed']);
  if (route.page === 'cancel') options.push(['error', 'Cancellation failed']);
  return <>
    <div className="mock-toolbar">
      <span className="mock-label">Officely <span>/ clickable mockup</span></span>
      <nav aria-label="Choose app" className="view-switch"><a className={route.mode === 'admin' ? 'selected' : ''} href="#admin/offices">Web app</a><a className={route.mode === 'mobile' ? 'selected' : ''} href="#mobile/search">Mobile app</a></nav>
      <details className="demo-options"><summary>Demo options</summary><div><p>Sample data only. Refresh resets this demo.</p><Select label="Screen state" value={scenario} onChange={v => setScenario(v as Scenario)} options={options} /><Button onClick={() => setResetOpen(true)}>Reset demo data</Button></div></details>
    </div>
    {route.mode === 'admin' ? <Admin /> : <Mobile />}
    {toast && <div className="toast" role="status">{toast}</div>}
    {resetOpen && <Modal title="Reset the demo?" close={() => setResetOpen(false)}><p>All demo changes will be replaced with the starting sample data.</p><div className="actions"><Button onClick={() => setResetOpen(false)}>Keep exploring</Button><Button primary onClick={() => { reset(); setResetOpen(false); }}>Reset demo</Button></div></Modal>}
  </>;
}

export default function App() { return <AppProvider><AppViews /></AppProvider>; }
