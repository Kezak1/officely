/* Phase-one wireframes. All records and interactions are local, in-memory simulations. */
'use strict';

const screens = {
  admin: [
    ['A01', 'login', 'Admin sign-in', 'Authenticate an administrator before opening the operations panel.', 'Sign in → office inventory. Authentication and role checks are simulated.'],
    ['A02', 'offices', 'Office inventory', 'View, search, sort and page through office spaces.', 'Open an office, add one, or switch to bookings. Production requires server-side search, sorting and pagination.'],
    ['A03', 'office', 'Office details', 'Inspect office metadata, images, location, availability and price.', 'Edit the office, inspect its bookings, or open the removal confirmation.'],
    ['A04', 'edit', 'Add / edit office', 'Manage name, location, coordinates, capacity, type, price, images and availability.', 'Save → office details. Image controls represent uploads; no files are uploaded.'],
    ['A05', 'bookings', 'All bookings', 'Review office reservations from Officely and partner Flatly.', 'Search, sort, page, filter by source, then open a booking. Parkly owns parking reservations.'],
    ['A06', 'booking', 'Booking details', 'See the booking period, customer, source system and status.', 'Open optional administrator cancellation. Source and owner are separate fields.'],
    ['A07', 'cancel', 'Cancel reservation', 'Review the impact before cancelling an office reservation.', 'Confirm → booking details. Partner-origin cancellations need a future notification/synchronization contract.'],
    ['A08', 'remove', 'Remove office', 'Confirm removal of an office from the inventory.', 'Removal is blocked while active bookings exist. Deactivating an office keeps existing bookings.'],
  ],
  mobile: [
    ['M01', 'login', 'Customer sign-in', 'Authenticate a customer to access their own bookings.', 'Use the demo account → find an office. Account creation/reset are scope questions.'],
    ['M02', 'search', 'Find an office', 'Choose dates, name, city, coordinates, radius, type and capacity.', 'Search → available offices. Search has a date check and editable reference coordinates.'],
    ['M03', 'results', 'Available offices', 'Show only matching offices available for the selected period.', 'Open an office. Prices are totals for the selected period; occupied offices are excluded.'],
    ['M04', 'office', 'Office details', 'Review photos, amenities, location, capacity and the period total.', 'Continue → review the reservation, or return to results.'],
    ['M05', 'review', 'Review office booking', 'Confirm office, dates, customer and total before reserving.', 'Reserve → confirmation. Try the availability-conflict state before booking.'],
    ['M06', 'confirmed', 'Office confirmed', 'Show a booking reference and offer nearby parking.', 'Find Parkly parking near this office, or go to my bookings. Parking is optional.'],
    ['M07', 'parking', 'Find nearby parking', 'Search Parkly availability using inherited office dates and a 1 km radius.', 'Change search criteria, open a parking spot, or skip. Prices represent a mocked Parkly quote.'],
    ['M08', 'park', 'Parking details', 'Review the partner offer, location and quoted period total.', 'Continue → review the parking reservation. Parkly remains the provider.'],
    ['M09', 'park-review', 'Review parking', 'Confirm the Parkly quote and the customer details.', 'Reserve → parking confirmation. A partner failure must leave the office reservation intact.'],
    ['M10', 'park-confirmed', 'Parking confirmed', 'Confirm the separate partner reservation.', 'Go to my bookings to see both reservations. They can be cancelled independently.'],
    ['M11', 'bookings', 'My bookings', 'Show only this demo customer’s office and parking reservations.', 'Open either booking, filter by status, search, sort or page through records.'],
    ['M12', 'booking', 'Booking details', 'Show the provider, reference, dates, total and current status.', 'Cancel an active office or partner booking from within Officely.'],
    ['M13', 'cancel', 'Cancel booking', 'Confirm cancellation and explain its scope.', 'Cancel only this reservation; the other service remains booked. Failed requests keep the active status.'],
    ['M14', 'profile', 'Account', 'Identify the signed-in customer and offer sign-out.', 'Sign out → customer sign-in. This screen is a proposed support screen.'],
  ],
};

const initialOffices = [
  { id: 'o1', name: 'Central studio', city: 'Warsaw', address: 'Marszałkowska 80', lat: 52.228, lng: 21.012, type: 'Private office', capacity: 4, rate: 180, images: 2, active: true, amenities: 'Wi-Fi, monitor, quiet room', description: 'A quiet office for a small remote team, close to public transport.' },
  { id: 'o2', name: 'Riverside desk', city: 'Warsaw', address: 'Dobra 42', lat: 52.24, lng: 21.025, type: 'Coworking desk', capacity: 1, rate: 65, images: 1, active: true, amenities: 'Wi-Fi, shared kitchen', description: 'A desk in an open coworking area near the river.' },
  { id: 'o3', name: 'North meeting room', city: 'Warsaw', address: 'Andersa 20', lat: 52.252, lng: 21.0, type: 'Meeting room', capacity: 8, rate: 250, images: 1, active: true, amenities: 'Wi-Fi, screen, whiteboard', description: 'A meeting room for collaborative work and workshops.' },
  { id: 'o4', name: 'West team office', city: 'Warsaw', address: 'Prosta 51', lat: 52.23, lng: 20.988, type: 'Private office', capacity: 6, rate: 220, images: 0, active: false, amenities: 'Wi-Fi, kitchen', description: 'Temporarily unavailable while the space is being updated.' },
  { id: 'o5', name: 'Old Town workspace', city: 'Krakow', address: 'Długa 12', lat: 50.068, lng: 19.94, type: 'Coworking desk', capacity: 2, rate: 90, images: 1, active: true, amenities: 'Wi-Fi, coffee', description: 'Shared desks near the historic centre.' },
];
const parking = [
  { id: 'p1', name: 'Centrum covered parking', city: 'Warsaw', address: 'Nowogrodzka 35', lat: 52.226, lng: 21.01, type: 'Covered', capacity: 1, rate: 35, images: 1, active: true, amenities: '24/7 access, covered space', description: 'A covered parking space within walking distance of Central studio.' },
  { id: 'p2', name: 'City courtyard parking', city: 'Warsaw', address: 'Żurawia 22', lat: 52.229, lng: 21.016, type: 'Outdoor', capacity: 1, rate: 25, images: 1, active: true, amenities: 'Gated, 24/7 access', description: 'An outdoor space in a gated courtyard.' },
  { id: 'p3', name: 'Station parking', city: 'Warsaw', address: 'Emilii Plater 40', lat: 52.232, lng: 21.002, type: 'Covered', capacity: 1, rate: 30, images: 1, active: true, amenities: 'Covered space', description: 'Parking near the central station.' },
];
const demoUser = { name: 'Alex Morgan', email: 'alex@example.test' };
const initialBookings = [
  { id: 'OFF-1042', itemId: 'o1', provider: 'Officely', source: 'Officely mobile', name: 'Central studio', start: '2026-11-15', end: '2026-11-18', total: 540, customer: demoUser.name, email: demoUser.email, status: 'Confirmed' },
  { id: 'OFF-1041', itemId: 'o2', provider: 'Officely', source: 'Flatly', name: 'Riverside desk', start: '2026-12-01', end: '2026-12-08', total: 455, customer: 'Sam Lee', email: 'sam@example.test', status: 'Confirmed' },
  { id: 'PRK-2081', itemId: 'p3', provider: 'Parkly', source: 'Officely mobile', name: 'Station parking', start: '2026-11-15', end: '2026-11-18', total: 90, customer: demoUser.name, email: demoUser.email, status: 'Confirmed' },
  { id: 'OFF-1038', itemId: 'o3', provider: 'Officely', source: 'Flatly', name: 'North meeting room', start: '2026-11-18', end: '2026-11-20', total: 500, customer: 'Robin Kim', email: 'robin@example.test', status: 'Confirmed' },
  { id: 'OFF-1033', itemId: 'o5', provider: 'Officely', source: 'Officely mobile', name: 'Old Town workspace', start: '2026-10-10', end: '2026-10-12', total: 180, customer: demoUser.name, email: demoUser.email, status: 'Cancelled' },
];
const defaultFilters = () => ({ q: '', city: 'Warsaw', start: '2026-12-01', end: '2026-12-08', lat: 52.2297, lng: 21.0122, radius: 5, type: '', capacity: 1, sort: 'name' });
function freshState() {
  return { offices: structuredClone(initialOffices), bookings: structuredClone(initialBookings), officeFilters: defaultFilters(), parkFilters: { ...defaultFilters(), radius: 1 }, adminFilters: { q: '', sort: 'name', source: '', page: 1 }, bookingFilters: { q: '', sort: 'start', source: '', page: 1 }, myFilters: { q: '', sort: 'start', status: '', page: 1 }, resultsPage: 1, parkPage: 1, officeId: 'o1', parkId: 'p1', adminBookingId: 'OFF-1042', mobileBookingId: 'OFF-1042', lastOfficeId: null, lastParkId: null, scenario: 'normal', images: 2, counter: 1050 };
}
let state = freshState();
let current = { mode: 'map', page: '', id: '' };
let toastTimer;
const workspace = document.getElementById('workspace');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = value => new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(value) + ' PLN';
const days = f => Math.round((Date.parse(f.end) - Date.parse(f.start)) / 86400000);
const period = f => `${f.start} → ${f.end}`;
const total = (item, f) => item.rate * days(f);
const office = () => state.offices.find(x => x.id === state.officeId) || state.offices[0];
const park = () => parking.find(x => x.id === state.parkId) || parking[0];
const selectedBooking = () => state.bookings.find(x => x.id === (current.mode === 'admin' ? state.adminBookingId : state.mobileBookingId));
const link = (text, path, style = '') => `<a class="button ${style}" href="#${path}">${esc(text)}</a>`;
const action = (text, name, style = '', attrs = '') => `<button class="${style}" data-action="${name}" ${attrs}>${esc(text)}</button>`;
const placeholder = (text = 'IMAGE PLACEHOLDER') => `<div class="placeholder"><span>${esc(text)}</span></div>`;
const facts = pairs => `<dl class="facts">${pairs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
const notice = text => `<div class="notice">${esc(text)}</div>`;
const input = (label, name, value, type = 'text', attrs = '') => `<label>${esc(label)}<input name="${name}" type="${type}" value="${esc(value)}" ${attrs}></label>`;
const select = (label, name, value, opts) => `<label>${esc(label)}<select name="${name}">${opts.map(([v, t]) => `<option value="${esc(v)}" ${String(value) === String(v) ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`;
const back = (text, path) => `<a class="button back" href="#${path}">← ${esc(text)}</a>`;
function announce(message) {
  const el = document.getElementById('announcement');
  el.textContent = message; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 5000);
}
function go(path) {
  state.scenario = 'normal';
  if (location.hash === '#' + path) render(); else location.hash = path;
}
function distance(item, f) {
  const rad = n => n * Math.PI / 180;
  const a = Math.sin(rad(item.lat - Number(f.lat)) / 2) ** 2 + Math.cos(rad(Number(f.lat))) * Math.cos(rad(item.lat)) * Math.sin(rad(item.lng - Number(f.lng)) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function available(item, f) {
  return item.active && !state.bookings.some(b => b.itemId === item.id && b.status === 'Confirmed' && b.start < f.end && b.end > f.start);
}
function filteredItems(items, f) {
  return items.filter(x => available(x, f) && x.name.toLowerCase().includes(f.q.toLowerCase()) && x.city.toLowerCase().includes(f.city.toLowerCase()) && distance(x, f) <= Number(f.radius) && (!f.type || x.type === f.type) && x.capacity >= Number(f.capacity || 1)).sort((a, b) => f.sort === 'price' ? total(a, f) - total(b, f) : f.sort === 'distance' ? distance(a, f) - distance(b, f) : a.name.localeCompare(b.name));
}
function pagination(page, count, key, size = 3) {
  const pages = Math.max(1, Math.ceil(count / size));
  return `<div class="pagination"><span>${count} results · page ${page} / ${pages}</span><div>${action('←', 'page', '', `aria-label="Previous page" data-key="${key}" data-delta="-1" ${page <= 1 ? 'disabled' : ''}`)} ${action('→', 'page', '', `aria-label="Next page" data-key="${key}" data-delta="1" ${page >= pages ? 'disabled' : ''}`)}</div></div>`;
}
function emptyState(title, description, path, label = 'Change search') {
  return `<div class="empty"><div class="empty-symbol">∅</div><h3>${esc(title)}</h3><p class="subtle">${esc(description)}</p><div class="actions">${path ? link(label, path) : action('Try again', 'retry')}</div></div>`;
}
function errorState(partner = false) {
  return `<div class="empty"><div class="empty-symbol">!</div><h3>${partner ? 'Parking is temporarily unavailable' : 'Unable to load this view'}</h3><p class="subtle">${partner ? 'Parkly could not be reached. Your office booking is unchanged.' : 'Your data has not changed. Please try again.'}</p><div class="actions">${action('Try again', 'retry', 'primary')}${partner ? link('Go to my bookings', 'mobile/bookings') : ''}</div></div>`;
}
function searchFields(f, isParking = false) {
  return `<div class="form-grid"><div class="full">${input(isParking ? 'Parking name (optional)' : 'Office name (optional)', 'q', f.q)}</div><div class="full">${input('City / location', 'city', f.city)}</div>${input('From', 'start', f.start, 'date', 'required')}${input('Until (exclusive)', 'end', f.end, 'date', 'required')}${input('Reference latitude', 'lat', f.lat, 'number', 'step="any" min="-90" max="90" required')}${input('Reference longitude', 'lng', f.lng, 'number', 'step="any" min="-180" max="180" required')}${select('Within', 'radius', f.radius, [[1, '1 km'], [3, '3 km'], [5, '5 km'], [10, '10 km'], [500, '500 km']])}${select(isParking ? 'Parking type' : 'Workspace type', 'type', f.type, isParking ? [['', 'Any type'], ['Covered', 'Covered'], ['Outdoor', 'Outdoor']] : [['', 'Any type'], ['Private office', 'Private office'], ['Coworking desk', 'Coworking desk'], ['Meeting room', 'Meeting room']])}${isParking ? '' : input('People (minimum capacity)', 'capacity', f.capacity, 'number', 'min="1" max="100" required')}${select('Sort results', 'sort', f.sort, [['name', 'Name A–Z'], ['price', 'Total price: lowest'], ['distance', 'Nearest first']])}</div>`;
}
function login(isMobile) {
  return `<div class="auth"><div class="section-label">${isMobile ? 'YOUR WORKDAY, ANYWHERE' : 'OFFICELY OPERATIONS'}</div><h2>${isMobile ? 'Find your next workspace.' : 'Admin sign-in'}</h2><p class="subtle">${isMobile ? 'Book an office. Add nearby parking. Keep everything in one place.' : 'Manage office spaces and their reservations.'}</p><form data-form="login"><div class="form-grid" style="margin-top:24px">${input('Demo email', 'email', isMobile ? demoUser.email : 'admin@example.test', 'email', 'required')}${input('Demo password', 'password', 'prototype', 'password', 'required')}</div><div class="actions"><button class="primary">${isMobile ? 'Continue as Alex' : 'Open admin panel'}</button></div></form>${notice('Simulated sign-in. Use the prefilled demo values; do not enter real credentials.')}</div>`;
}
function adminOffices() {
  const f = state.adminFilters;
  let records = state.offices.filter(x => `${x.name} ${x.city} ${x.address}`.toLowerCase().includes(f.q.toLowerCase()));
  records.sort((a, b) => f.sort === 'rate' ? a.rate - b.rate : f.sort === 'city' ? a.city.localeCompare(b.city) : a.name.localeCompare(b.name));
  if (state.scenario === 'empty') records = [];
  const page = Math.min(f.page, Math.max(1, Math.ceil(records.length / 3))); f.page = page;
  return `<div class="page-heading"><div><h2>Office spaces</h2><p class="subtle">Manage your workspace inventory.</p></div>${link('+ Add office', 'admin/edit/new', 'primary')}</div><div class="metrics"><div class="metric"><span>Total spaces</span><strong>${state.offices.length}</strong></div><div class="metric"><span>Active listings</span><strong>${state.offices.filter(x => x.active).length}</strong></div><div class="metric"><span>Confirmed bookings</span><strong>${state.bookings.filter(x => x.provider === 'Officely' && x.status === 'Confirmed').length}</strong></div></div><form class="toolbar" data-form="admin-search">${input('Search offices', 'q', f.q, 'search', 'placeholder="Name, city or address"')}${select('Sort by', 'sort', f.sort, [['name', 'Name A–Z'], ['city', 'City'], ['rate', 'Daily price']])}<button>Apply</button></form>${state.scenario === 'error' ? errorState() : !records.length ? emptyState('No offices found', 'Try another search or add an office.', 'admin/edit/new', 'Add office') : `<div class="table-wrap"><table><thead><tr><th>Office / location</th><th>Type / capacity</th><th>Per day</th><th>Status</th><th>Action</th></tr></thead><tbody>${records.slice((page - 1) * 3, page * 3).map(x => `<tr><td><strong>${esc(x.name)}</strong><small>${esc(x.city)} · ${esc(x.address)}</small></td><td>${esc(x.type)}<small>${x.capacity} people</small></td><td>${money(x.rate)}</td><td><span class="status">${x.active ? 'Active' : 'Inactive'}</span></td><td><a href="#admin/office/${x.id}">View →</a></td></tr>`).join('')}</tbody></table></div>${pagination(page, records.length, 'adminFilters')}`}`;
}
function adminOffice() {
  const x = office();
  if (!x) return emptyState('No offices yet', 'Add your first office to begin.', 'admin/edit/new', 'Add office');
  return `${back('Office spaces', 'admin/offices')}<div class="page-heading"><div><h2>${esc(x.name)}</h2><p class="subtle">${esc(x.address)}, ${esc(x.city)}</p></div><span class="status">${x.active ? 'Active' : 'Inactive'}</span></div><div class="detail-grid"><div>${placeholder(`${x.images} IMAGE SLOT${x.images === 1 ? '' : 'S'}`)}<p class="subtle">${esc(x.description)}</p>${placeholder('LOCATION / MAP PLACEHOLDER')}</div><div>${facts([['Type', x.type], ['Capacity', x.capacity + ' people'], ['Daily price', money(x.rate)], ['Coordinates', `${x.lat}, ${x.lng}`], ['Amenities', x.amenities]])}</div></div><div class="actions">${link('Edit office', 'admin/edit/' + x.id, 'primary')}${action('View its bookings', 'office-bookings')}${link('Remove office', 'admin/remove/' + x.id)}</div>`;
}
function imageSlots() {
  return Array.from({ length: state.images }, (_, i) => `<div class="image-slot">${placeholder('IMAGE ' + (i + 1))}${action('Remove', 'remove-image', '', `data-index="${i}" aria-label="Remove image ${i + 1}"`)}</div>`).join('') || '<p class="subtle">No images added yet.</p>';
}
function adminEdit() {
  const isNew = current.id === 'new';
  const x = isNew ? { name: '', city: 'Warsaw', address: '', lat: 52.2297, lng: 21.0122, type: 'Private office', capacity: 1, rate: 100, images: 0, active: true, amenities: '', description: '' } : office();
  if (!x) return emptyState('No office selected', 'Create an office first.', 'admin/edit/new', 'Add office');
  return `${back('Office spaces', 'admin/offices')}<h2>${isNew ? 'Add an office' : 'Edit office'}</h2><p class="subtle">Core listing details, availability, photos and location.</p><form data-form="office-editor" style="margin-top:22px"><div class="form-grid"><div class="full">${input('Office name', 'name', x.name, 'text', 'required maxlength="100"')}</div>${select('Workspace type', 'type', x.type, [['Private office', 'Private office'], ['Coworking desk', 'Coworking desk'], ['Meeting room', 'Meeting room']])}${input('Capacity', 'capacity', x.capacity, 'number', 'min="1" max="100" required')}${input('City', 'city', x.city, 'text', 'required')}${input('Street address', 'address', x.address, 'text', 'required')}${input('Latitude', 'lat', x.lat, 'number', 'step="any" min="-90" max="90" required')}${input('Longitude', 'lng', x.lng, 'number', 'step="any" min="-180" max="180" required')}${input('Price per day (PLN)', 'rate', x.rate, 'number', 'min="1" step="1" required')}${select('Listing status', 'active', String(x.active), [['true', 'Active'], ['false', 'Inactive']])}<div class="full">${input('Amenities (comma-separated)', 'amenities', x.amenities)}</div><label class="full">Description<textarea name="description" required>${esc(x.description)}</textarea></label><div class="full"><label>Office images</label><div class="image-row" id="image-slots">${imageSlots()}</div>${action('+ Add image placeholder', 'add-image', '', 'type="button"')}<p class="subtle">Upload and removal controls are simulated. Maximum 3 slots in this draft.</p></div></div><div class="actions"><button class="primary">Save office</button>${link('Discard changes', isNew ? 'admin/offices' : 'admin/office/' + x.id)}</div></form>`;
}
function adminBookings() {
  const f = state.bookingFilters;
  let records = state.bookings.filter(x => x.provider === 'Officely' && `${x.id} ${x.name} ${x.customer} ${x.email}`.toLowerCase().includes(f.q.toLowerCase()) && (!f.source || x.source === f.source));
  records.sort((a, b) => f.sort === 'customer' ? a.customer.localeCompare(b.customer) : f.sort === 'source' ? a.source.localeCompare(b.source) : a.start.localeCompare(b.start));
  if (state.scenario === 'empty') records = [];
  f.page = Math.min(f.page, Math.max(1, Math.ceil(records.length / 3)));
  return `<h2>Office bookings</h2><p class="subtle">Reservations made through Officely and Flatly.</p><form class="toolbar" data-form="booking-search" style="margin-top:20px">${input('Search bookings', 'q', f.q, 'search', 'placeholder="Reference, office or customer"')}${select('Source system', 'source', f.source, [['', 'All sources'], ['Officely mobile', 'Officely mobile'], ['Flatly', 'Flatly']])}${select('Sort by', 'sort', f.sort, [['start', 'Start date'], ['customer', 'Customer'], ['source', 'Source system']])}<button>Apply</button></form>${state.scenario === 'error' ? errorState() : !records.length ? emptyState('No matching bookings', 'Change the search or source filter.', 'admin/bookings', 'Back to bookings') : `<div class="table-wrap"><table><thead><tr><th>Reference / office</th><th>Period</th><th>Customer</th><th>Source</th><th>Status</th></tr></thead><tbody>${records.slice((f.page - 1) * 3, f.page * 3).map(x => `<tr><td><a href="#admin/booking/${x.id}">${esc(x.id)}</a><small>${esc(x.name)}</small></td><td>${esc(x.start)}<small>to ${esc(x.end)}</small></td><td>${esc(x.customer)}<small>${esc(x.email)}</small></td><td>${esc(x.source)}</td><td><span class="status">${esc(x.status)}</span></td></tr>`).join('')}</tbody></table></div>${pagination(f.page, records.length, 'bookingFilters')}`}`;
}
function bookingDetail(isMobile) {
  const x = selectedBooking();
  const mode = isMobile ? 'mobile' : 'admin';
  if (!x || (isMobile && x.email !== demoUser.email) || (!isMobile && x.provider !== 'Officely')) return emptyState('Booking unavailable', 'Choose a reservation from your booking list.', mode + '/bookings', 'View bookings');
  return `${back(isMobile ? 'My bookings' : 'All bookings', mode + '/bookings')}<h2>${esc(x.name)}</h2><p class="subtle">${esc(x.id)} · <span class="status">${esc(x.status)}</span></p>${facts([['Provider', x.provider], ['Booked through', x.source], ['From', x.start], ['Until (exclusive)', x.end], ['Customer', x.customer], ['Email', x.email], ['Total for period', money(x.total)]])}${x.provider === 'Parkly' ? notice('Parkly supplies this parking reservation. You can manage cancellation here in Officely.') : ''}${x.status === 'Cancelled' ? notice('This reservation is cancelled. No other booking was changed.') : `<div class="actions">${link('Cancel booking', mode + '/cancel/' + x.id)}</div>`}`;
}
function cancellation(isMobile) {
  const x = selectedBooking(); const mode = isMobile ? 'mobile' : 'admin';
  if (!x || (isMobile && x.email !== demoUser.email) || (!isMobile && x.provider !== 'Officely')) return bookingDetail(isMobile);
  if (x.status === 'Cancelled') return bookingDetail(isMobile);
  return `${back('Booking details', mode + '/booking/' + x.id)}<h2>Cancel this booking?</h2><p class="subtle">Review the reservation before confirming.</p>${facts([['Booking', x.id], ['Item', x.name], ['Provider', x.provider], ['Period', period(x)]])}${notice(isMobile ? 'Only this reservation will be cancelled. Your office and parking bookings are managed separately.' : 'The customer should see the updated status, including bookings originating from Flatly. The delivery mechanism needs a partner agreement.')}${state.scenario === 'error' ? notice('Cancellation could not be confirmed. The reservation is still active. You can retry or keep the booking.') : ''}<div class="actions">${action(state.scenario === 'error' ? 'Retry cancellation' : 'Confirm cancellation', 'cancel-booking', 'primary')}${link('Keep booking', mode + '/booking/' + x.id)}</div>`;
}
function removeOffice() {
  const x = office(); if (!x) return adminOffice();
  const blocked = state.bookings.some(b => b.itemId === x.id && b.status === 'Confirmed');
  return `${back('Office details', 'admin/office/' + x.id)}<h2>${blocked ? 'This office has active bookings' : 'Remove this office?'}</h2><p class="subtle">${esc(x.name)} · ${esc(x.city)}</p>${notice(blocked ? 'Removal is blocked to preserve existing reservations. Mark the listing inactive to stop new bookings, or resolve its active bookings first.' : 'The office will disappear from new searches. Existing reservation history will be retained.')}<div class="actions">${blocked ? link('Edit listing status', 'admin/edit/' + x.id, 'primary') : action('Remove office', 'remove-office', 'primary')}${link('Keep office', 'admin/office/' + x.id)}</div>`;
}
function mobileSearch() {
  return `<p class="section-label">SPACE TO FOCUS</p><h2>Where will you work?</h2><p class="subtle">Find an available workspace for your stay.</p><form data-form="office-search" style="margin-top:22px">${searchFields(state.officeFilters)}<div class="actions"><button class="primary">Find available offices →</button></div></form>`;
}
function resultCard(x, f, isParking) {
  return `<article class="result-card">${placeholder(isParking ? 'PARKING IMAGE' : 'OFFICE IMAGE')}<div class="result-card-content"><h3>${esc(x.name)}</h3><p class="subtle">${esc(x.type)} · ${isParking ? 'Parkly' : x.capacity + ' people'}</p><p class="subtle">${esc(x.city)} · ${distance(x, f).toFixed(1)} km from reference</p><div class="price"><strong>${money(total(x, f))}</strong><span>${days(f)} days · total${isParking ? '<br>Quote from Parkly (mock)' : ''}</span></div>${link('View details →', 'mobile/' + (isParking ? 'park/' : 'office/') + x.id)}</div></article>`;
}
function mobileResults(isParking = false) {
  const f = isParking ? state.parkFilters : state.officeFilters;
  const key = isParking ? 'parkPage' : 'resultsPage';
  let records = filteredItems(isParking ? parking : state.offices, f);
  if (state.scenario === 'empty') records = [];
  state[key] = Math.min(state[key], Math.max(1, Math.ceil(records.length / 2)));
  const heading = isParking ? `<h2>Parking, nearby.</h2><p class="subtle">Provided by Parkly · booked in Officely</p>${notice('Parking is optional. Dates and the search location are copied from your office when you choose “Find nearby parking”.')}<details style="margin:18px 0"><summary style="font-size:12px;cursor:pointer">Change parking search</summary><form data-form="park-search" style="margin-top:16px">${searchFields(f, true)}<div class="actions"><button class="primary">Update parking results</button></div></form></details>` : `${back('Change search', 'mobile/search')}<h2>Available offices</h2>`;
  return `${heading}<p class="subtle">${esc(f.city) || 'Any city'} · within ${esc(f.radius)} km<br>${esc(period(f))} · ${days(f)} days</p>${state.scenario === 'error' ? errorState(isParking) : !records.length ? emptyState(isParking ? 'No parking matches' : 'No offices match', 'Try a different location, larger radius or different dates.', isParking ? null : 'mobile/search') : `<p class="section-label" style="margin-top:22px">${records.length} AVAILABLE ${isParking ? 'PARKING SPACES' : 'WORKSPACES'}</p>${records.slice((state[key] - 1) * 2, state[key] * 2).map(x => resultCard(x, f, isParking)).join('')}${pagination(state[key], records.length, key, 2)}`}${isParking ? `<div class="actions">${link('Skip parking · My bookings', 'mobile/bookings')}</div>` : ''}`;
}
function mobileItem(isParking = false) {
  const x = isParking ? park() : office(); const f = isParking ? state.parkFilters : state.officeFilters;
  if (!x) return emptyState('No office selected', 'Try another search.', 'mobile/search');
  return `${back(isParking ? 'Parking results' : 'Office results', 'mobile/' + (isParking ? 'parking' : 'results'))}${placeholder(isParking ? 'PARKING PHOTO GALLERY' : 'OFFICE PHOTO GALLERY')}<p class="section-label" style="margin-top:20px">${isParking ? 'PARKLY · PARTNER OFFER' : 'OFFICELY · WORKSPACE'}</p><h2>${esc(x.name)}</h2><p class="subtle">${esc(x.address)}, ${esc(x.city)}</p>${facts([['Type', x.type], ['Capacity', x.capacity + (isParking ? ' car' : ' people')], ['Amenities', x.amenities], ['Coordinates', `${x.lat}, ${x.lng}`]])}${placeholder('LOCATION / MAP PLACEHOLDER')}<p class="subtle">${esc(x.description)}</p><div class="summary-card"><p class="subtle">${esc(period(f))} · ${days(f)} days</p><div class="price"><strong>${money(total(x, f))}</strong><span>Total for selected period${isParking ? '<br>Quoted by Parkly (mock)' : ''}</span></div></div><div class="actions">${link('Continue to booking →', 'mobile/' + (isParking ? 'park-review' : 'review'), 'primary')}</div>`;
}
function reviewBooking(isParking = false) {
  const x = isParking ? park() : office(); const f = isParking ? state.parkFilters : state.officeFilters;
  if (!x) return mobileItem(isParking);
  const conflict = state.scenario === 'conflict' || !available(x, f);
  return `${back('Item details', 'mobile/' + (isParking ? 'park' : 'office'))}<p class="section-label">${isParking ? 'PARKLY RESERVATION' : 'OFFICELY RESERVATION'}</p><h2>Review your booking</h2>${facts([['Item', x.name], ['Provider', isParking ? 'Parkly' : 'Officely'], ['From', f.start], ['Until (exclusive)', f.end], ['Duration', days(f) + ' days'], ['Customer', demoUser.name], ['Email', demoUser.email], ['Total for period', money(total(x, f))]])}${isParking ? notice('This total represents a quote returned by Parkly. The draft uses sample data; production must request the partner-calculated price.') : ''}${conflict ? notice('This item is no longer available for these dates. No reservation has been created. Please choose another item.') : state.scenario === 'error' ? notice('The booking request could not be completed. No new reservation was created. Any existing office booking is unchanged.') : notice('This prototype creates a demo reservation only. Payment is not part of the proposed first-phase scope.')}<div class="actions">${conflict ? link('Find another option', 'mobile/' + (isParking ? 'parking' : 'results'), 'primary') : action('Confirm reservation', isParking ? 'book-parking' : 'book-office', 'primary')}${link('Back to results', 'mobile/' + (isParking ? 'parking' : 'results'))}</div>`;
}
function confirmation(isParking = false) {
  const id = isParking ? state.lastParkId : state.lastOfficeId;
  const x = state.bookings.find(b => b.id === id);
  if (!x) return `<div class="confirm-symbol">✓</div><h2>${isParking ? 'Parking' : 'Office'} confirmed</h2>${notice('Screen preview: complete a demo booking to populate this confirmation with a real demo reference.')}<div class="actions">${link('Start the booking flow', 'mobile/' + (isParking ? 'parking' : 'search'), 'primary')}</div>`;
  return `<div class="confirm-symbol">✓</div><p class="section-label">RESERVATION CONFIRMED</p><h2>${isParking ? 'Parking is sorted.' : 'Your workspace is ready.'}</h2><p class="subtle">${esc(x.name)}</p>${facts([['Reference', x.id], ['Provider', x.provider], ['Period', period(x)], ['Period total', money(x.total)]])}${!isParking ? `<div class="summary-card"><h3>Need somewhere to park?</h3><p class="subtle">Find Parkly spaces within 1 km of your office, for the same dates.</p><div class="actions">${action('Find nearby parking →', 'start-parking', 'primary')}</div></div>` : notice('Your office and parking have separate references. You can manage both in My bookings.')}<div class="actions">${link('View my bookings', 'mobile/bookings', isParking ? 'primary' : '')}</div>`;
}
function myBookings() {
  const f = state.myFilters;
  let records = state.bookings.filter(x => x.email === demoUser.email && (!f.status || x.status === f.status) && `${x.name} ${x.id} ${x.provider}`.toLowerCase().includes(f.q.toLowerCase()));
  records.sort((a, b) => f.sort === 'name' ? a.name.localeCompare(b.name) : a.start.localeCompare(b.start));
  if (state.scenario === 'empty') records = [];
  f.page = Math.min(f.page, Math.max(1, Math.ceil(records.length / 3)));
  return `<h2>My bookings</h2><p class="subtle">Your offices and parking, together.</p><form data-form="my-search" style="margin:20px 0"><div class="form-grid"><div class="full">${input('Search your bookings', 'q', f.q, 'search')}</div>${select('Status', 'status', f.status, [['', 'All'], ['Confirmed', 'Confirmed'], ['Cancelled', 'Cancelled']])}${select('Sort by', 'sort', f.sort, [['start', 'Start date'], ['name', 'Name A–Z']])}</div><div class="actions"><button>Apply filters</button></div></form>${state.scenario === 'error' ? errorState() : !records.length ? emptyState('No bookings found', 'Book an office or change your filters.', 'mobile/search', 'Find an office') : records.slice((f.page - 1) * 3, f.page * 3).map(x => `<article class="summary-card"><p class="section-label">${esc(x.provider)} · ${esc(x.id)}</p><h3>${esc(x.name)}</h3><p class="subtle">${esc(period(x))}</p><div class="price"><strong>${money(x.total)}</strong><span class="status">${esc(x.status)}</span></div><div class="actions">${link('Manage booking →', 'mobile/booking/' + x.id)}</div></article>`).join('') + pagination(f.page, records.length, 'myFilters')}`;
}
function mobileProfile() {
  return `<h2>Your account</h2><p class="subtle">Signed in as the demo customer.</p>${facts([['Name', demoUser.name], ['Email', demoUser.email]])}${notice('Customers can only access their own bookings. Real authentication, authorization and account management come in the implementation phase.')}<div class="actions">${link('My bookings', 'mobile/bookings', 'primary')}${link('Sign out', 'mobile/login')}</div>`;
}
function screenContent() {
  const views = current.mode === 'admin' ? { login: () => login(false), offices: adminOffices, office: adminOffice, edit: adminEdit, bookings: adminBookings, booking: () => bookingDetail(false), cancel: () => cancellation(false), remove: removeOffice } : { login: () => login(true), search: mobileSearch, results: () => mobileResults(), office: () => mobileItem(), review: () => reviewBooking(), confirmed: () => confirmation(), parking: () => mobileResults(true), park: () => mobileItem(true), 'park-review': () => reviewBooking(true), 'park-confirmed': () => confirmation(true), bookings: myBookings, booking: () => bookingDetail(true), cancel: () => cancellation(true), profile: mobileProfile };
  return (views[current.page] || views.login)();
}
function scenarios() {
  let opts = [['normal', 'Default state']];
  if (['offices', 'bookings', 'results', 'parking'].includes(current.page)) opts.push(['empty', 'No results'], ['error', 'Service unavailable']);
  if (['review', 'park-review'].includes(current.page)) opts.push(['conflict', 'Availability conflict'], ['error', 'Booking request failed']);
  if (current.page === 'cancel') opts.push(['error', 'Cancellation failed']);
  return opts.length === 1 ? '' : `<div class="scenario-box">${select('Review another state', 'scenario', state.scenario, opts)}<p>Prototype controls: switch states to discuss the recovery path. “Try again” restores the default simulation.</p></div>`;
}
function flowNodes(mode, pages) {
  return `<div class="flow-nodes">${pages.map((p, i) => { const s = screens[mode].find(x => x[1] === p); return `${i ? '<b>→</b>' : ''}<a href="#${mode}/${p}"><span>${s[0]}</span>${s[2]}</a>`; }).join('')}</div>`;
}
function screenMap() {
  return `<section class="flow-page"><div class="flow-intro"><div><p class="section-label">OFFICELY / PHASE 01</p><h2>Two apps. One connected journey.</h2><p class="subtle">An administrator manages office spaces on the web. A customer books an office in the mobile app, optionally adds Parkly parking, and manages both reservations in Officely. Click any screen below to explore it.</p></div>${action('Print this map', 'print')}</div><div class="flow-section"><p class="section-label">01 / ADMIN WEB · INVENTORY</p>${flowNodes('admin', ['login', 'offices', 'office', 'edit'])}<p class="subtle">Add office: A02 → A04 → A03. Remove office: A03 → <a href="#admin/remove"><u>A08 confirmation</u></a> → A02. Active bookings block removal.</p></div><div class="flow-section"><p class="section-label">02 / ADMIN WEB · RESERVATIONS</p>${flowNodes('admin', ['bookings', 'booking', 'cancel'])}<p class="subtle">A07 returns to A06 with the new status. Office reservations may originate in Officely or Flatly.</p></div><div class="flow-section"><p class="section-label">03 / CUSTOMER MOBILE · BOOK AN OFFICE</p>${flowNodes('mobile', ['login', 'search', 'results', 'office', 'review', 'confirmed'])}</div><div class="flow-section"><p class="section-label">04 / CUSTOMER MOBILE · OPTIONAL PARTNER BOOKING</p>${flowNodes('mobile', ['confirmed', 'parking', 'park', 'park-review', 'park-confirmed'])}<p class="subtle">Copy the office period and coordinates into parking search. Start with 1 km. The customer can edit the search or skip parking.</p></div><div class="flow-section"><p class="section-label">05 / CUSTOMER MOBILE · MANAGE EITHER RESERVATION</p>${flowNodes('mobile', ['bookings', 'booking', 'cancel'])}<p class="subtle">M13 returns to M12 with the cancelled status. Account/sign-out: <a href="#mobile/profile"><u>M14</u></a> → M01.</p></div><div class="flow-columns"><div class="flow-section"><h3>Included from the brief</h3><ul><li>Office CRUD, image controls and geographic location.</li><li>Booking dates, customer details and originating system.</li><li>Search, sorting and pagination for repeated records.</li><li>Available offices and partner parking; totals for selected dates.</li><li>Booking, viewing and cancelling both service types.</li><li>Sign-in screens and customer-specific booking lists.</li></ul></div><div class="flow-section"><h3>Draft decisions to discuss</h3><ul><li>Daily bookings with an exclusive end date; prices in PLN.</li><li>Office types: private office, coworking desk and meeting room.</li><li>One demo customer; account creation/reset not yet planned.</li><li>No payment flow: it is not required in the supplied brief.</li><li>Admin cancellation is optional in the brief; included for review.</li><li>Backend-to-backend partner integration is proposed, not agreed.</li></ul></div></div>${notice('Prototype boundary: plain HTML/CSS/JavaScript for reviewing screens, not the final ReactTS website or Expo app. Sign-in, uploads, availability, quotes and mutations use sample data in memory. Refresh or Reset demo restores the starting dataset.')}<p class="subtle">Full requirement-to-screen mapping and walkthroughs: docs/ux-plan.md in the local project.</p></section>`;
}
function render() {
  document.querySelectorAll('[data-mode]').forEach(el => el.classList.toggle('active', el.dataset.mode === current.mode));
  if (current.mode === 'map') { workspace.innerHTML = screenMap(); return; }
  const group = screens[current.mode]; const s = group.find(x => x[1] === current.page) || group[0];
  const isMobile = current.mode === 'mobile';
  const content = screenContent();
  const index = `<aside class="screen-index"><span class="section-label">${isMobile ? 'MOBILE' : 'WEB'} SCREENS / ${group.length}</span><nav class="screen-list" aria-label="Screen navigator">${group.map(x => `<a href="#${current.mode}/${x[1]}" class="${x[1] === current.page ? 'active' : ''}" ${x[1] === current.page ? 'aria-current="page"' : ''}><span>${x[0]}</span>${x[2]}</a>`).join('')}</nav><p>Jump to any screen, or follow the buttons inside the prototype.</p></aside>`;
  const caption = `<div class="canvas-caption"><span>${s[0]} / ${esc(s[2]).toUpperCase()}</span><span>${isMobile ? 'MOBILE APP' : 'ADMIN WEBSITE'}</span></div>`;
  const appNav = `<nav class="app-nav" aria-label="Admin navigation"><strong>officely <span class="subtle">/ admin</span></strong><a href="#admin/offices" class="${!['bookings', 'booking', 'cancel'].includes(current.page) ? 'active' : ''}">Offices</a><a href="#admin/bookings" class="${['bookings', 'booking', 'cancel'].includes(current.page) ? 'active' : ''}">Bookings</a><a href="#admin/login">Sign out</a></nav>`;
  const tabs = `<nav class="phone-tabs" aria-label="Mobile navigation"><a href="#mobile/search" class="${['search', 'results', 'office', 'review'].includes(current.page) ? 'active' : ''}">Offices</a><a href="#mobile/parking" class="${current.page.includes('park') ? 'active' : ''}">Parking</a><a href="#mobile/bookings" class="${['bookings', 'booking', 'cancel'].includes(current.page) ? 'active' : ''}">My bookings</a><a href="#mobile/profile" class="${current.page === 'profile' ? 'active' : ''}">Account</a></nav>`;
  const frame = isMobile ? `<div class="device-wrap">${caption}<div class="phone-frame"><div class="phone-status"><span>9:41</span><i></i><span>▰ 100%</span></div><div class="phone-header"><strong>officely</strong><span>${current.page === 'login' ? 'WELCOME' : 'ALEX / DEMO'}</span></div><div class="phone-body">${content}</div>${current.page !== 'login' ? tabs : ''}<div class="home-indicator"></div></div></div>` : `<div>${caption}<div class="web-frame"><div class="browser-bar"><i></i><i></i><i></i><span>officely / admin / prototype</span></div>${current.page === 'login' ? '' : appNav}<div class="app-body">${content}</div></div></div>`;
  const notes = `<aside class="review-notes"><p class="section-label">REVIEW NOTES</p><div><h3><span class="screen-badge">${s[0]}</span> Purpose</h3><p>${esc(s[3])}</p></div><div><h3>Interaction & next step</h3><p>${esc(s[4])}</p></div><div><h3>What to review</h3><p>Is the information enough to make a decision? Is the next action clear? What happens if it fails?</p></div>${scenarios()}<div class="scenario-box"><a href="#map"><u>View all screen paths →</u></a></div></aside>`;
  workspace.innerHTML = `<div class="review-grid">${index}${frame}${notes}</div>`;
}
function onRoute() {
  const parts = location.hash.slice(1).split('/');
  const mode = ['admin', 'mobile'].includes(parts[0]) ? parts[0] : 'map';
  const page = mode === 'map' ? '' : screens[mode].some(x => x[1] === parts[1]) ? parts[1] : 'login';
  current = { mode, page, id: parts[2] || '' }; state.scenario = 'normal';
  if (['office', 'edit', 'remove'].includes(page) && state.offices.some(x => x.id === current.id)) state.officeId = current.id;
  if (page === 'park' && parking.some(x => x.id === current.id)) state.parkId = current.id;
  if (['booking', 'cancel'].includes(page) && current.id) state[mode === 'admin' ? 'adminBookingId' : 'mobileBookingId'] = current.id;
  if (mode === 'admin' && page === 'edit') state.images = current.id === 'new' ? 0 : office()?.images || 0;
  render();
}

document.addEventListener('submit', event => {
  const form = event.target.closest('form[data-form]'); if (!form) return;
  event.preventDefault(); const data = Object.fromEntries(new FormData(form));
  if (form.dataset.form === 'login') { go(current.mode + (current.mode === 'admin' ? '/offices' : '/search')); announce('Demo session started. Authentication is simulated.'); }
  if (['office-search', 'park-search'].includes(form.dataset.form)) {
    if (!Number.isFinite(days(data)) || days(data) <= 0) { announce('Choose an end date after the start date.'); form.elements.end.focus(); return; }
    const isParking = form.dataset.form === 'park-search';
    state[isParking ? 'parkFilters' : 'officeFilters'] = { ...defaultFilters(), ...data };
    state[isParking ? 'parkPage' : 'resultsPage'] = 1;
    go('mobile/' + (isParking ? 'parking' : 'results'));
  }
  const keys = { 'admin-search': 'adminFilters', 'booking-search': 'bookingFilters', 'my-search': 'myFilters' };
  if (keys[form.dataset.form]) { state[keys[form.dataset.form]] = { ...data, page: 1 }; state.scenario = 'normal'; render(); }
  if (form.dataset.form === 'office-editor') {
    const creating = current.id === 'new';
    const record = { ...data, id: creating ? 'o' + (++state.counter) : office().id, capacity: Number(data.capacity), lat: Number(data.lat), lng: Number(data.lng), rate: Number(data.rate), active: data.active === 'true', images: state.images };
    if (!record.name.trim() || !record.city.trim() || !record.address.trim() || !record.description.trim()) { announce('Please fill in the name, city, address and description.'); return; }
    if (creating) state.offices.push(record); else state.offices[state.offices.findIndex(x => x.id === record.id)] = record;
    state.officeId = record.id; go('admin/office/' + record.id); announce('Office saved in this demo.');
  }
});
document.addEventListener('change', event => {
  if (event.target.name === 'scenario') { state.scenario = event.target.value; render(); }
});
document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]'); if (!button) return;
  event.preventDefault();
  const name = button.dataset.action;
  if (name === 'print') window.print();
  if (name === 'retry') { state.scenario = 'normal'; render(); }
  if (name === 'page') { const key = button.dataset.key; const delta = Number(button.dataset.delta); if (typeof state[key] === 'number') state[key] += delta; else state[key].page += delta; render(); }
  if (name === 'office-bookings') { state.bookingFilters = { q: office().name, sort: 'start', source: '', page: 1 }; go('admin/bookings'); }
  if (name === 'add-image' || name === 'remove-image') { state.images = Math.max(0, Math.min(3, state.images + (name === 'add-image' ? 1 : -1))); document.getElementById('image-slots').innerHTML = imageSlots(); }
  if (name === 'remove-office') {
    const x = office();
    if (state.bookings.some(b => b.itemId === x.id && b.status === 'Confirmed')) { announce('Resolve active bookings before removing this office.'); return; }
    state.offices = state.offices.filter(o => o.id !== x.id); state.officeId = state.offices[0]?.id; go('admin/offices'); announce('Office removed from this demo.');
  }
  if (name === 'book-office' || name === 'book-parking') {
    const isParking = name === 'book-parking'; const x = isParking ? park() : office(); const f = isParking ? state.parkFilters : state.officeFilters;
    if (state.scenario === 'error') { announce('Simulated request failure. No reservation was created.'); return; }
    if (state.scenario === 'conflict' || !available(x, f)) { state.scenario = 'conflict'; render(); return; }
    const id = (isParking ? 'PRK-' : 'OFF-') + (++state.counter);
    state.bookings.unshift({ id, itemId: x.id, provider: isParking ? 'Parkly' : 'Officely', source: 'Officely mobile', name: x.name, start: f.start, end: f.end, total: total(x, f), customer: demoUser.name, email: demoUser.email, status: 'Confirmed' });
    state[isParking ? 'lastParkId' : 'lastOfficeId'] = id; state.mobileBookingId = id;
    go('mobile/' + (isParking ? 'park-confirmed' : 'confirmed'));
  }
  if (name === 'start-parking') {
    const b = state.bookings.find(x => x.id === state.lastOfficeId); const x = state.offices.find(o => o.id === b.itemId);
    state.parkFilters = { ...defaultFilters(), start: b.start, end: b.end, city: x.city, lat: x.lat, lng: x.lng, radius: 1 }; state.parkPage = 1; go('mobile/parking');
  }
  if (name === 'cancel-booking') {
    const b = selectedBooking();
    if (!b || (current.mode === 'mobile' && b.email !== demoUser.email) || (current.mode === 'admin' && b.provider !== 'Officely')) return;
    if (state.scenario === 'error') { state.scenario = 'normal'; announce('Demo retry succeeded.'); }
    b.status = 'Cancelled'; go(current.mode + '/booking/' + b.id); announce('Reservation cancelled. Other reservations are unchanged.');
  }
});
document.getElementById('reset-demo').addEventListener('click', () => {
  const dialog = document.getElementById('confirm-dialog');
  dialog.innerHTML = '<h2 id="dialog-title">Reset the prototype?</h2><p>This restores all sample offices and reservations and discards changes made during this demo.</p><form method="dialog"><div class="actions"><button value="cancel">Keep exploring</button><button class="primary" value="reset">Reset demo</button></div></form>';
  dialog.showModal();
});
document.getElementById('confirm-dialog').addEventListener('close', event => {
  if (event.target.returnValue === 'reset') { state = freshState(); go('map'); announce('Demo reset to its starting state.'); }
});
window.addEventListener('hashchange', onRoute);
onRoute();
