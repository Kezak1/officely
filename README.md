# Officely — phase-one prototypes

Clickable, low-fidelity wireframes for an **administrator website** and a **customer mobile app**, including **Parkly parking** booked through Officely.

## Open the prototype

Open [`prototype/index.html`](prototype/index.html) in a modern browser. No installation, build, server, or internet connection is needed.

Optional local server, from this project folder:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Then open <http://localhost:8000/prototype/>. Stop the server with `Ctrl+C`.

## Review it

- **Screen map & notes:** start here to see all navigation paths. Each screen node is clickable. “Print this map” supports printing or saving to PDF through your browser.
- **Admin web:** office inventory, add/edit/remove, image slots, geographic location, bookings and optional administrator cancellation.
- **Customer mobile:** office search and reservation, nearby partner parking, combined booking history and independent cancellation.
- **Screen navigator:** jump directly to any of the 22 screens. This is a reviewer tool, not navigation planned for the actual product.
- **Review another state:** try empty results, service failures, booking conflicts and cancellation failure on applicable screens.
- **Reset demo:** restore the sample records. Refreshing the page also resets the prototype.

The demo sign-in uses prefilled fictional credentials. It always opens the fixed demo role; it does not create or authenticate an account. Do not enter real credentials.

## Scope

This is the first-phase UX deliverable, built with plain HTML, CSS and JavaScript so the team can review it immediately. It is **not** the final ReactTS application, Expo app or backend. All changes remain in memory in the current browser tab. The web and mobile views share that in-memory dataset to demonstrate how a customer booking appears to an administrator.

Images and maps are schematic placeholders. Prices, availability, uploads and partner communication are simulated. Payment is not included in the proposed scope because the supplied brief does not require it.

Read [`docs/ux-plan.md`](docs/ux-plan.md) for the screen inventory, requirement coverage, walkthroughs, assumptions and decisions still to make.

## Files

| File | Purpose |
| --- | --- |
| `prototype/index.html` | Workshop entry point |
| `prototype/styles.css` | Grayscale web and phone wireframe layouts |
| `prototype/app.js` | Screens, routes, sample data and clickable interactions |
| `docs/ux-plan.md` | Review and submission planning document |

No project repository or deployment has been created. The prototype stays in the local workspace as requested. Before submission, agree on naming with your teacher: the supplied text uses `FinalProjectFlatly`, while this team's selected service is Officely.
