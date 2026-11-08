import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { available, days, defaultFilters, initialBookings, initialOffices, total, user } from './data';
import type { Booking, Filters, Space } from './data';

type Setter<T> = Dispatch<SetStateAction<T>>;
export type Scenario = 'normal' | 'empty' | 'error' | 'conflict';
export interface Route { mode: 'admin' | 'mobile'; page: string; id: string }
interface Store {
  route: Route;
  go: (path: string) => void;
  offices: Space[]; setOffices: Setter<Space[]>;
  bookings: Booking[]; setBookings: Setter<Booking[]>;
  officeFilters: Filters; setOfficeFilters: Setter<Filters>;
  parkFilters: Filters; setParkFilters: Setter<Filters>;
  scenario: Scenario; setScenario: Setter<Scenario>;
  toast: string; notify: (s: string) => void;
  reset: () => void;
  reserve: (item: Space, partner: boolean) => void;
  cancel: (id: string) => void;
}
const Context = createContext<Store | null>(null);
const readRoute = (): Route => {
  const [mode, page, id] = window.location.hash.slice(1).split('/');
  return { mode: mode === 'mobile' ? 'mobile' : 'admin', page: page || (mode === 'mobile' ? 'search' : 'offices'), id: id || '' };
};
export function AppProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState(readRoute);
  const [offices, setOffices] = useState(() => structuredClone(initialOffices));
  const [bookings, setBookings] = useState(() => structuredClone(initialBookings));
  const [officeFilters, setOfficeFilters] = useState(defaultFilters);
  const [parkFilters, setParkFilters] = useState(() => ({ ...defaultFilters(), radius: 1 }));
  const [scenario, setScenario] = useState<Scenario>('normal');
  const [toast, setToast] = useState('');
  const counter = useRef(1050);
  useEffect(() => {
    const change = () => { setRoute(readRoute()); setScenario('normal'); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  useEffect(() => { if (toast) { const timer = window.setTimeout(() => setToast(''), 4500); return () => clearTimeout(timer); } }, [toast]);
  function go(path: string) { setScenario('normal'); window.location.hash = path; }
  function reset() { setOffices(structuredClone(initialOffices)); setBookings(structuredClone(initialBookings)); setOfficeFilters(defaultFilters()); setParkFilters({ ...defaultFilters(), radius: 1 }); counter.current = 1050; go(route.mode === 'admin' ? 'admin/offices' : 'mobile/search'); setToast('Demo reset.'); }
  function reserve(item: Space, partner: boolean) {
    const f = partner ? parkFilters : officeFilters;
    if (scenario === 'error') { setToast('Request failed. No new booking was made.'); return; }
    if (scenario === 'conflict' || !available(item, f, bookings) || !(days(f) > 0)) { setScenario('conflict'); return; }
    const booking: Booking = { id: `${partner ? 'PRK' : 'OFF'}-${++counter.current}`, itemId: item.id, provider: partner ? 'Parkly' : 'Officely', source: 'Officely mobile', name: item.name, start: f.start, end: f.end, total: total(item, f), customer: user.name, email: user.email, status: 'Confirmed' };
    setBookings(prev => [booking, ...prev]);
    go(`mobile/${partner ? 'park-confirmed' : 'confirmed'}/${booking.id}`);
  }
  function cancel(id: string) {
    const b = bookings.find(x => x.id === id);
    if (!b || (route.mode === 'mobile' ? b.email !== user.email : b.provider !== 'Officely')) return;
    if (scenario === 'error') { setToast('Cancellation failed. The booking remains confirmed.'); return; }
    setBookings(prev => prev.map(x => x.id === id ? { ...x, status: 'Cancelled' } : x));
    go(`${route.mode}/booking/${id}`); setToast('Booking cancelled. Other bookings are unchanged.');
  }
  return <Context.Provider value={{ route, go, offices, setOffices, bookings, setBookings, officeFilters, setOfficeFilters, parkFilters, setParkFilters, scenario, setScenario, toast, notify: setToast, reset, reserve, cancel }}>{children}</Context.Provider>;
}
export function useApp() { const value = useContext(Context); if (!value) throw new Error('AppProvider is required'); return value; }
