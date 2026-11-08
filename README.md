# Officely — React app mockup

An interactive **React + TypeScript** mock of the actual Officely app, using Balsamiq-style text, outlines, buttons, image boxes and map placeholders.

Both views live in this one project:

- **Web app:** administrator office inventory and booking management.
- **Mobile app:** a phone-sized React view for office reservations and Parkly parking.

## Launch on this computer

Double-click **start.cmd** in this folder. It starts the React development server and opens your browser. Keep its terminal window open while using the mockup. Press Ctrl+C to stop.

The launcher uses the portable Node.js runtime already prepared inside .tools, so this computer does not need a separate Node installation. All project files, dependencies and local setup are inside officely.

The HTML file is a React entry point; **launch with start.cmd**, rather than double-clicking index.html.

## Standard Node.js setup on another computer

Install Node.js 24 LTS, open a terminal in officely, then run:

```powershell
npm install
npm run dev
```

Open the localhost address printed by Vite (normally http://127.0.0.1:5173). The .tools directory and node_modules are ignored by Git and are not required in a shared source repository.

```powershell
npm run build    # TypeScript check + production build
npm run preview  # Preview the production build
```

## What to try

Use the small **Web app / Mobile app** switch at the top. The content below it is the app mockup itself.

1. In Web app, add an office, edit its details and image placeholders, inspect bookings or remove an unused office.
2. In Mobile app, search Warsaw for **1–3 December 2026** and choose either **Working hours (09:00–17:00)** or custom daily hours such as **10:00–12:00**.
3. Book **Central studio**; the three-day, two-hours-per-day example totals **180 PLN**.
4. Select **Find nearby parking**. The app privately carries over the office location, dates and daily hours, starting with a 1 km radius.
5. Book **Centrum covered parking** for the mocked partner quote.
6. Open Bookings and manage or cancel either reservation independently.
7. Switch to Web app → Bookings to see the office reservation appear. The administrator also sees bookings originating from Flatly.
8. In Mobile app → Account, change the profile name. The new name appears in greetings and the customer's booking records.

The demo starts in an already-signed-in sample session. Sign out to see the sign-in screens. Authentication is simulated; use the prefilled fictional credentials.

**Demo options** contains reset and alternative states for the current screen, including empty results, service errors and availability conflicts. Refresh also resets the data.

## Scope

All UI is rendered by React components. React and React DOM are the only runtime packages. TypeScript and Vite provide checking and development/build tooling. Styling is plain CSS; there is no UI framework, HTML-string renderer, image generation, or separate non-React prototype.

The phone view is a React mockup in the browser, not a React Native or Expo build. Real authentication, APIs, file uploads, map integration and payment are not implemented. Records are in memory and shared between the two views in the current tab. Partner prices and communication are simulated.

Draft assumptions: English, PLN, inclusive multi-day reservations with the same daily hours, 30-minute time increments, and a working-hours preset of 09:00–17:00. Coordinates are internal location data and are never entered by customers. The team can revise these before implementation.

## Structure

| File | Purpose |
| --- | --- |
| src/App.tsx | App switch and demo controls |
| src/Admin.tsx | Administrator screens |
| src/Mobile.tsx | Customer phone screens |
| src/shared.tsx | Sign-in, booking details and confirmations |
| src/components.tsx | Reusable React wireframe controls |
| src/store.tsx | Shared demo state and hash navigation |
| src/data.ts | Typed sample data and availability helpers |
| src/styles.css | Balsamiq-style presentation |
| src/assets/ | Local Balsamiq Sans font and its OFL license |
| docs/ux-plan.md | Requirements, screen paths and assumptions |
| start.cmd | Windows launcher |

Review notes and the screen-path inventory are kept in [docs/ux-plan.md](docs/ux-plan.md).

No public deployment or GitHub repository has been created. Confirm the final repository naming with the teacher: the supplied submission text names Flatly, while this team's service is Officely.
