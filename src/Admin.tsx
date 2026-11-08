import { useState } from 'react';
import { useApp } from './store';
import { money, officeTypes, period } from './data';
import type { Space } from './data';
import { Back, Button, Empty, Facts, Field, Heading, Icon, Link, Modal, Notice, Pager, Placeholder, Select, Status } from './components';
import { BookingDetails, Login, NotFound, ServiceFailure } from './shared';

function OfficeList() {
  const { offices, scenario } = useApp();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const records = scenario === 'empty' ? [] : offices.filter(x => `${x.name} ${x.city} ${x.address}`.toLowerCase().includes(query.toLowerCase()) && (!status || String(x.active) === status)).sort((a, b) => sort === 'price' ? a.rate - b.rate : sort === 'city' ? a.city.localeCompare(b.city) : a.name.localeCompare(b.name));
  const activePage = Math.min(page, Math.max(1, Math.ceil(records.length / 3)));
  return <><Heading title="Office spaces" subtitle="View and manage your workspaces."><Link to="admin/edit/new" primary><Icon name="plus" /> Add office</Link></Heading><div className="inventory-summary"><span><strong>{offices.length}</strong> total spaces</span><span><strong>{offices.filter(x => x.active).length}</strong> active</span><span><strong>{offices.filter(x => !x.active).length}</strong> inactive</span></div><div className="filter-bar"><Field label="Search offices" placeholder="Search name, city or address..." type="search" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} /><Select label="Status" value={status} onChange={v => { setStatus(v); setPage(1); }} options={[[ '', 'All statuses'], ['true', 'Active'], ['false', 'Inactive']]} /><Select label="Sort by" value={sort} onChange={v => { setSort(v); setPage(1); }} options={[[ 'name', 'Name A–Z'], ['city', 'City'], ['price', 'Hourly price']]} /></div>
    {scenario === 'error' ? <ServiceFailure /> : records.length ? <><div className="table-scroll"><table><thead><tr><th>Office</th><th>Location</th><th>Type / capacity</th><th>Price / hour</th><th>Status</th><th>Actions</th></tr></thead><tbody>{records.slice((activePage - 1) * 3, activePage * 3).map(x => <tr key={x.id}><td><div className="table-office"><Placeholder small label="Photo" /><a href={`#admin/office/${x.id}`}><strong>{x.name}</strong><small>{x.id.toUpperCase()}</small></a></div></td><td>{x.city}<small>{x.address}</small></td><td>{x.type}<small>{x.capacity} people</small></td><td>{money(x.rate)}</td><td><Status>{x.active ? 'Active' : 'Inactive'}</Status></td><td><div className="row-actions"><a href={`#admin/office/${x.id}`}>View</a><a href={`#admin/edit/${x.id}`} aria-label={`Edit ${x.name}`}><Icon name="edit" size={18} /></a></div></td></tr>)}</tbody></table></div><Pager page={activePage} count={records.length} setPage={setPage} /></> : <Empty title="No offices found" action={<Button onClick={() => { setQuery(''); setStatus(''); }}>Clear filters</Button>}>Try a different search, or add a new office.</Empty>}
  </>;
}

function OfficeDetails() {
  const { route, offices, bookings, setOffices, go, notify } = useApp();
  const x = offices.find(o => o.id === route.id);
  if (!x) return <NotFound />;
  const blocked = bookings.some(b => b.itemId === x.id && b.status === 'Confirmed');
  return <><Back to="admin/offices">All offices</Back><Heading title={x.name} subtitle={`${x.address}, ${x.city}`}><Status>{x.active ? 'Active' : 'Inactive'}</Status></Heading><div className="details-grid"><div><Placeholder label={x.images ? `Office photos (${x.images})` : 'No photos yet'} /><div className="thumbs">{Array.from({ length: x.images }, (_, i) => <Placeholder key={i} small label={`Photo ${i + 1}`} />)}</div><h2>About this space</h2><p>{x.description}</p><h2>Amenities</h2><p>{x.amenities}</p></div><div className="paper"><h2>Office details</h2><Facts rows={[[ 'Workspace type', x.type], ['Capacity', `${x.capacity} people`], ['Price per hour', money(x.rate)]]} /><Placeholder map label="Location map" /><div className="actions"><Link to={`admin/edit/${x.id}`} primary><Icon name="edit" /> Edit office</Link><Link to={`admin/bookings/${x.id}`}>View bookings</Link></div></div></div><div className="bottom-actions"><Link to={`admin/remove/${x.id}`}>Remove office</Link></div>
    {route.page === 'remove' && <Modal title={blocked ? 'This office has active bookings' : 'Remove this office?'} close={() => go(`admin/office/${x.id}`)}><p>{x.name}</p><Notice>{blocked ? 'Keep existing reservations safe. Set the listing to inactive to prevent new bookings, or resolve its confirmed reservations first.' : 'This office will no longer appear in searches. Reservation history will be retained.'}</Notice><div className="actions"><Button onClick={() => go(`admin/office/${x.id}`)}>Keep office</Button>{blocked ? <Link primary to={`admin/edit/${x.id}`}>Edit listing status</Link> : <Button primary onClick={() => { setOffices(prev => prev.filter(o => o.id !== x.id)); go('admin/offices'); notify('Office removed.'); }}>Remove office</Button>}</div></Modal>}
  </>;
}

function OfficeEditor() {
  const { route, offices, setOffices, go, notify } = useApp();
  const existing = offices.find(x => x.id === route.id);
  const [draft, setDraft] = useState<Space>(() => existing ? { ...existing } : { id: '', name: '', city: 'Warsaw', address: '', lat: 52.2297, lng: 21.0122, type: 'Private office', capacity: 1, rate: 20, images: 0, active: true, amenities: '', description: '' });
  if (route.id !== 'new' && !existing) return <NotFound />;
  function update<K extends keyof Space>(key: K, value: Space[K]) { setDraft(prev => ({ ...prev, [key]: value })); }
  return <><Back to={existing ? `admin/office/${existing.id}` : 'admin/offices'}>Back to offices</Back><Heading title={existing ? 'Edit office' : 'Add an office'} subtitle="A few details about your workspace." /><form onSubmit={e => { e.preventDefault(); if (![draft.name, draft.city, draft.address, draft.description].every(x => x.trim())) { notify('Please complete the required fields.'); return; } const record = { ...draft, id: existing?.id || `o-${crypto.randomUUID().slice(0, 8)}` }; setOffices(prev => existing ? prev.map(x => x.id === existing.id ? record : x) : [...prev, record]); go(`admin/office/${record.id}`); notify('Office saved.'); }}><div className="editor-grid"><section className="paper"><h2>Basic information</h2><div className="form-grid"><Field className="full" label="Office name" name="name" value={draft.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Central studio" required maxLength={100} /><Select label="Workspace type" value={draft.type} onChange={v => update('type', v)} options={officeTypes} /><Field label="Capacity (people)" name="capacity" type="number" min={1} max={100} value={draft.capacity} onChange={e => update('capacity', Number(e.target.value))} required /><Field label="Price per hour (PLN)" name="rate" type="number" min={1} value={draft.rate} onChange={e => update('rate', Number(e.target.value))} required /><Select label="Listing status" value={String(draft.active)} onChange={v => update('active', v === 'true')} options={[[ 'true', 'Active'], ['false', 'Inactive']]} /><label className="field full"><span>Description</span><textarea name="description" value={draft.description} onChange={e => update('description', e.target.value)} required placeholder="Describe the space..." /></label><Field className="full" label="Amenities" value={draft.amenities} onChange={e => update('amenities', e.target.value)} placeholder="Wi-Fi, monitor, kitchen..." /></div><h2 className="section-divider">Location</h2><div className="form-grid"><Field label="City" name="city" value={draft.city} onChange={e => update('city', e.target.value)} required /><Field label="Street address" name="address" value={draft.address} onChange={e => update('address', e.target.value)} required /></div><p className="caption">Production will resolve map coordinates from this address; users will not enter latitude or longitude.</p></section><section className="paper"><h2>Office photos</h2><div className="image-list">{draft.images === 0 && <Placeholder label="Image placeholder" />}{Array.from({ length: draft.images }, (_, i) => <div key={i}><Placeholder label={`Photo ${i + 1}`} /><Button className="text-button" aria-label={`Remove image ${i + 1}`} onClick={() => update('images', draft.images - 1)}>Remove photo</Button></div>)}</div><Button onClick={() => update('images', draft.images + 1)} disabled={draft.images >= 3}><Icon name="plus" /> Add image placeholder</Button><p className="caption">Photo upload placeholder · up to 3 images</p><h2 className="section-divider">Map preview</h2><Placeholder map label="Location placeholder" /></section></div><div className="actions form-actions"><Link to={existing ? `admin/office/${existing.id}` : 'admin/offices'}>Discard changes</Link><Button primary type="submit">Save office <Icon name="check" /></Button></div></form></>;
}

function BookingList() {
  const { route, offices, bookings, scenario } = useApp();
  const [query, setQuery] = useState(offices.find(x => x.id === route.id)?.name || '');
  const [source, setSource] = useState('');
  const [sort, setSort] = useState('start');
  const [page, setPage] = useState(1);
  const records = scenario === 'empty' ? [] : bookings.filter(b => b.provider === 'Officely' && `${b.name} ${b.id} ${b.customer} ${b.email}`.toLowerCase().includes(query.toLowerCase()) && (!source || b.source === source)).sort((a, b) => sort === 'customer' ? a.customer.localeCompare(b.customer) : sort === 'source' ? a.source.localeCompare(b.source) : a.start.localeCompare(b.start));
  const activePage = Math.min(page, Math.max(1, Math.ceil(records.length / 4)));
  return <><Heading title="Bookings" subtitle="Office reservations from Officely and partner apps." /><div className="filter-bar"><Field label="Search bookings" type="search" placeholder="Reference, office or customer..." value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} /><Select label="Booked through" value={source} onChange={v => { setSource(v); setPage(1); }} options={[[ '', 'All systems'], 'Officely mobile', 'Flatly']} /><Select label="Sort by" value={sort} onChange={v => { setSort(v); setPage(1); }} options={[[ 'start', 'Start date'], ['customer', 'Customer'], ['source', 'Source system']]} /></div>{scenario === 'error' ? <ServiceFailure /> : records.length ? <><div className="table-scroll"><table><thead><tr><th>Booking / office</th><th>Dates and daily hours</th><th>Customer</th><th>Booked through</th><th>Status</th></tr></thead><tbody>{records.slice((activePage - 1) * 4, activePage * 4).map(b => <tr key={b.id}><td><a href={`#admin/booking/${b.id}`}>{b.id}</a><small>{b.name}</small></td><td>{period(b)}</td><td>{b.customer}<small>{b.email}</small></td><td>{b.source}</td><td><Status>{b.status}</Status></td></tr>)}</tbody></table></div><Pager page={activePage} count={records.length} setPage={setPage} size={4} /></> : <Empty title="No matching bookings" action={<Button onClick={() => { setQuery(''); setSource(''); }}>Clear filters</Button>}>Try another reference, customer or source.</Empty>}</>;
}

export default function Admin() {
  const { route } = useApp();
  const bookingsTab = ['bookings', 'booking', 'cancel'].includes(route.page);
  let content;
  switch (route.page) {
    case 'offices': content = <OfficeList />; break;
    case 'office': case 'remove': content = <OfficeDetails />; break;
    case 'edit': content = <OfficeEditor key={route.id} />; break;
    case 'bookings': content = <BookingList key={route.id} />; break;
    case 'booking': case 'cancel': content = <BookingDetails />; break;
    case 'login': return <main className="admin-login"><Login admin /></main>;
    default: content = <NotFound />;
  }
  return <div className="admin-shell"><aside className="admin-sidebar"><a className="app-logo" href="#admin/offices"><Icon name="office" size={36} /><strong>officely</strong></a><span className="sidebar-label">Admin panel</span><nav aria-label="Admin navigation"><a className={!bookingsTab ? 'active' : ''} href="#admin/offices"><Icon name="grid" /> Office spaces</a><a className={bookingsTab ? 'active' : ''} href="#admin/bookings"><Icon name="book" /> Bookings</a></nav><div className="sidebar-bottom"><span className="avatar"><Icon name="user" /></span><div><strong>Admin</strong><small>Officely team</small></div><a href="#admin/login" aria-label="Sign out"><Icon name="logout" /></a></div></aside><div className="admin-main"><header className="admin-topbar"><span>Admin / {bookingsTab ? 'Bookings' : 'Office spaces'}</span><span className="draft-badge">Wireframe draft</span></header><main className="admin-content">{content}</main><footer className="app-footer">officely · office management <span>Sample data</span></footer></div></div>;
}
