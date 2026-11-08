export interface Space {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  type: string;
  capacity: number;
  rate: number;
  images: number;
  active: boolean;
  amenities: string;
  description: string;
}

export interface Booking {
  id: string;
  itemId: string;
  provider: 'Officely' | 'Parkly';
  source: string;
  name: string;
  start: string;
  end: string;
  total: number;
  customer: string;
  email: string;
  status: 'Confirmed' | 'Cancelled';
}

export interface Filters {
  q: string;
  city: string;
  start: string;
  end: string;
  lat: number;
  lng: number;
  radius: number;
  type: string;
  capacity: number;
  sort: string;
  timePreset: 'workday' | 'custom';
}

export const user = { name: 'Alex Morgan', email: 'alex@example.test' };
export const officeTypes = ['Private office', 'Coworking desk', 'Meeting room'];
export const initialOffices: Space[] = [
  { id: 'o1', name: 'Central studio', city: 'Warsaw', address: 'Marszałkowska 80', lat: 52.228, lng: 21.012, type: 'Private office', capacity: 4, rate: 30, images: 2, active: true, amenities: 'Wi-Fi, monitor, quiet room', description: 'A quiet workspace for a small team, close to public transport.' },
  { id: 'o2', name: 'Riverside desk', city: 'Warsaw', address: 'Dobra 42', lat: 52.24, lng: 21.025, type: 'Coworking desk', capacity: 1, rate: 12, images: 1, active: true, amenities: 'Wi-Fi, shared kitchen', description: 'A desk in an open coworking area near the river.' },
  { id: 'o3', name: 'North meeting room', city: 'Warsaw', address: 'Andersa 20', lat: 52.252, lng: 21.0, type: 'Meeting room', capacity: 8, rate: 45, images: 1, active: true, amenities: 'Wi-Fi, screen, whiteboard', description: 'A room for team workshops and meetings.' },
  { id: 'o4', name: 'West team office', city: 'Warsaw', address: 'Prosta 51', lat: 52.23, lng: 20.988, type: 'Private office', capacity: 6, rate: 38, images: 0, active: false, amenities: 'Wi-Fi, kitchen', description: 'Temporarily closed while the space is being updated.' },
  { id: 'o5', name: 'Old Town workspace', city: 'Krakow', address: 'Długa 12', lat: 50.068, lng: 19.94, type: 'Coworking desk', capacity: 2, rate: 16, images: 1, active: true, amenities: 'Wi-Fi, coffee', description: 'Shared desks near the historic centre.' },
];
export const parking: Space[] = [
  { id: 'p1', name: 'Centrum covered parking', city: 'Warsaw', address: 'Nowogrodzka 35', lat: 52.226, lng: 21.01, type: 'Covered', capacity: 1, rate: 8, images: 1, active: true, amenities: '24/7 access, covered space', description: 'A covered parking space close to Central studio.' },
  { id: 'p2', name: 'City courtyard parking', city: 'Warsaw', address: 'Żurawia 22', lat: 52.229, lng: 21.016, type: 'Outdoor', capacity: 1, rate: 6, images: 1, active: true, amenities: 'Gated, 24/7 access', description: 'An outdoor space in a gated courtyard.' },
  { id: 'p3', name: 'Station parking', city: 'Warsaw', address: 'Emilii Plater 40', lat: 52.232, lng: 21.002, type: 'Covered', capacity: 1, rate: 7, images: 1, active: true, amenities: 'Covered space', description: 'Parking near the central station.' },
];
export const initialBookings: Booking[] = [
  { id: 'OFF-1042', itemId: 'o1', provider: 'Officely', source: 'Officely mobile', name: 'Central studio', start: '2026-11-15T09:00', end: '2026-11-15T17:00', total: 240, customer: user.name, email: user.email, status: 'Confirmed' },
  { id: 'OFF-1041', itemId: 'o2', provider: 'Officely', source: 'Flatly', name: 'Riverside desk', start: '2026-12-01T09:00', end: '2026-12-03T17:00', total: 288, customer: 'Sam Lee', email: 'sam@example.test', status: 'Confirmed' },
  { id: 'PRK-2081', itemId: 'p3', provider: 'Parkly', source: 'Officely mobile', name: 'Station parking', start: '2026-11-15T09:00', end: '2026-11-15T17:00', total: 56, customer: user.name, email: user.email, status: 'Confirmed' },
  { id: 'OFF-1038', itemId: 'o3', provider: 'Officely', source: 'Flatly', name: 'North meeting room', start: '2026-11-18T10:00', end: '2026-11-18T14:00', total: 180, customer: 'Robin Kim', email: 'robin@example.test', status: 'Confirmed' },
  { id: 'OFF-1033', itemId: 'o5', provider: 'Officely', source: 'Officely mobile', name: 'Old Town workspace', start: '2026-10-10T09:00', end: '2026-10-10T17:00', total: 128, customer: user.name, email: user.email, status: 'Cancelled' },
];
export const defaultFilters = (): Filters => ({ q: '', city: 'Warsaw', start: '2026-12-01T09:00', end: '2026-12-03T17:00', lat: 52.2297, lng: 21.0122, radius: 5, type: '', capacity: 1, sort: 'name', timePreset: 'workday' });
export const money = (value: number) => new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 }).format(value) + ' PLN';
export const bookingDate = (f: Pick<Filters, 'start'>) => f.start.slice(0, 10);
export const bookingEndDate = (f: Pick<Filters, 'end'>) => f.end.slice(0, 10);
export const bookingTime = (value: string) => value.slice(11, 16);
const minutes = (value: string) => Number(value.slice(11, 13)) * 60 + Number(value.slice(14, 16));
export const bookingDays = (f: Pick<Filters, 'start' | 'end'>) => Math.floor((Date.parse(`${bookingEndDate(f)}T00:00:00Z`) - Date.parse(`${bookingDate(f)}T00:00:00Z`)) / 86400000) + 1;
export const dailyHours = (f: Pick<Filters, 'start' | 'end'>) => (minutes(f.end) - minutes(f.start)) / 60;
export const hours = (f: Pick<Filters, 'start' | 'end'>) => bookingDays(f) * dailyHours(f);
export const period = (f: Pick<Filters, 'start' | 'end'>) => `${bookingDate(f)}${bookingEndDate(f) === bookingDate(f) ? '' : `–${bookingEndDate(f)}`} · ${bookingTime(f.start)}–${bookingTime(f.end)}`;
export const total = (item: Space, f: Filters) => item.rate * hours(f);
export const available = (item: Space, f: Filters, bookings: Booking[]) => item.active && !bookings.some(b => b.itemId === item.id && b.status === 'Confirmed'
  && bookingDate(b) <= bookingEndDate(f) && bookingEndDate(b) >= bookingDate(f)
  && bookingTime(b.start) < bookingTime(f.end) && bookingTime(b.end) > bookingTime(f.start));
export function distance(item: Space, f: Filters) {
  const rad = (n: number) => n * Math.PI / 180;
  const a = Math.sin(rad(item.lat - f.lat) / 2) ** 2 + Math.cos(rad(f.lat)) * Math.cos(rad(item.lat)) * Math.sin(rad(item.lng - f.lng) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}
export function searchSpaces(items: Space[], f: Filters, bookings: Booking[]) {
  return items.filter(x => available(x, f, bookings) && x.name.toLowerCase().includes(f.q.toLowerCase()) && x.city.toLowerCase().includes(f.city.toLowerCase()) && distance(x, f) <= f.radius && (!f.type || x.type === f.type) && x.capacity >= f.capacity).sort((a, b) => f.sort === 'price' ? total(a, f) - total(b, f) : f.sort === 'distance' ? distance(a, f) - distance(b, f) : a.name.localeCompare(b.name));
}
