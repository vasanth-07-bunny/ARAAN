# araan links Dashboard Clone — Visible UI Transcription

Source: `WhatsAppVideo2026-09-27at3.52.28PM.mp4`  
Recording: vertical screen capture, approximately 4:37, logged-in member `chatakonda`  
Source domain visible in the recording: `arolinks.com`

> This is a faithful UI transcription from the recording and frame-by-frame review. Some small text is inferred from the screen recording and the original UI structure; the clone keeps the visible wording and fields intact while using non-sensitive placeholder data where the recording was not fully legible.

## Global navigation and shell

### Header

- Arolinks / publisher dashboard branding
- Hamburger / menu toggle
- Telegram
- `SHORT NOW`
- Notifications
- Dashboard breadcrumb / current page title
- Logged-in user: `chatakonda`
- Publisher account

### Sidebar navigation

#### Workspace

- Dashboard
- Earn Now
- `NEW`
- Statistics
- Manage Links
- Withdraw

#### Growth

- Tools
- Referrals
- Invoices

#### Account

- Settings
- Support
- Change Your Plan

#### Current plan block

- Current plan
- `Default - $10 CPM`
- `Expires: Never`
- `View plans`

## Dashboard

### Page header

- Workspace / Overview
- `Dashboard`
- `Monitor your links, revenue, and traffic performance.`
- `Live workspace`
- `14 August 2026`

### Quick link card

- `Quick action`
- `FAST LANE`
- `Shorten a new link`
- `Turn any long URL into a trackable, share-ready link.`
- Input placeholder: `Your URL Here`
- Button: `Shorten`
- Link: `Advanced Options`

### Plan banner

- `YOUR CURRENT PLAN`
- `Default`
- `$10 CPM`
- `4 pages of ads · Fixed rate payout`
- Button: `Change Plan`

### This Month's report

- Section label: `Performance / Monthly report`
- `This Month's report`
- Date control: `14 August`

Metric cards:

| Label | Value | Supporting text |
|---|---:|---|
| Total Views | `0` | No traffic yet |
| Total Earnings | `$0.00` | This month |
| Referral Earnings | `$0.00` | 10% lifetime commission |
| Average CPM | `0` | Current plan rate |

### Today's report

- `Realtime pulse`
- `Today's report`
- `14 August · 10:00 PM`

| Label | Value |
|---|---:|
| Views | `0` |
| Link earnings | `$0.00` |
| Referral earnings | `$0.00` |
| Daily CPM | `0` |

### Statistics chart

- `Traffic analytics`
- `August 2026`
- Legend: `Views`, `Earnings`
- Y-axis labels: `100`, `75`, `50`, `25`, `0`
- X-axis labels: `01 Aug`, `07 Aug`, `14 Aug`, `21 Aug`, `31 Aug`
- The recording shows a flat / empty chart with no activity.

### Announcements

- `Keep in the loop`
- `Announcements`
- `Allowed traffic sources update`
- Date: `January 25, 2025`
- Body: `Use social, search, and direct traffic to keep your account in good standing.`
- `Important notice`
- `Traffic quality policy`
- Body: `PTC, Faucet sites, bots, and artificial traffic generators are not allowed.`
- Link: `Read all notices`

### Daily performance table

- `Detailed breakdown`
- `Daily performance`
- Button: `Export CSV`

| DATE | VIEWS | LINK EARNINGS | DAILY CPM | REFERRAL EARNINGS |
|---|---:|---:|---:|---:|
| 14 Aug | 0 | `$0.00` | 0 | `$0.00` |
| 13 Aug | 0 | `$0.00` | 0 | `$0.00` |
| 12 Aug | 0 | `$0.00` | 0 | `$0.00` |
| 11 Aug | 0 | `$0.00` | 0 | `$0.00` |
| 10 Aug | 0 | `$0.00` | 0 | `$0.00` |
| 09 Aug | 0 | `$0.00` | 0 | `$0.00` |
| 08 Aug | 0 | `$0.00` | 0 | `$0.00` |

- Pagination text: `Showing 1–7 of 31 days`
- Pagination controls: `1`, `2`, `3`

## Earn Now

Selecting Earn Now in the recording leads to an error page:

- `404`
- `Not Found`
- `The requested address '/member/offerwall' was not found on this server.`

## Statistics

### Summary metric cards

- `Total Views` — `0` — `Lifetime`
- `Total Earnings` — `$0.00` — `Lifetime`
- `Best CPM` — `0` — `No data yet`
- `Conversion rate` — `0%` — `No data yet`

### Chart

- `Monthly performance`
- `Views & earnings`
- Date control: `August 2026`
- Same chart axis labels as Dashboard.

### Daily report

- `August 2026`
- `Daily report`
- `Filter`
- Same columns as the Dashboard daily performance table.

## Manage Links

### Tabs

- `All Links` — `0`
- `Hidden Links` — `0`

### All Links filter fields

- `Link library`
- `All links`
- Button: `New link`
- Field: `Alias`
  - Example placeholder: `e.g. summer-offer`
- Field: `Advertising Type`
  - Dropdown options: `All advertising types`, `Interstitial`, `Direct link`, `Banner`
- Field: `Title, Desc, or URL`
  - Placeholder: `Search your links`
- Buttons: `Filter`, `Reset`
- Empty state: `No links found`
- Empty state message: `Shorten your first link to see it here.`
- Button: `Create a link`

### Hidden Links filter fields

- `Hidden links`
- Field: `Link ID`
  - Example placeholder: `e.g. 10293`
- Field: `Alias`
- Field: `Title, Desc, or URL`
- Buttons: `Filter`, `Reset`
- Empty state: `No links found`

## Tools

### Tool navigation

- `Quick Link`
- `Mass Shrinker`
- `Full Page Script`
- `Developers API`
- `Bookmarklet`

### Quick Link

- `Developer utility`
- `Quick Link`
- `Your API token`
- Visible token begins: `b802a6f2c33c7dc20e4adf2c1736345...`
- Instruction: `Build your request`
- Instruction: `Send a GET request with your API token and the URL you want to shorten.`
- Instruction: `Share the response`
- Instruction: `Use the returned short link anywhere you publish content.`
- Example endpoint:

```text
https://arolinks.com/api?api=YOUR_API_KEY&url=YOUR_URL
```

- Button: `Copy example`

### Mass Shrinker

- `Batch workflow`
- `Mass Shrinker`
- `Paste up to 20 URLs, one per line, and we’ll create short links in one batch.`
- Large textarea for one URL per line
- Counter: `0/20 URLs added`
- Button: `Shorten URLs`

### Full Page Script

- `Site automation`
- `Full Page Script`
- `Generate a script to automatically shorten links across your website.`
- Radio option: `Include selected domains`
- Radio option: `Exclude selected domains`
- Textarea for domain names
- Button: `Generate script`

### Developers API

- `Integration reference`
- `Developers API`
- `Connect Arolinks to your own tools using a lightweight GET endpoint.`
- Tabs: `JSON response`, `TEXT response`
- Endpoint: `GET https://arolinks.com/api`
- Parameters: `api=YOUR_API_KEY`, `url=https://example.com/long-url`
- Example response keys: `status`, `shortenedUrl`
- Security note: `Keep your API token private. Never expose it in client-side code.`

### Bookmarklet

- `Browser shortcut`
- `Bookmarklet`
- `Drag this button to your browser toolbar. Use it on any page to shorten the current URL.`
- Button: `Shorten!`
- `Drag & drop`
- `Place the button in your bookmarks bar for one-click shortening.`

## Referrals

- `Partner program`
- `Grow together, earn together.`
- `Invite your network to Arolinks and receive a 10% lifetime commission from every referral.`
- Referral URL: `https://arolinks.com/ref/chatakonda`
- `Your network`
- `My Referrals`
- `0 referrals`

### My Referrals table

| Username | Date |
|---|---|
| Empty | Empty |

- Empty state: `No referrals yet`
- Empty state message: `Share your referral link to get started.`

## Invoices

- `Billing history`
- `Manage Invoices`
- Button: `Download all`

### Invoice table

| ID | Status | Description | Amount | Payment Method |
|---|---|---|---:|---|
| Empty | Empty | Empty | Empty | Empty |

- Empty state: `No invoices found`
- Empty state message: `Payment records will appear here after your first withdrawal.`

## Withdraw

### Balance cards

- `Available Balance` — `$0.00`
- `Pending Withdrawn` — `$0.00`
- `Total Withdraw` — `$0.00`

### Withdrawal panel

- `Ready when you are`
- `Withdraw funds`
- `Available`
- `Current balance`
- `$0.00`
- `Payment method`
- `Choose a method in Settings`
- Button: `WITHDRAW`

### Payout guide

- `Payout guide`
- `How it works`
- `Payments are reviewed and processed within 2–4 business days.`

Statuses:

| Status | Meaning |
|---|---|
| Pending | Request received |
| Approved | Request verified |
| Complete | Funds sent |
| Cancelled | Request stopped |
| Returned | Funds returned |

## Settings

### Tabs

- `Profile`
- `Change Password`
- `Change Email`

### Profile — Billing Address fields

- `First Name`
- `Last Name`
- `Address`
- `City`
- `State`
- `ZIP`
- `Country`
- `Phone Number`

### Profile — Contact Methods fields

- `WhatsApp Number`
- `Telegram Username`
- `Skype ID`

### Profile — Withdrawal Info fields

- `Withdrawal Method`
- Options visible in the recording / replica:
  - `Select payment method`
  - `PayPal`
  - `Bitcoin`
  - `Bank Transfer India`
  - `UPI`
  - `GooglePay`

Minimum withdrawal list:

| Method | Minimum |
|---|---:|
| PayPal | `$5.00` |
| Bitcoin | `$20.00` |
| Bank Transfer India | `$2.00` |
| UPI | `$2.00` |
| GooglePay | `$2.00` |

- Button: `Save changes`

### Change Password fields

- `Current Password`
- `New Password`
- `Re-enter New Password`
- Button: `Update password`

### Change Email fields

- `Current email`
- Current value: `chatakondavasanth360@gmail.com`
- `New Email`
- `Re-enter New Email`
- Button: `Update email`

## Support

### Support Ticket form

- `Submit a support ticket`
- `We usually reply within 24 hours.`
- `Name`
- `Subject`
- `Email`
- `Message`
- Message placeholder: `Describe your question or issue...`
- Button: `Send ticket`

### Support contact block

- `Need a quick answer?`
- `Talk to us directly`
- `Reach the support team on WhatsApp or Telegram.`
- Buttons: `WhatsApp`, `Telegram`
- `Average response` — `< 24 hours`
- `Support hours` — `24 / 7`

## Change Your Plan

### Common features

- `Telegram Bot`
- `24/7 support`
- `Quality traffic tools`

### Plan cards

| Plan | Rate | Pages | Views / day | State |
|---|---:|---|---|---|
| Default | `$10 CPM` | 4 pages of ads | Fixed rate payout | Active |
| $8 CPM | `$8 CPM` | 3 pages | 2 IP views / day | Available |
| Professional | `$5 CPM` | 2 pages | 3 IP views / day | Available |
| Advanced | `$3 CPM` | 1 page | 2 IP views / day | Available |
| Easy Pages | `$10 CPM` | 3–4 simple pages | 2 IP views / day | Available |

- Common plan line: `Telegram Bot + 24/7 support`
- Buttons: `Current plan`, `Choose plan`, `Selected`

## Functional behavior in the clone

- Sidebar navigation switches between every screen listed above.
- Sidebar can collapse on desktop and slide open on mobile.
- `SHORT NOW` scrolls to the dashboard shortener.
- Shortening a URL creates a deterministic-looking demo short URL and supports copy-to-clipboard.
- Manage Links supports All Links / Hidden Links tabs, filter state, and reset.
- Tools switch between Quick Link, Mass Shrinker, Full Page Script, Developers API, and Bookmarklet.
- Mass Shrinker accepts up to 20 lines and returns demo short URLs.
- Referral URL and API token have copy interactions.
- Settings tabs expose profile, password, and email forms with save/update feedback.
- Support ticket and plan selections show success feedback.
- Withdraw shows the empty-balance guard message rather than submitting a payout.
- Earn Now reproduces the recorded 404 Not Found screen.
