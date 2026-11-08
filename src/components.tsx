import { useEffect, useId, useRef } from 'react';
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    office: <><path d="M4 21 4.5 4 18 3.5 18.5 21M2 21h20M8 21v-5h6v5M8 7h2m3 0h2M8 11h2m3 0h2" /></>,
    book: <><path d="M6 3 19 3.5 19.5 21 5 20.5Z M8 7h8M8 11h8M8 15h4" /></>,
    search: <><circle cx="10" cy="10" r="6.5" /><path d="m15 15 6 6" /></>,
    pin: <><path d="M12 22S4 13 4 8a8 8 0 0 1 16 0c0 5-8 14-8 14Z" /><circle cx="12" cy="8" r="2.5" /></>,
    user: <><circle cx="12" cy="7" r="4" /><path d="M3 22v-3c0-8 18-8 18 0v3" /></>,
    plus: <path d="m12 3 .2 18M3 12h18" />,
    arrow: <path d="M3 12h17m-6-6 6 6-6 6" />,
    check: <path d="m4 12 5 6L21 5" />,
    parking: <><path d="M7 21V3h7c8 0 8 11 0 11H7" /></>,
    logout: <><path d="M10 4H4v16h6m1-8h10m-4-4 4 4-4 4" /></>,
    edit: <><path d="m4 16-1 5 5-1L21 7l-5-4ZM13 6l5 5" /></>,
    grid: <path d="M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z" />,
    calendar: <><path d="M3 5h18v16H3ZM3 10h18M7 2v6M17 2v6M7 14h2m3 0h2m3 0h1M7 17h2m3 0h2" /></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m5 5 14 14M19 5 5 19" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.office}</svg>;
}

export function Button({ children, primary = false, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) {
  return <button className={`button ${primary ? 'primary' : ''} ${className}`} type="button" {...props}>{children}</button>;
}
export function Link({ to, children, primary = false, className = '' }: { to: string; children: ReactNode; primary?: boolean; className?: string }) {
  return <a href={`#${to}`} className={`button ${primary ? 'primary' : ''} ${className}`}>{children}</a>;
}
export function Back({ to, children = 'Back' }: { to: string; children?: ReactNode }) {
  return <a href={`#${to}`} className="back">← {children}</a>;
}
export function Field({ label, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label className={`field ${className}`}><span>{label}</span><input {...props} /></label>;
}
export function Select({ label, value, onChange, options, name, className = '' }: { label: string; value: string | number; onChange: (v: string) => void; options: (string | [string, string])[]; name?: string; className?: string }) {
  return <label className={`field ${className}`}><span>{label}</span><select name={name} value={value} onChange={e => onChange(e.target.value)}>{options.map(option => { const [v, text] = Array.isArray(option) ? option : [option, option]; return <option key={v} value={v}>{text}</option>; })}</select></label>;
}
export function Placeholder({ label = 'Image placeholder', small = false, map = false }: { label?: string; small?: boolean; map?: boolean }) {
  return <div className={`placeholder ${small ? 'small' : ''} ${map ? 'map-placeholder' : ''}`}><svg viewBox="0 0 300 150" preserveAspectRatio="none" aria-hidden="true">{map ? <><path d="M0 35 300 44M0 106 300 98M70 0 95 150M230 0 200 150" /><path d="M0 80 300 80M147 0 150 150" strokeDasharray="5 5" /></> : <><path d="m2 2 296 146M298 2 2 146" /></>}</svg><span>{map && <Icon name="pin" size={28} />}{label}</span></div>;
}
export function Status({ children }: { children: ReactNode }) { return <span className="status">{children}</span>; }
export function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) { return <div className={`notice ${error ? 'error' : ''}`} role={error ? 'alert' : undefined}>{children}</div>; }
export function Facts({ rows }: { rows: [string, ReactNode][] }) { return <dl className="facts">{rows.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>; }
export function Heading({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) { return <div className="page-heading"><div><h1>{title}</h1>{subtitle && <p className="muted">{subtitle}</p>}</div>{children}</div>; }
export function Pager({ page, count, setPage, size = 3 }: { page: number; count: number; setPage: (n: number) => void; size?: number }) {
  const pages = Math.max(1, Math.ceil(count / size));
  return <div className="pagination"><span>{count} results · Page {page} of {pages}</span><div><Button aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(page - 1)}>←</Button><Button aria-label="Next page" disabled={page >= pages} onClick={() => setPage(page + 1)}>→</Button></div></div>;
}
export function Empty({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) { return <div className="empty"><Icon name="search" size={42} /><h2>{title}</h2><p className="muted">{children}</p>{action}</div>; }
export function Modal({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => { const el = ref.current; el?.showModal(); return () => el?.close(); }, []);
  return <dialog ref={ref} onCancel={close} aria-labelledby={id}><div className="dialog-heading"><h2 id={id}>{title}</h2><Button className="icon-button" aria-label="Close dialog" onClick={close}><Icon name="close" /></Button></div>{children}</dialog>;
}
