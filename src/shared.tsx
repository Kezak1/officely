import { Back, Button, Empty, Facts, Heading, Icon, Link, Modal, Notice, Status } from './components';
import { useApp } from './store';
import { money, period, user } from './data';

export function Login({ admin = false }: { admin?: boolean }) {
  const { go } = useApp();
  return <div className="login-card"><div className="login-logo"><Icon name="office" size={48} /><strong>officely</strong></div><h1>{admin ? 'Admin sign in' : 'Welcome back!'}</h1><p className="muted">{admin ? 'Your offices. Your bookings. All here.' : 'Your next workspace is waiting.'}</p><form onSubmit={e => { e.preventDefault(); go(admin ? 'admin/offices' : 'mobile/search'); }}><label className="field"><span>Email address</span><input type="email" defaultValue={admin ? 'admin@example.test' : 'alex@example.test'} required /></label><label className="field"><span>Password</span><input type="password" defaultValue="prototype" required /></label><Button primary type="submit">Sign in <Icon name="arrow" /></Button></form><p className="caption">Demo sign-in · use the sample details</p></div>;
}
export function NotFound({ mobile = false }: { mobile?: boolean }) { return <Empty title="Nothing here yet" action={<Link to={mobile ? 'mobile/search' : 'admin/offices'}>Back to {mobile ? 'search' : 'offices'}</Link>}>The item or screen could not be found.</Empty>; }
export function ServiceFailure({ partner = false }: { partner?: boolean }) {
  const { setScenario } = useApp();
  return <Empty title={partner ? 'Parking is temporarily unavailable' : 'Something went wrong'} action={<div className="actions"><Button primary onClick={() => setScenario('normal')}>Try again</Button>{partner && <Link to="mobile/bookings">My bookings</Link>}</div>}>{partner ? 'We could not reach Parkly. Your office booking is unchanged.' : 'We could not load this information. Your data is unchanged.'}</Empty>;
}
export function BookingDetails() {
  const { route, bookings, go, cancel, scenario, setScenario } = useApp();
  const mobile = route.mode === 'mobile';
  const b = bookings.find(x => x.id === route.id);
  if (!b || (mobile ? b.email !== user.email : b.provider !== 'Officely')) return <NotFound mobile={mobile} />;
  return <><Back to={`${route.mode}/bookings`}>{mobile ? 'My bookings' : 'All bookings'}</Back><Heading title={b.name} subtitle={`Booking #${b.id}`}><Status>{b.status}</Status></Heading><div className="booking-paper"><div className="section-heading"><Icon name={b.provider === 'Parkly' ? 'parking' : 'office'} /><h2>Reservation details</h2></div><Facts rows={[
    ['Provider', b.provider], ['Booked through', b.source], ['From', b.start], ['Until (exclusive)', b.end], ['Customer', b.customer], ['Email', b.email], ['Total for period', <strong>{money(b.total)}</strong>],
  ]} />{b.provider === 'Parkly' && <p className="muted">Parking provided by Parkly. Manage it here in Officely.</p>}{b.status === 'Confirmed' ? <div className="actions"><Link to={`${route.mode}/cancel/${b.id}`}>Cancel booking</Link></div> : <Notice>This reservation is cancelled. Your other bookings are unchanged.</Notice>}</div>
    {route.page === 'cancel' && b.status === 'Confirmed' && <Modal title="Cancel this booking?" close={() => go(`${route.mode}/booking/${b.id}`)}><p><strong>{b.name}</strong><br />{period(b)}<br />Reference: {b.id}</p><Notice>Only this reservation will be cancelled. {mobile ? 'Your other office or parking bookings will stay booked.' : 'The customer and originating system need the updated status.'}</Notice>{scenario === 'error' && <Notice error>Cancellation failed. This booking is still active.</Notice>}<div className="actions"><Button onClick={() => go(`${route.mode}/booking/${b.id}`)}>Keep booking</Button>{scenario === 'error' ? <Button primary onClick={() => setScenario('normal')}>Retry</Button> : <Button primary onClick={() => cancel(b.id)}>Confirm cancellation</Button>}</div></Modal>}
  </>;
}
