# Officely: UX starting draft

Status: phase-one React wireframes for group review. The user confirmed Officely, one React project containing the admin web and phone-sized customer views, Balsamiq-style placeholders, and keeping everything in the officely folder. The remaining product decisions below are proposals, not agreed requirements. Launch with start.cmd in officely.

## Source and interpretation

Requirements were read from the supplied local `2026-Project-Brief (1).pdf` (4 pages). Project context was read from the [kickoff slides](https://pw2026.react.edu.pl/wp-content/uploads/2026/10/Project-kickoff.pdf). The [online project brief](https://pw2026.react.edu.pl/wp-content/uploads/2026/10/2026-Project-Brief.pdf) is the reference supplied by the user; the local copy was used for requirements extraction.

The documents describe the wider semester project. They are reference material for this draft, not authorization to deploy an application, create a GitHub repository, submit work, or contact the teachers.

The key distinction is that the **web app serves administrators** and the **mobile app serves customers**. Officely owns offices. Its mobile app also offers parking owned by Parkly. Flatly can create office reservations through Officely's eventual API.

The kickoff slides list **10 November 2026** as the mockup submission deadline (slide 15). The user-supplied submission text covers final presentation requirements as well; running production applications and final repository submission are later deliverables.

## Roles and responsibilities

| Role/system | Responsibility |
| --- | --- |
| Officely administrator | Manage offices; inspect office bookings from Officely and Flatly; optionally cancel office bookings. |
| Officely customer | Find and book offices, optionally book Parkly parking, view and cancel their own reservations. |
| Officely | Own office inventory, availability and office reservations. |
| Parkly | Own parking inventory, availability, price quotes and parking reservations. |
| Flatly | May originate office bookings; shown as the source in the Officely admin app. |

The Officely admin app lists **office reservations**. The customer's Officely mobile app lists **their office and parking reservations**. The Parkly admin app is a separate team's responsibility.

## Screen inventory

| ID | Screen | Main components / actions | Next screens |
| --- | --- | --- | --- |
| A01 | Admin sign-in | Email, password, demo sign-in | A02 |
| A02 | Office inventory | Summary, name/location search, sort, paging, Add, View | A03, A04, A05 |
| A03 | Office detail | Images, description, coordinates, map placeholder, rate, status | A04, A05 filtered by office, A08 |
| A04 | Add/edit office | Name, type, capacity, address, city, coordinates, price, status, description, amenities, image controls | Save → A03; discard → A02/A03 |
| A05 | Office bookings | Search, sort, paging, source filter, periods, customers, statuses | A06 |
| A06 | Booking detail | Reference, item, provider, source, period, customer, price, status | A07, A05 |
| A07 | Admin cancellation | Confirmation and impact on partner-origin reservations | Confirm/keep → A06 |
| A08 | Remove office | Confirmation or active-booking blocker | Remove → A02; keep → A03; deactivate → A04 |
| M01 | Customer sign-in | Email, password, demo sign-in | M02 |
| M02 | Office search | Name, city, dates, reference coordinates, radius, type, people | M03 |
| M03 | Available offices | Matching available offices, distance, total for selected dates, sorting, pagination | M04, M02 |
| M04 | Office detail | Image and map placeholders, amenities, capacity, location, period total | M05, M03 |
| M05 | Review office booking | Dates, customer, provider, total, explicit confirm | M06, M03, M04 |
| M06 | Office confirmation | Booking reference, summary, optional parking prompt | M07, M11 |
| M07 | Parking search/results | Inherited dates and coordinates, radius 1 km, editable filters, total quote, pagination | M08, M11 |
| M08 | Parking detail | Provider, image/map placeholders, location, type, quote | M09, M07 |
| M09 | Review parking booking | Provider, period, customer, quoted total, explicit confirm | M10, M07, M08 |
| M10 | Parking confirmation | Separate parking reference, summary | M11 |
| M11 | My bookings | Own office/parking records, search, status filter, sorting, pagination | M12, M02 |
| M12 | Booking detail | Provider, source, reference, dates, customer, status, total | M13, M11 |
| M13 | Customer cancellation | Confirmation for either service; independent cancellation | Confirm/keep → M12 |
| M14 | Account | Demo identity, My bookings, sign-out | M11, M01 |

These IDs are documentation references. The React mock opens directly into the app screens. Use the app links and the small Web app / Mobile app switch to explore. Sign-out opens each sign-in screen. The demo begins with a sample session; production must enforce real authentication.

Main paths:

- Admin inventory: A01 → A02 → A03 → A04 → A03; A02 → A04 also adds an office.
- Admin removal: A03 → A08 confirmation → A02; active bookings block removal.
- Admin bookings: A05 → A06 → A07 cancellation dialog → A06.
- Customer office: M01 → M02 → M03 → M04 → M05 → M06.
- Optional parking: M06 → M07 → M08 → M09 → M10.
- Manage either booking: M11 → M12 → M13 cancellation dialog → M12.
- Account: M14 → M11 or sign-out → M01.

Cancellation and removal confirmations are React modal dialogs, rather than separate full-page layouts. The mobile mock is rendered with React DOM inside a phone frame; it is not an Expo build.

## Requirement coverage

| Brief requirement | Screens | Prototype coverage / later work |
| --- | --- | --- |
| Admin view, add, edit, remove items | A02–A04, A08 | Mutable in-memory offices. Removal blocked for offices with confirmed bookings. |
| Manage item image(s) | A03–A04 | Add/remove placeholder slots; actual file selection, storage and image delivery come later. |
| Manage location and relevant metadata | A03–A04 | Address, city, latitude/longitude, type, capacity, amenities and rate. Map integration comes later. |
| View booking period | A05–A06 | Date range shown in list and details. |
| Identify originating system | A05–A06 | Officely mobile vs Flatly; provider is shown separately. |
| Identify the booking customer | A05–A06 | Name and email. All fictional sample data. |
| Optional admin cancellation | A07 | Included as a proposed feature; local status changes appear in the customer view for that customer's bookings. |
| Search, sorting, paging on repeated data | A02, A05, M02–M03, M07, M11 | Controls work locally. Production must perform these operations on the server, including partner results. |
| Customer browse/search own service | M02–M04 | Name, city, coordinates, proximity, workspace type and capacity. |
| Only available items for the chosen period | M03, M07 | Excludes inactive offices and overlaps with confirmed sample reservations; rechecked at booking. |
| Display total for selected period | M03–M05, M07–M09 | Totals use the selected date range; result cards do not show an unrelated daily price. |
| Book own service | M05–M06 | Adds a demo reservation; visible in My bookings and the admin booking list. |
| Search and book partner service | M07–M10 | Parkly parking, default 1 km from booked office, inherited dates; separate confirmation. |
| Partner computes price | M07–M09 | Clearly marked mock partner quote. Local sample arithmetic stands in for Parkly's API response; final implementation must use the partner's returned quote. |
| View all own bookings | M11–M12 | Combines the demo customer's office and parking reservations; excludes other customers. |
| Cancel own and partner bookings in the same app | M13 | Independent local cancellation of either service; the other reservation remains confirmed. |
| Authentication and restricted visibility | A01, M01, M11–M14 | Sign-in wireframes, fixed demo roles and customer-scoped records. No real access control in this static prototype. Enforce on the backend later. |
| UX design with clear paths | All screens + this document | Clickable app navigation; screen IDs and path inventory recorded here. |
| REST APIs and API documentation | Future implementation | Interface implications recorded below; no backend claimed or implemented. |

## Walkthroughs for group review

### 1. Office → parking → independent cancellation

1. Reset the demo. Open **Mobile app**. It starts in a sample session; Account → Sign out opens the prefilled sign-in.
2. Search Warsaw, **1–8 December 2026**, within **5 km**, any type, capacity 1.
3. Open **Central studio**. The total is **1,260 PLN** for 7 days.
4. Continue, review, confirm. Note the new office booking reference.
5. Choose **Find nearby parking**. The dates and office coordinates are carried over; radius is **1 km**.
6. Open **Centrum covered parking**. The mocked Parkly quote is **245 PLN** for 7 days.
7. Confirm and open My bookings. Both reservations are present; paging may be needed.
8. Find the new Parkly booking, choose Manage, then Cancel booking.
9. Confirm cancellation. The parking status changes to Cancelled. The office remains Confirmed.
10. Open Web app → Bookings. Search the new office reference. Its source is Officely mobile; the parking reservation is not in this office inventory.

### 2. Inventory management

1. Open Web app → Add office. Use Sign out to review the admin sign-in if needed.
2. Enter a name, type, capacity, city/address, coordinates, price, amenities and description.
3. Add two image placeholders, remove one, save.
4. Reopen Edit, change the capacity, save and confirm the detail updates.
5. Remove this new office. It has no active bookings and can be removed.
6. Open Central studio → Remove office. Its confirmed sample booking blocks removal; Edit listing status offers deactivation instead.

### 3. Incoming partner booking and optional admin cancellation

1. Open Web app → Bookings.
2. Set Booked through to Flatly; the list updates immediately.
3. Open **OFF-1041**. Verify provider Officely, source Flatly, customer Sam Lee, dates 1–8 December.
4. Open the cancellation confirmation. Discuss how the change will reach Flatly and its customer before implementing this optional operation.

### 4. Errors and empty states

1. On office results, open Demo options and select No results or Service unavailable.
2. On an office review, select Availability conflict. Confirm is replaced by a route to alternative results.
3. On parking results, select Service unavailable. The screen states that the office booking is unchanged and offers retry or My bookings.
4. On parking review, select Booking failed. No partner reservation is created by the simulated failed attempt.
5. Open a cancellation dialog and choose Keep booking to verify that it remains confirmed; confirm cancellation to change only that reservation.
6. Set the end date before the start date in search. The form stays on search with a date-validation message.

## Proposed decisions, pending group review

- **Language:** English. Easy to change after agreeing on terminology.
- **Office categories:** private office, coworking desk, meeting room. Capacity is a minimum filter. One listing represents one reservable unit; shared seat inventory is not modeled.
- **Dates:** whole-day bookings with an exclusive end date. For example, 1–8 December is seven days. No hourly booking in this draft.
- **Currency and pricing:** PLN, a single total, no proposed tax/fee breakdown or payment screen. Office prices use a simple daily sample rate. Production partner prices are owned by Parkly.
- **Optional parking:** start with the office's location and dates, radius 1 km. The customer may change dates/radius or skip parking. A direct Parking tab permits searching without an existing office booking.
- **Independent reservations:** an office and parking have separate references and cancellation actions. Cancelling one does not automatically cancel the other.
- **Removal:** an office with confirmed reservations cannot be removed; deactivation stops new reservations without changing existing ones. This is a proposed policy, not an explicit rule from the brief.
- **Accounts:** sign-in only for this draft; use fixed demo identities. Registration, password recovery and profile editing need a scope decision before being added as planned features.
- **Admin cancellation:** optional in the brief; provisionally included. Customer notification and partner synchronization still need design agreement.
- **Availability periods:** occupied date ranges derive from confirmed reservations; listing deactivation applies generally. Date-specific maintenance blocks are not yet planned.
- **Integration architecture:** propose mobile → Officely backend → Parkly backend. This is a recommendation for team discussion, not an agreed data contract.

## Partner contract questions for a later backend discussion

These are design dependencies, not implemented endpoints.

| Topic | Information / agreement needed |
| --- | --- |
| Availability search | Date semantics/time zone, reference coordinates, radius units, filters, sorting, page/page size. |
| Offer and quote | Provider/item ID, name, images, location, availability, total, currency, quote ID/expiry if supported. |
| Booking request | Customer identity mapping, provider/item ID, period, quote reference and duplicate-request handling. |
| Booking response | Provider booking reference, period, total, status and originating application. |
| Cancellation | Eligibility, cancellation status, retry behavior and propagation to the originating application. |
| Failure | Distinguish no results, unavailable item, expired quote, unreachable service and unknown request outcome. |
| Authorization | Authenticate service calls and ensure customers can only read/cancel their own reservations. |

## Phase-one submission preparation

- Review all screens with the team and agree on the proposed decisions.
- Treat only agreed features as the final planned scope; add screens if the team adds registration, hourly slots or other features.
- Share the React project source and this document, excluding node_modules and .tools, or publish its Vite build later. The local project does not yet provide a teacher-accessible URL.
- A browser's Print / Save as PDF can capture the current wireframe. This document records all screen paths; printing does not automatically export every screen.
- Test the actual shared link/file access with the teachers' expected permissions before submission.
- Confirm the repository name: the supplied submission text says `FinalProjectFlatly`, but the user's team service is Officely. No repository has been created.

Backend implementation, hosting, GitHub submission, Expo installation instructions and the final presentation are outside this starting prototype task. React/TypeScript is already used for all mock screens; the backend and native mobile work remain later phases.
