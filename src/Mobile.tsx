import { useState } from 'react';
import { useApp } from './store';
import { available, days, distance, money, officeTypes, parking, period, searchSpaces, total, user } from './data';
import type { Filters, Space } from './data';
import { Back, Button, Empty, Facts, Field, Heading, Icon, Link, Notice, Pager, Placeholder, Select, Status } from './components';
import { BookingDetails, Login, NotFound, ServiceFailure } from './shared';

function SearchForm({ partner = false }: { partner?: boolean }) {
  const { officeFilters, parkFilters, setOfficeFilters, setParkFilters, go } = useApp();
  const [draft, setDraft] = useState(partner ? parkFilters : officeFilters);
  const [error, setError] = useState('');
  function update<K extends keyof Filters>(key: K, value: Filters[K]) { setDraft(prev => ({ ...prev, [key]: value })); }
  return <form onSubmit={e => { e.preventDefault(); if (!(days(draft) > 0)) { setError('Choose an end date after the start date.'); return; } setError(''); (partner ? setParkFilters : setOfficeFilters)(draft); go(partner ? 'mobile/parking' : 'mobile/results'); }}><div className="form-grid"><Field className="full" label="City / location" value={draft.city} onChange={e => update('city', e.target.value)} placeholder="Where are you staying?" /><Field label="From" type="date" value={draft.start} onChange={e => update('start', e.target.value)} required /><Field label="Until (exclusive)" type="date" value={draft.end} onChange={e => update('end', e.target.value)} required /><Field className="full" label={partner ? 'Parking name (optional)' : 'Office name (optional)'} value={draft.q} onChange={e => update('q', e.target.value)} placeholder={partner ? 'Search parking...' : 'Search workspace...'} /><Select label={partner ? 'Parking type' : 'Workspace type'} value={draft.type} onChange={v => update('type', v)} options={[[ '', 'Any type'], ...(partner ? ['Covered', 'Outdoor'] : officeTypes)]} />{partner ? <Select label="Distance" value={draft.radius} onChange={v => update('radius', Number(v))} options={[[ '1', 'Within 1 km'], ['3', 'Within 3 km'], ['5', 'Within 5 km'], ['10', 'Within 10 km']]} /> : <Field label="People" type="number" min={1} max={100} value={draft.capacity} onChange={e => update('capacity', Number(e.target.value))} required />}</div><details className="location-options"><summary><Icon name="pin" size={17} /> Search location & distance</summary><div className="form-grid"><Field label="Latitude" type="number" step="any" min={-90} max={90} value={draft.lat} onChange={e => update('lat', Number(e.target.value))} required /><Field label="Longitude" type="number" step="any" min={-180} max={180} value={draft.lng} onChange={e => update('lng', Number(e.target.value))} required />{!partner && <Select label="Within" value={draft.radius} onChange={v => update('radius', Number(v))} options={[[ '1', '1 km'], ['3', '3 km'], ['5', '5 km'], ['10', '10 km'], ['500', '500 km']]} />}</div><p className="caption">Choose the reference point for your distance search.</p></details>{error && <Notice error>{error}</Notice>}<Button className="wide" type="submit" primary><Icon name="search" /> {partner ? 'Update parking results' : 'Find available offices'}</Button></form>;
}

function Search() {
  return <><p className="eyebrow">Hi Alex!</p><h1>Where do you<br />want to work?</h1><p className="muted">A workspace for your next stay.</p><SearchForm /><div className="search-map"><Placeholder map label="Map placeholder" /></div></>;
}

function Results({ partner = false }: { partner?: boolean }) {
  const { offices, bookings, officeFilters, parkFilters, setOfficeFilters, setParkFilters, scenario } = useApp();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(false);
  const f = partner ? parkFilters : officeFilters;
  const records = scenario === 'empty' ? [] : searchSpaces(partner ? parking : offices, f, bookings);
  const activePage = Math.min(page, Math.max(1, Math.ceil(records.length / 2)));
  return <>{!partner && <Back to="mobile/search">Change search</Back>}<h1>{partner ? 'Parking nearby' : 'Available offices'}</h1><p className="muted">{partner ? 'Provided by Parkly · booked with Officely' : 'Find a space that works for you.'}</p><div className="search-summary"><Icon name="pin" /><div><strong>{f.city || 'Any city'} · within {f.radius} km</strong><small>{period(f)}</small></div>{partner && <Button aria-expanded={editing} className="text-button" onClick={() => setEditing(!editing)}>{editing ? 'Close' : 'Edit'}</Button>}</div>{partner && editing && <div className="parking-form"><SearchForm partner key={JSON.stringify(parkFilters)} /></div>}<div className="results-sort"><span>{records.length} available</span><Select label="Sort by" value={f.sort} onChange={v => { (partner ? setParkFilters : setOfficeFilters)(prev => ({ ...prev, sort: v })); setPage(1); }} options={[[ 'name', 'Name A–Z'], ['price', 'Lowest total'], ['distance', 'Nearest first']]} /></div>
    {scenario === 'error' ? <ServiceFailure partner={partner} /> : records.length ? <>{records.slice((activePage - 1) * 2, activePage * 2).map(x => <article className="space-card" key={x.id}><Placeholder label={partner ? 'Parking photo' : 'Office photo'} /><div className="card-content"><div className="card-kicker">{x.type} {partner && '· Parkly'}</div><h2>{x.name}</h2><p className="muted"><Icon name="pin" size={15} /> {x.city} · {distance(x, f).toFixed(1)} km away</p>{!partner && <p className="muted">Up to {x.capacity} people · {x.amenities.split(',')[0]}</p>}<div className="price-line"><strong>{money(total(x, f))}</strong><span>{days(f)} days · total</span></div><Link className="wide" to={`mobile/${partner ? 'park' : 'office'}/${x.id}`}>View details <Icon name="arrow" /></Link></div></article>)}<Pager page={activePage} count={records.length} setPage={setPage} size={2} /></> : <Empty title={partner ? 'No parking found' : 'No offices found'} action={partner ? <Button onClick={() => setEditing(true)}>Change search</Button> : <Link to="mobile/search">Change search</Link>}>Try another location, date range or distance.</Empty>}{partner && <Link className="text-button wide" to="mobile/bookings">Skip parking · My bookings →</Link>}</>;
}

function ItemDetails({ partner = false }: { partner?: boolean }) {
  const { route, offices, officeFilters, parkFilters } = useApp();
  const item = (partner ? parking : offices).find(x => x.id === route.id);
  const f = partner ? parkFilters : officeFilters;
  if (!item) return <NotFound mobile />;
  return <><Back to={`mobile/${partner ? 'parking' : 'results'}`}>{partner ? 'Parking' : 'Search results'}</Back><Placeholder label={partner ? 'Parking photos' : `Office photos (${item.images})`} /><p className="eyebrow">{partner ? 'Parkly · partner offer' : item.type}</p><h1>{item.name}</h1><p className="muted"><Icon name="pin" size={17} /> {item.address}, {item.city}</p><Facts rows={[[ 'Type', item.type], ['Capacity', `${item.capacity} ${partner ? 'car' : 'people'}`], ['Amenities', item.amenities]]} /><h2>About this {partner ? 'space' : 'office'}</h2><p>{item.description}</p><Placeholder map label="Location map" /><div className="booking-total"><p>{period(f)} · {days(f)} days</p><div className="price-line"><strong>{money(total(item, f))}</strong><span>{partner ? 'Total quoted by Parkly' : 'Total for your stay'}</span></div></div><Link to={`mobile/${partner ? 'park-review' : 'review'}/${item.id}`} className="wide" primary>Continue to booking <Icon name="arrow" /></Link></>;
}

function Review({ partner = false }: { partner?: boolean }) {
  const { route, offices, bookings, officeFilters, parkFilters, scenario, setScenario, reserve } = useApp();
  const item = (partner ? parking : offices).find(x => x.id === route.id);
  if (!item) return <NotFound mobile />;
  const f = partner ? parkFilters : officeFilters;
  const conflict = scenario === 'conflict' || !available(item, f, bookings);
  return <><Back to={`mobile/${partner ? 'park' : 'office'}/${item.id}`}>Details</Back><h1>Review your booking</h1><p className="muted">One last look before you reserve.</p><div className="review-item"><Placeholder small label="Photo" /><div><strong>{item.name}</strong><p className="muted">{partner ? 'Parkly parking' : item.type}</p></div></div><Facts rows={[[ 'Provider', partner ? 'Parkly' : 'Officely'], ['From', f.start], ['Until (exclusive)', f.end], ['Duration', `${days(f)} days`], ['Guest', user.name], ['Email', user.email], ['Total', <strong>{money(total(item, f))}</strong>]]} />
    {conflict ? <><Notice error>This space is no longer available for these dates. No reservation was created.</Notice><Link to={`mobile/${partner ? 'parking' : 'results'}`} primary className="wide">Find another space</Link></> : scenario === 'error' ? <><Notice error>We could not complete this booking. No new reservation was created.{partner && ' Your office reservation is unchanged.'}</Notice><Button primary className="wide" onClick={() => setScenario('normal')}>Try again</Button></> : <><Notice>{partner ? 'The total is quoted by Parkly. Your parking will have a separate booking reference.' : 'Review the selected dates and total before confirming.'}</Notice><Button primary className="wide" onClick={() => reserve(item, partner)}>Confirm reservation <Icon name="check" /></Button></>}<Link to={`mobile/${partner ? 'parking' : 'results'}`} className="wide text-button">Back to results</Link>
  </>;
}

function Confirmation({ partner = false }: { partner?: boolean }) {
  const { route, bookings, offices, setParkFilters, go } = useApp();
  const b = bookings.find(x => x.id === route.id && x.email === user.email && x.provider === (partner ? 'Parkly' : 'Officely'));
  if (!b) return <NotFound mobile />;
  const relatedOffice = offices.find(x => x.id === b.itemId);
  return <><div className="confirmation-icon"><Icon name="check" size={38} /></div><h1>{partner ? 'Your parking is booked!' : 'Your office is booked!'}</h1><p className="muted">You're all set, Alex.</p><div className="paper confirmation-paper"><h2>{b.name}</h2><Facts rows={[[ 'Reference', b.id], ['Provider', b.provider], ['Dates', period(b)], ['Total', money(b.total)]]} /></div>{!partner && relatedOffice && <div className="parking-prompt"><Icon name="parking" size={32} /><h2>Need a parking spot?</h2><p>Find parking within 1 km of your office, for the same dates.</p><Button primary className="wide" onClick={() => { setParkFilters(prev => ({ ...prev, q: '', type: '', capacity: 1, start: b.start, end: b.end, city: relatedOffice.city, lat: relatedOffice.lat, lng: relatedOffice.lng, radius: 1 })); go('mobile/parking'); }}>Find nearby parking <Icon name="arrow" /></Button><small>Provided by Parkly</small></div>}<Link className="wide" to="mobile/bookings">{partner ? 'View my bookings' : 'Skip · View my bookings'}</Link></>;
}

function MyBookings() {
  const { bookings, scenario } = useApp();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('start');
  const [page, setPage] = useState(1);
  const records = scenario === 'empty' ? [] : bookings.filter(b => b.email === user.email && `${b.name} ${b.id} ${b.provider}`.toLowerCase().includes(query.toLowerCase()) && (!status || b.status === status)).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : a.start.localeCompare(b.start));
  const activePage = Math.min(page, Math.max(1, Math.ceil(records.length / 3)));
  return <><Heading title="My bookings" subtitle="Your offices and parking, all together." /><div className="form-grid booking-filters"><Field className="full" label="Search bookings" type="search" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="Name or booking reference..." /><Select label="Status" value={status} onChange={v => { setStatus(v); setPage(1); }} options={[[ '', 'All bookings'], 'Confirmed', 'Cancelled']} /><Select label="Sort by" value={sort} onChange={v => { setSort(v); setPage(1); }} options={[[ 'start', 'Start date'], ['name', 'Name A–Z']]} /></div>{scenario === 'error' ? <ServiceFailure /> : records.length ? <>{records.slice((activePage - 1) * 3, activePage * 3).map(b => <article className="reservation-card" key={b.id}><div className="reservation-top"><Icon name={b.provider === 'Parkly' ? 'parking' : 'office'} /><span>{b.provider}</span><Status>{b.status}</Status></div><h2>{b.name}</h2><p className="muted">{period(b)}</p><p className="caption">#{b.id}</p><div className="reservation-bottom"><strong>{money(b.total)}</strong><Link to={`mobile/booking/${b.id}`}>Manage →</Link></div></article>)}<Pager page={activePage} count={records.length} setPage={setPage} /></> : <Empty title="No bookings found" action={<Link to="mobile/search">Find an office</Link>}>Change your filters or book your first workspace.</Empty>}</>;
}

function Account() {
  return <><h1>Your account</h1><div className="profile-avatar"><Icon name="user" size={48} /></div><h2>{user.name}</h2><p className="muted">{user.email}</p><Facts rows={[[ 'Account', 'Demo customer']]} /><div className="actions stacked"><Link primary to="mobile/bookings">My bookings</Link><Link to="mobile/login"><Icon name="logout" /> Sign out</Link></div></>;
}

export default function Mobile() {
  const { route } = useApp();
  let content;
  switch (route.page) {
    case 'login': content = <Login />; break;
    case 'search': content = <Search />; break;
    case 'results': content = <Results />; break;
    case 'office': content = <ItemDetails />; break;
    case 'review': content = <Review />; break;
    case 'confirmed': content = <Confirmation />; break;
    case 'parking': content = <Results partner />; break;
    case 'park': content = <ItemDetails partner />; break;
    case 'park-review': content = <Review partner />; break;
    case 'park-confirmed': content = <Confirmation partner />; break;
    case 'bookings': content = <MyBookings />; break;
    case 'booking': case 'cancel': content = <BookingDetails />; break;
    case 'profile': content = <Account />; break;
    default: content = <NotFound mobile />;
  }
  const active = ['booking', 'bookings', 'cancel'].includes(route.page) ? 'bookings' : route.page.includes('park') ? 'parking' : route.page === 'profile' ? 'profile' : 'search';
  return <main className="mobile-canvas"><div className="phone-frame"><div className="phone-status"><span>9:41</span><div className="speaker" /><span>▰ 100%</span></div><header className="phone-header"><a href="#mobile/search" className="app-logo"><Icon name="office" size={27} /><strong>officely</strong></a>{route.page !== 'login' && <a className="avatar" href="#mobile/profile" aria-label="Your account"><Icon name="user" size={19} /></a>}</header><div className="phone-content" key={`${route.page}/${route.id}`}>{content}</div>{route.page !== 'login' && <nav className="mobile-tabs" aria-label="Mobile navigation">{[['search', 'office', 'Offices'], ['parking', 'parking', 'Parking'], ['bookings', 'book', 'Bookings'], ['profile', 'user', 'Account']].map(([path, icon, label]) => <a key={path} href={`#mobile/${path}`} className={active === path ? 'active' : ''}><Icon name={icon} size={22} /><span>{label}</span></a>)}</nav>}<div className="phone-home" /></div><p className="phone-caption">Officely mobile · clickable wireframe</p></main>;
}
