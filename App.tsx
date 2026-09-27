import { Fragment, useState, type ComponentType } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Copy,
  CreditCard,
  ExternalLink,
  FileCode2,
  FileText,
  Filter,
  Globe2,
  HelpCircle,
  KeyRound,
  LayoutDashboard,
  Link2,
  ListFilter,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  MoreHorizontal,
  MousePointer2,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCcw,
  Rocket,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Ticket,
  TrendingUp,
  UserRound,
  Users,
  Pencil,
  SlidersHorizontal,
  ArrowUpDown,
  Wallet,
  Zap,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { filterLinks, isValidAlias, linksToCsv, normalizeAlias, type ShortLink } from "./link-utils";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "earn", label: "Earn Now", icon: Rocket, badge: "NEW" },
      { id: "statistics", label: "Statistics", icon: BarChart3 },
      { id: "links", label: "Manage Links", icon: Link2 },
      { id: "withdraw", label: "Withdraw", icon: Wallet },
    ],
  },
  {
    label: "Growth",
    items: [
      { id: "tools", label: "Tools", icon: Zap },
      { id: "referrals", label: "Referrals", icon: Users },
      { id: "invoices", label: "Invoices", icon: FileText },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "settings", label: "Settings", icon: Settings },
      { id: "support", label: "Support", icon: HelpCircle },
      { id: "plans", label: "Change Your Plan", icon: Sparkles },
    ],
  },
];

const pageTitles: Record<string, { eyebrow: string; title: string; description: string }> = {
  dashboard: { eyebrow: "Workspace / Overview", title: "Dashboard", description: "Monitor your links, revenue, and traffic performance." },
  statistics: { eyebrow: "Workspace / Analytics", title: "Statistics", description: "A closer look at your monthly traffic and earnings." },
  links: { eyebrow: "Workspace / Manage", title: "Manage Links", description: "Search, filter, and organize every shortened link." },
  tools: { eyebrow: "Growth / Toolkit", title: "Tools", description: "Power tools for shortening links at scale." },
  referrals: { eyebrow: "Growth / Network", title: "Referrals", description: "Invite creators and earn a 10% lifetime commission." },
  invoices: { eyebrow: "Growth / Billing", title: "Invoices", description: "Review payment records and billing history." },
  withdraw: { eyebrow: "Account / Payouts", title: "Withdraw", description: "Request a payout when your available balance is ready." },
  settings: { eyebrow: "Account / Preferences", title: "Settings", description: "Manage your profile, payout method, and security." },
  support: { eyebrow: "Account / Help desk", title: "Support", description: "Send a ticket to the Arolinks support team." },
  plans: { eyebrow: "Account / Membership", title: "Change Your Plan", description: "Choose the payout structure that fits your traffic." },
  earn: { eyebrow: "Workspace / Earn", title: "Earn Now", description: "Turn every share into a clearer path to your next payout." },
};

type IconType = ComponentType<{ size?: number; strokeWidth?: number }>;
const mockLinks: ShortLink[] = [
  { id: "demo-1", url: "https://www.arolinks.com/blog/creator-monetization", shortUrl: "https://aro.li/creator-playbook", alias: "creator-playbook", title: "Creator monetization playbook", description: "A guide for growing a publishing business.", advertisingType: "Interstitial", createdAt: "2 hours ago", clicks: 1842, earnings: 18.42, status: "Active" },
  { id: "demo-2", url: "https://www.arolinks.com/tools/utm-builder", shortUrl: "https://aro.li/utm-tool", alias: "utm-tool", title: "UTM campaign builder", description: "Build cleaner tracking links for every campaign.", advertisingType: "Direct link", createdAt: "Yesterday", clicks: 936, earnings: 9.36, status: "Active" },
  { id: "demo-3", url: "https://www.arolinks.com/academy/social-growth", shortUrl: "https://aro.li/social-growth", alias: "social-growth", title: "Social growth academy", description: "Practical lessons for a better content engine.", advertisingType: "Banner", createdAt: "3 days ago", clicks: 611, earnings: 6.11, status: "Active" },
  { id: "demo-4", url: "https://www.arolinks.com/newsletter", shortUrl: "https://aro.li/weekly-brief", alias: "weekly-brief", title: "The weekly brief", description: "A concise weekly roundup for the community.", advertisingType: "Interstitial", createdAt: "5 days ago", clicks: 278, earnings: 2.78, status: "Active" },
];

const formatMoney = (value: number) => `$${value.toFixed(2)}`;
const totalClicks = (links: ShortLink[]) => links.reduce((sum, link) => sum + link.clicks, 0);
const totalEarnings = (links: ShortLink[]) => links.reduce((sum, link) => sum + link.earnings, 0);

function Icon({ icon: IconComponent, size = 16 }: { icon: IconType; size?: number }) {
  return <IconComponent size={size} strokeWidth={1.8} />;
}

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window === "undefined" || window.innerWidth >= 900);
  const [url, setUrl] = useState("");
  const [shortened, setShortened] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [links, setLinks] = useState<ShortLink[]>(mockLinks);
  const [payoutMethod, setPayoutMethod] = useState("");

  const navigate = (page: string) => {
    setActivePage(page);
    if (window.innerWidth < 900) setSidebarOpen(false);
  };

  const focusShortener = () => {
    navigate("dashboard");
    window.setTimeout(() => document.getElementById("quick-shortener-input")?.focus(), 80);
  };

  const handleShorten = () => {
    const rawUrl = url.trim();
    if (!rawUrl) {
      toast.error("Paste a URL to shorten it.");
      return;
    }

    const candidate = rawUrl.match(/^https?:\/\//i) ? rawUrl : `https://${rawUrl}`;
    try {
      const parsed = new URL(candidate);
      if (!parsed.hostname.includes(".")) throw new Error("invalid hostname");
      const token = Math.random().toString(36).slice(2, 8);
      const normalizedAlias = normalizeAlias(customAlias);
      if (normalizedAlias && !isValidAlias(normalizedAlias)) {
        toast.error("Use 3–31 lowercase letters, numbers, or hyphens for your alias.");
        return;
      }
      if (normalizedAlias && links.some((link) => link.alias === normalizedAlias)) {
        toast.error("That alias is already in use. Try another one.");
        return;
      }
      const alias = normalizedAlias || token;
      const createdLink: ShortLink = {
        id: `${Date.now()}-${token}`,
        url: parsed.toString(),
        shortUrl: `https://aro.li/${alias}`,
        alias,
        title: linkTitle.trim() || parsed.hostname.replace(/^www\./, ""),
        description: "",
        advertisingType: "Interstitial",
        createdAt: "Just now",
        clicks: 0,
        earnings: 0,
        status: "Active",
      };
      setLinks((current) => [createdLink, ...current]);
      setShortened(createdLink.shortUrl);
      setUrl("");
      setCustomAlias("");
      setLinkTitle("");
      toast.success("Short link created", { description: `${createdLink.shortUrl} is ready to share.` });
    } catch {
      toast.error("Enter a valid website address, like example.com.");
    }
  };

  const title = pageTitles[activePage] ?? pageTitles.dashboard;

  return (
    <div className="app-shell">
      <Toaster position="bottom-right" theme="dark" richColors />
      <aside className={`sidebar ${sidebarOpen ? "is-open" : "is-collapsed"}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Link2 size={19} /></div>
          {sidebarOpen && <div><strong>aaran links</strong><span>publisher console</span></div>}
        </div>
        <button className="sidebar-toggle" onClick={() => setSidebarOpen((value) => !value)} aria-label="Toggle sidebar">
          {sidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
        <nav className="side-nav">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              {sidebarOpen && <div className="nav-label">{group.label}</div>}
              {group.items.map((item) => (
                <button key={item.id} className={`nav-item ${activePage === item.id ? "active" : ""}`} onClick={() => navigate(item.id)} title={!sidebarOpen ? item.label : undefined}>
                  <Icon icon={item.icon} />
                  {sidebarOpen && <span>{item.label}</span>}
                  {sidebarOpen && item.badge && <span className="nav-badge">{item.badge}</span>}
                  {sidebarOpen && activePage === item.id && <ChevronRight className="nav-current" size={14} />}
                </button>
              ))}
            </div>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="plan-mini-card">
            <div className="plan-mini-top"><span>Current plan</span><ShieldCheck size={15} /></div>
            <strong>Default <em>$10 CPM</em></strong>
            <span>Expires: Never</span>
            <button onClick={() => navigate("plans")}>View plans <ArrowUpRight size={13} /></button>
          </div>
        )}
        <div className="sidebar-user">
          <div className="avatar">C</div>
          {sidebarOpen && <div className="user-copy"><strong>chatakonda</strong><span>Publisher account</span></div>}
          {sidebarOpen && <MoreHorizontal size={17} className="user-more" />}
        </div>
      </aside>

      <main className={`main-shell ${sidebarOpen ? "with-sidebar" : "wide"}`}>
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu" onClick={() => setSidebarOpen((value) => !value)} aria-label="Toggle navigation"><Menu size={20} /></button>
            <div className="breadcrumb"><span>AARAN LINKS</span><ChevronRight size={13} /><strong>{title.title.toUpperCase()}</strong></div>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications" onClick={() => toast.info("You’re all caught up.")}><Bell size={17} /><span className="notification-dot" /></button>
            <button className="telegram-button" onClick={() => toast.info("Telegram support opens in a new window.")}><Send size={15} /> Telegram</button>
            <button className="short-now-button" onClick={focusShortener}><Plus size={16} /> SHORT NOW</button>
          </div>
        </header>

        <div className="content-wrap">
          <div className="page-heading">
            <div><div className="eyebrow">{title.eyebrow}</div><h1>{title.title}</h1><p>{title.description}</p></div>
            <div className="heading-meta"><span className="live-dot" /> Live workspace <span className="meta-divider" /> <span>14 August 2026</span></div>
          </div>

          {activePage === "dashboard" && <Dashboard url={url} setUrl={setUrl} customAlias={customAlias} setCustomAlias={setCustomAlias} linkTitle={linkTitle} setLinkTitle={setLinkTitle} shortened={shortened} onShorten={handleShorten} onCreate={focusShortener} navigate={navigate} links={links} payoutMethod={payoutMethod} />}
          {activePage === "statistics" && <Statistics links={links} />}
          {activePage === "links" && <ManageLinks links={links} setLinks={setLinks} onCreate={focusShortener} />}
          {activePage === "tools" && <Tools />}
          {activePage === "referrals" && <Referrals />}
          {activePage === "invoices" && <Invoices />}
          {activePage === "withdraw" && <Withdraw payoutMethod={payoutMethod} />}
          {activePage === "settings" && <SettingsPage payoutMethod={payoutMethod} onPayoutMethodChange={setPayoutMethod} />}
          {activePage === "support" && <Support />}
          {activePage === "plans" && <Plans />}
          {activePage === "earn" && <EarnNow navigate={navigate} />}
        </div>
      </main>
    </div>
  );
}

function Dashboard({ url, setUrl, customAlias, setCustomAlias, linkTitle, setLinkTitle, shortened, onShorten, onCreate, navigate, links, payoutMethod }: { url: string; setUrl: (value: string) => void; customAlias: string; setCustomAlias: (value: string) => void; linkTitle: string; setLinkTitle: (value: string) => void; shortened: string; onShorten: () => void; onCreate: () => void; navigate: (page: string) => void; links: ShortLink[]; payoutMethod: string }) {
  const completedSteps = (links.length > 0 ? 1 : 0) + (payoutMethod ? 1 : 0);
  const clicks = totalClicks(links);
  const earnings = totalEarnings(links);
  return <>
    <section className="hero-grid">
      <div className="quick-card" id="quick-shortener">
        <div className="card-kicker"><span className="kicker-icon"><MousePointer2 size={15} /></span><span>Quick action</span><span className="card-chip">FAST LANE</span></div>
        <h2>Shorten a new link</h2>
        <p>Turn any long URL into a trackable, share-ready link.</p>
        <form className="shorten-row" onSubmit={(event) => { event.preventDefault(); onShorten(); }}>
          <input id="quick-shortener-input" type="text" inputMode="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Paste a URL, e.g. yoursite.com/article" aria-label="URL to shorten" />
          <button type="submit" disabled={!url.trim()}>Shorten <ArrowUpRight size={16} /></button>
        </form>
        <div className="shorten-options">
          <label><span>Custom alias <em>optional</em></span><div className="alias-input"><span>aro.li/</span><input value={customAlias} onChange={(event) => setCustomAlias(event.target.value)} placeholder="my-campaign" /></div></label>
          <label><span>Link title <em>optional</em></span><input value={linkTitle} onChange={(event) => setLinkTitle(event.target.value)} placeholder="Campaign title" /></label>
        </div>
        <div className="input-hint">Press Enter to create · Add an alias to make your vanity URL memorable</div>
        {shortened && <div className="shortened-result"><Check size={14} /><span>{shortened}</span><button type="button" aria-label="Copy shortened link" onClick={() => { navigator.clipboard?.writeText(shortened); toast.success("Link copied"); }}><Copy size={14} /></button><button type="button" className="result-view" onClick={() => navigate("links")}>View <ExternalLink size={12} /></button></div>}
        <button className="advanced-link" onClick={() => navigate("tools")}>Advanced Options <ChevronRight size={14} /></button>
      </div>
      <div className="plan-banner">
        <div className="plan-orbit"><Sparkles size={25} /></div>
        <div><span className="card-kicker">YOUR CURRENT PLAN</span><h3>Default <strong>$10 <small>CPM</small></strong></h3><p>4 pages of ads · Fixed rate payout</p></div>
        <button onClick={() => navigate("plans")}>Change Plan <ArrowUpRight size={15} /></button>
      </div>
    </section>

    <section className="action-grid">
      <div className="panel activation-panel">
        <div className="panel-heading"><div><span className="eyebrow">Your next best move</span><h2>Start earning in 3 steps</h2></div><span className="progress-count">{completedSteps}/3 complete</span></div>
        <div className="progress-track"><span style={{ width: `${Math.max(8, (completedSteps / 3) * 100)}%` }} /></div>
        <div className="activation-steps">
          <button className={`activation-step ${links.length > 0 ? "complete" : "current"}`} onClick={onCreate}><span className="step-number">{links.length > 0 ? <Check size={13} /> : "1"}</span><span><strong>Shorten your first link</strong><small>{links.length > 0 ? "First link created — keep publishing." : "Create a share-ready link in seconds."}</small></span><ArrowUpRight size={14} /></button>
          <button className={`activation-step ${payoutMethod ? "complete" : ""}`} onClick={() => navigate("settings")}><span className="step-number">{payoutMethod ? <Check size={13} /> : "2"}</span><span><strong>{payoutMethod ? "Payout method connected" : "Add a payout method"}</strong><small>{payoutMethod ? `${payoutMethod} is ready for withdrawals.` : "Be ready when your balance reaches the minimum."}</small></span>{payoutMethod ? <Check size={14} /> : <ArrowUpRight size={14} />}</button>
          <button className="activation-step" onClick={() => navigate("referrals")}><span className="step-number">3</span><span><strong>Invite your network</strong><small>Earn a 10% lifetime commission on referrals.</small></span><ArrowUpRight size={14} /></button>
        </div>
      </div>
      <div className="panel recent-panel">
        <div className="panel-heading"><div><span className="eyebrow">Workspace pulse</span><h2>Recent links</h2></div><button className="text-button compact-button" onClick={() => navigate("links")}>View all <ArrowUpRight size={14} /></button></div>
        {links.length > 0 ? <div className="recent-list">{links.slice(0, 3).map((link) => <div className="recent-link" key={link.id}><div className="recent-link-icon"><Link2 size={14} /></div><div className="recent-link-copy"><strong>{link.shortUrl.replace("https://", "")}</strong><span>{link.url}</span></div><span className="status-pill">{link.status}</span></div>)}</div> : <div className="recent-empty"><div className="empty-icon"><Link2 size={18} /></div><div><strong>Your link library is ready</strong><p>Create your first link and it will appear here.</p></div><button onClick={onCreate}><Plus size={14} /> Create link</button></div>}
      </div>
    </section>

    <section className="section-block">
      <div className="section-title-row"><div><div className="eyebrow">Performance / Monthly report</div><h2>This Month's report</h2></div><button className="date-pill"><CalendarIcon /> 14 August <ChevronDown size={14} /></button></div>
      <div className="metric-grid">
        <Metric icon={EyeIcon} label="Total Views" value={clicks.toLocaleString()} note={`${links.length} active link${links.length === 1 ? "" : "s"}`} tone="cyan" />
        <Metric icon={Wallet} label="Total Earnings" value={formatMoney(earnings)} note="This month" tone="purple" />
        <Metric icon={Users} label="Referral Earnings" value="$24.80" note="10% lifetime commission" tone="orange" />
        <Metric icon={TrendingUp} label="Average CPM" value="$10.00" note="Current plan rate" tone="green" />
      </div>
    </section>

    <section className="section-block">
      <div className="section-title-row"><div><div className="eyebrow">Realtime pulse</div><h2>Today's report</h2></div><span className="muted-label">14 August · 10:00 PM</span></div>
      <div className="today-strip"><MiniMetric label="Views" value={Math.round(clicks * 0.16).toLocaleString()} icon={Activity} /><MiniMetric label="Link earnings" value={formatMoney(earnings * 0.16)} icon={Wallet} /><MiniMetric label="Referral earnings" value="$4.20" icon={Users} /><MiniMetric label="Daily CPM" value="$10.00" icon={BarChart3} /></div>
    </section>

    <section className="report-grid">
      <div className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">Traffic analytics</span><h2>August 2026</h2></div><div className="legend"><span><i className="legend-line views" /> Views</span><span><i className="legend-line earnings" /> Earnings</span></div></div><div className="chart-area"><div className="y-axis"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="chart-canvas"><div className="grid-line line-1" /><div className="grid-line line-2" /><div className="grid-line line-3" /><div className="grid-line line-4" /><div className="grid-line line-5" /><svg viewBox="0 0 700 230" preserveAspectRatio="none" aria-label="August analytics chart"><path d="M0 204 L80 204 L160 204 L240 204 L320 204 L400 204 L480 204 L560 204 L640 204 L700 204" fill="none" stroke="#42c6da" strokeWidth="2" strokeDasharray="5 7" /><path d="M0 205 L85 205 L170 205 L255 205 L340 205 L425 205 L510 205 L595 205 L700 205" fill="none" stroke="#a071ff" strokeWidth="2" strokeDasharray="3 8" /></svg><div className="x-axis"><span>01 Aug</span><span>07 Aug</span><span>14 Aug</span><span>21 Aug</span><span>31 Aug</span></div></div></div></div>
      <div className="panel notice-panel"><div className="panel-heading"><div><span className="eyebrow">Keep in the loop</span><h2>Announcements</h2></div><Bell size={17} /></div><div className="notice-item"><div className="notice-icon blue"><Globe2 size={15} /></div><div><strong>Allowed traffic sources update</strong><span>January 25, 2025</span><p>Use social, search, and direct traffic to keep your account in good standing.</p></div></div><div className="notice-item warning"><div className="notice-icon red"><ShieldCheck size={15} /></div><div><strong>Important notice</strong><span>Traffic quality policy</span><p>PTC, Faucet sites, bots, and artificial traffic generators are not allowed.</p></div></div><button className="text-button" onClick={() => toast.info("All announcements are up to date.")}>Read all notices <ArrowUpRight size={14} /></button></div>
    </section>

    <section className="panel table-panel"><div className="panel-heading"><div><span className="eyebrow">Detailed breakdown</span><h2>Daily performance</h2></div><button className="outline-button" onClick={() => toast.success("Report export prepared")}>Export CSV <ArrowDownToLine size={14} /></button></div><PerformanceTable /></section>
  </>;
}

function Statistics({ links }: { links: ShortLink[] }) {
  const clicks = totalClicks(links);
  const earnings = totalEarnings(links);
  return <><div className="metric-grid"><Metric icon={EyeIcon} label="Total Views" value={clicks.toLocaleString()} note="Lifetime" tone="cyan" /><Metric icon={Wallet} label="Total Earnings" value={formatMoney(earnings)} note="Lifetime" tone="purple" /><Metric icon={Target} label="Best CPM" value="$10.00" note="Current plan" tone="orange" /><Metric icon={TrendingUp} label="Conversion rate" value="12.8%" note="Active account" tone="green" /></div><section className="panel chart-panel wide-panel"><div className="panel-heading"><div><span className="eyebrow">Monthly performance</span><h2>Views & earnings</h2></div><button className="date-pill">August 2026 <ChevronDown size={14} /></button></div><div className="chart-area tall"><div className="y-axis"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="chart-canvas"><div className="grid-line line-1" /><div className="grid-line line-2" /><div className="grid-line line-3" /><div className="grid-line line-4" /><div className="grid-line line-5" /><svg viewBox="0 0 1000 280" preserveAspectRatio="none"><path d="M0 252 L120 252 L240 252 L360 252 L480 252 L600 252 L720 252 L840 252 L1000 252" fill="none" stroke="#42c6da" strokeWidth="3" strokeDasharray="5 8" /><path d="M0 252 L120 252 L240 252 L360 252 L480 252 L600 252 L720 252 L840 252 L1000 252" fill="none" stroke="#a071ff" strokeWidth="3" strokeDasharray="3 9" /></svg><div className="x-axis"><span>01 Aug</span><span>07 Aug</span><span>14 Aug</span><span>21 Aug</span><span>31 Aug</span></div></div></div></section><section className="panel table-panel"><div className="panel-heading"><div><span className="eyebrow">August 2026</span><h2>Daily report</h2></div><button className="outline-button"><Filter size={14} /> Filter</button></div><PerformanceTable /></section></>;
}

function ManageLinks({ links, setLinks, onCreate }: { links: ShortLink[]; setLinks: React.Dispatch<React.SetStateAction<ShortLink[]>>; onCreate: () => void }) {
  const [tab, setTab] = useState("all");
  const [alias, setAlias] = useState("");
  const [search, setSearch] = useState("");
  const [advertisingType, setAdvertisingType] = useState("All advertising types");
  const [sort, setSort] = useState("newest");
  const [submitted, setSubmitted] = useState(false);
  const visibleLinks = filterLinks(links, { tab: tab as "all" | "hidden", alias, search, advertisingType: advertisingType as "All advertising types" | ShortLink["advertisingType"], sort: sort as "newest" | "oldest" | "clicks" | "earnings" });
  const updateLink = (updated: ShortLink) => setLinks((current) => current.map((link) => link.id === updated.id ? updated : link));
  const exportVisibleLinks = () => {
    const blob = new Blob([linksToCsv(visibleLinks)], { type: "text/csv;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = `araan-links-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
    toast.success(`${visibleLinks.length} link${visibleLinks.length === 1 ? "" : "s"} exported`);
  };

  return <><div className="tab-bar"><button className={tab === "all" ? "active" : ""} onClick={() => setTab("all")}>All Links <span>{links.length}</span></button><button className={tab === "hidden" ? "active" : ""} onClick={() => setTab("hidden")}>Hidden Links <span>0</span></button></div><section className="panel filter-panel"><div className="panel-heading"><div><span className="eyebrow">Link library</span><h2>{tab === "all" ? "All links" : "Hidden links"}</h2></div><button className="soft-button" onClick={onCreate}> <Plus size={14} /> New link</button></div><div className="form-grid three"><Field label={tab === "all" ? "Alias" : "Link ID"} placeholder={tab === "all" ? "e.g. summer-offer" : "e.g. 10293"} value={alias} onChange={setAlias} icon={Link2} /><label className="field-label"><span>Advertising Type</span><div className="input-wrap select-wrap"><select value={advertisingType} onChange={(event) => setAdvertisingType(event.target.value)}><option>All advertising types</option><option>Interstitial</option><option>Direct link</option><option>Banner</option></select><ChevronDown size={14} /></div></label><Field label="Title, Desc, or URL" placeholder="Search your links" icon={Search} value={search} onChange={setSearch} /></div><div className="filter-actions"><button className="primary-button" onClick={() => { setSubmitted(true); toast.success(`${visibleLinks.length} link${visibleLinks.length === 1 ? "" : "s"} found`); }}><Filter size={15} /> Filter</button><button className="ghost-button" onClick={() => { setAlias(""); setSearch(""); setAdvertisingType("All advertising types"); setSubmitted(false); }}>Reset</button>{submitted && <span className="filter-result"><Check size={14} /> Search complete</span>}</div></section><section className="panel table-panel"><div className="table-toolbar"><div><span className="table-summary"><SlidersHorizontal size={14} /> {visibleLinks.length} visible links</span></div><div className="table-toolbar-actions"><button className="outline-button" onClick={exportVisibleLinks} disabled={!visibleLinks.length}><ArrowDownToLine size={14} /> Export CSV</button><label className="sort-control"><ArrowUpDown size={14} /><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="clicks">Most clicks</option><option value="earnings">Highest earnings</option></select></label></div></div>{visibleLinks.length > 0 ? <LinkTable links={visibleLinks} onEdit={updateLink} /> : <div className="empty-state"><div className="empty-icon"><Link2 size={22} /></div><h3>{links.length === 0 ? "Your link library is empty" : "No links found"}</h3><p>{links.length === 0 ? "Shorten your first link to start tracking shares and earnings." : `Nothing matches “${search || alias}”. Try another search.`}</p><button className="primary-button" onClick={onCreate}>{links.length === 0 ? "Create your first link" : "Shorten a new link"} <ArrowUpRight size={15} /></button></div>}</section></>;
}

function LinkTable({ links, onEdit }: { links: ShortLink[]; onEdit: (link: ShortLink) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ShortLink | null>(null);
  const beginEdit = (link: ShortLink) => { setEditingId(link.id); setDraft({ ...link }); };
  return <div className="data-table-wrap"><table className="links-table"><thead><tr><th>SHORT LINK</th><th>DESTINATION / METADATA</th><th>CLICKS</th><th>EARNINGS</th><th>STATUS</th><th /></tr></thead><tbody>{links.map((link) => <Fragment key={link.id}>{editingId === link.id && draft ? <tr className="edit-row" key={`${link.id}-edit`}><td colSpan={6}><div className="inline-editor"><div className="inline-editor-heading"><div><span className="eyebrow">Editing link</span><strong>{link.shortUrl}</strong></div><button className="table-icon-button" onClick={() => setEditingId(null)} aria-label="Close editor">×</button></div><div className="form-grid three"><Field label="Alias" value={draft.alias} onChange={(value) => setDraft({ ...draft, alias: value, shortUrl: `https://aro.li/${value || link.alias}` })} /><Field label="Title" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} /><Field label="Description" value={draft.description} onChange={(value) => setDraft({ ...draft, description: value })} /></div><div className="inline-editor-actions"><button className="primary-button" onClick={() => { if (!draft.alias.trim()) { toast.error("Alias cannot be empty."); return; } const cleanAlias = normalizeAlias(draft.alias); onEdit({ ...draft, alias: cleanAlias, shortUrl: `https://aro.li/${cleanAlias}` }); setEditingId(null); toast.success("Link metadata updated"); }}>Save metadata <Check size={14} /></button><button className="ghost-button" onClick={() => setEditingId(null)}>Cancel</button></div></div></td></tr> : <tr key={link.id}><td><div className="link-table-primary"><Link2 size={13} /><strong>{link.shortUrl.replace("https://", "")}</strong></div><span className="table-subtext">{link.alias} · Created {link.createdAt}</span></td><td><strong className="link-title">{link.title}</strong><span className="destination-cell">{link.url}</span><span className="table-subtext">{link.advertisingType} · {link.description || "No description"}</span></td><td>{link.clicks.toLocaleString()}</td><td>{formatMoney(link.earnings)}</td><td><span className="status-pill">{link.status}</span></td><td><button className="table-icon-button" aria-label={`Edit ${link.alias}`} onClick={() => beginEdit(link)}><Pencil size={14} /></button></td></tr>}</Fragment>)}</tbody></table></div>;
}
function Tools() {
  const [tool, setTool] = useState("quick");
  const [urls, setUrls] = useState("");
  const [massResult, setMassResult] = useState<string[]>([]);
  const tools = [{ id: "quick", label: "Quick Link", icon: MousePointer2 }, { id: "mass", label: "Mass Shrinker", icon: ListFilter }, { id: "script", label: "Full Page Script", icon: FileCode2 }, { id: "api", label: "Developers API", icon: BookOpen }, { id: "bookmarklet", label: "Bookmarklet", icon: BookmarkIcon }];
  const shortenMass = () => { const lines = urls.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 20); if (!lines.length) { toast.error("Add at least one URL."); return; } setMassResult(lines.map((_, index) => `https://aro.li/bulk${String(index + 1).padStart(2, "0")}`)); toast.success(`${lines.length} links shortened`); };
  return <><div className="tool-layout"><aside className="tool-nav">{tools.map((item) => <button key={item.id} className={tool === item.id ? "active" : ""} onClick={() => setTool(item.id)}><Icon icon={item.icon} /><span>{item.label}</span><ChevronRight size={14} /></button>)}</aside><div className="tool-content">{tool === "quick" && <ToolQuick />}{tool === "mass" && <div className="panel tool-panel"><ToolHead eyebrow="Batch workflow" title="Mass Shrinker" icon={ListFilter} /><p className="tool-intro">Paste up to 20 URLs, one per line, and we’ll create short links in one batch.</p><textarea className="code-textarea" rows={9} value={urls} onChange={(event) => setUrls(event.target.value)} placeholder="https://example.com/long-url\nhttps://another-site.com/article" /><div className="tool-footer"><span>{urls.split("\n").filter(Boolean).length}/20 URLs added</span><button className="primary-button" onClick={shortenMass}>Shorten URLs <Zap size={15} /></button></div>{massResult.length > 0 && <div className="mass-result">{massResult.map((item) => <div key={item}><span>{item}</span><Copy size={14} onClick={() => { navigator.clipboard?.writeText(item); toast.success("Copied"); }} /></div>)}</div>}</div>}{tool === "script" && <ToolScript />}{tool === "api" && <ToolApi />}{tool === "bookmarklet" && <ToolBookmarklet />}</div></div></>;
}

function ToolQuick() { const [copied, setCopied] = useState(false); const token = "b802a6f2c33c7dc20e4adf2c1736345..."; return <div className="panel tool-panel"><ToolHead eyebrow="Developer utility" title="Quick Link" icon={MousePointer2} /><div className="token-box"><div><span className="token-label">Your API token</span><strong>{token}</strong></div><button onClick={() => { navigator.clipboard?.writeText(token); setCopied(true); toast.success("API token copied"); }}>{copied ? <Check size={16} /> : <Copy size={16} />}</button></div><div className="instruction-grid"><div className="instruction"><span>01</span><div><strong>Build your request</strong><p>Send a GET request with your API token and the URL you want to shorten.</p></div></div><div className="instruction"><span>02</span><div><strong>Share the response</strong><p>Use the returned short link anywhere you publish content.</p></div></div></div><pre className="code-block"><code>{`https://arolinks.com/api?api=YOUR_API_KEY&url=YOUR_URL`}</code></pre><button className="outline-button" onClick={() => toast.info("API documentation copied")}>Copy example <Clipboard size={14} /></button></div>; }
function ToolScript() { return <div className="panel tool-panel"><ToolHead eyebrow="Site automation" title="Full Page Script" icon={FileCode2} /><p className="tool-intro">Generate a script to automatically shorten links across your website.</p><div className="radio-row"><label className="radio-option active"><input type="radio" name="domain" defaultChecked /> Include selected domains</label><label className="radio-option"><input type="radio" name="domain" /> Exclude selected domains</label></div><textarea className="code-textarea" rows={6} placeholder="example.com\nmywebsite.com" /><button className="primary-button" onClick={() => toast.success("Full page script generated")}><FileCode2 size={15} /> Generate script</button></div>; }
function ToolApi() { return <div className="panel tool-panel"><ToolHead eyebrow="Integration reference" title="Developers API" icon={BookOpen} /><p className="tool-intro">Connect Arolinks to your own tools using a lightweight GET endpoint.</p><div className="api-tabs"><span className="active">JSON response</span><span>TEXT response</span></div><pre className="code-block api-code"><code>{`GET https://arolinks.com/api\n  ?api=YOUR_API_KEY\n  &url=https://example.com/long-url\n\n{\n  "status": "success",\n  "shortenedUrl": "https://aro.li/abc123"\n}`}</code></pre><div className="api-note"><KeyRound size={15} /> Keep your API token private. Never expose it in client-side code.</div></div>; }
function ToolBookmarklet() { return <div className="panel tool-panel bookmarklet-panel"><ToolHead eyebrow="Browser shortcut" title="Bookmarklet" icon={BookmarkIcon} /><p className="tool-intro">Drag this button to your browser toolbar. Use it on any page to shorten the current URL.</p><button className="bookmarklet-button" onClick={() => toast.success("Bookmarklet ready to drag")}>Shorten! <Link2 size={15} /></button><div className="drag-tip"><MousePointer2 size={18} /><div><strong>Drag & drop</strong><p>Place the button in your bookmarks bar for one-click shortening.</p></div></div></div>; }

function Referrals() { return <><section className="referral-hero"><div className="referral-copy"><span className="eyebrow">Partner program</span><h2>Grow together, earn together.</h2><p>Invite your network to Arolinks and receive a <strong>10% lifetime commission</strong> from every referral.</p><div className="referral-link"><span>https://arolinks.com/ref/chatakonda</span><button onClick={() => { navigator.clipboard?.writeText("https://arolinks.com/ref/chatakonda"); toast.success("Referral link copied"); }}><Copy size={15} /></button></div></div><div className="referral-art"><Network size={82} strokeWidth={1} /><span className="orbit-dot one" /><span className="orbit-dot two" /><span className="orbit-dot three" /></div></section><section className="panel table-panel"><div className="panel-heading"><div><span className="eyebrow">Your network</span><h2>My Referrals</h2></div><div className="table-summary"><Users size={15} /> 0 referrals</div></div><div className="empty-state compact"><div className="empty-icon"><Users size={20} /></div><h3>No referrals yet</h3><p>Share your referral link to get started.</p></div></section></>; }
function Invoices() { return <section className="panel table-panel"><div className="panel-heading"><div><span className="eyebrow">Billing history</span><h2>Manage Invoices</h2></div><button className="outline-button"><ArrowDownToLine size={14} /> Download all</button></div><div className="data-table-wrap"><table><thead><tr><th>ID</th><th>Status</th><th>Description</th><th>Amount</th><th>Payment Method</th><th /></tr></thead><tbody><tr><td colSpan={6}><div className="table-empty"><FileText size={21} /><strong>No invoices found</strong><span>Payment records will appear here after your first withdrawal.</span></div></td></tr></tbody></table></div></section>; }
function Withdraw({ payoutMethod }: { payoutMethod: string }) { return <><div className="balance-grid"><Balance label="Available Balance" value="$0.00" tone="green" icon={Wallet} /><Balance label="Pending Withdrawn" value="$0.00" tone="orange" icon={RefreshCcw} /><Balance label="Total Withdraw" value="$0.00" tone="purple" icon={ArrowDownToLine} /></div><section className="withdraw-grid"><div className="panel payout-panel"><div className="panel-heading"><div><span className="eyebrow">Ready when you are</span><h2>Withdraw funds</h2></div><div className="payout-status"><span className="live-dot" /> Available</div></div><div className="payout-amount"><span>Current balance</span><strong>$0.00</strong></div><div className="payout-method"><CreditCard size={18} /><div><strong>Payment method</strong><span>{payoutMethod ? `${payoutMethod} connected` : "Choose a method in Settings"}</span></div><ChevronRight size={16} /></div><button className="primary-button full" onClick={() => toast.error("Your balance has not reached the minimum withdrawal amount.")}><ArrowDownToLine size={16} /> WITHDRAW</button></div><div className="panel info-panel"><div className="panel-heading"><div><span className="eyebrow">Payout guide</span><h2>How it works</h2></div><HelpCircle size={17} /></div><p>Payments are reviewed and processed within 2–4 business days.</p><div className="status-list"><StatusLine label="Pending" color="orange" text="Request received" /><StatusLine label="Approved" color="blue" text="Request verified" /><StatusLine label="Complete" color="green" text="Funds sent" /><StatusLine label="Cancelled" color="red" text="Request stopped" /><StatusLine label="Returned" color="purple" text="Funds returned" /></div></div></section></>; }
function SettingsPage({ payoutMethod, onPayoutMethodChange }: { payoutMethod: string; onPayoutMethodChange: (value: string) => void }) { const [tab, setTab] = useState("profile"); const tabs = [{ id: "profile", label: "Profile", icon: UserRound }, { id: "password", label: "Change Password", icon: LockKeyhole }, { id: "email", label: "Change Email", icon: Mail }]; return <div className="settings-layout"><div className="settings-tabs">{tabs.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}><Icon icon={item.icon} /><span>{item.label}</span></button>)}</div>{tab === "profile" && <ProfileForm payoutMethod={payoutMethod} onPayoutMethodChange={onPayoutMethodChange} />}{tab === "password" && <PasswordForm />}{tab === "email" && <EmailForm />}</div>; }
function ProfileForm({ payoutMethod, onPayoutMethodChange }: { payoutMethod: string; onPayoutMethodChange: (value: string) => void }) { return <div className="settings-content"><section className="panel form-panel"><FormHeader title="Billing Address" description="Keep your payout details current." icon={BriefcaseBusiness} /><div className="form-grid two"><Field label="First Name" placeholder="Chatakonda" /><Field label="Last Name" placeholder="Vasanth" /><Field label="Address" placeholder="Your address" /><Field label="City" placeholder="City" /><Field label="State" placeholder="State" /><Field label="ZIP" placeholder="ZIP code" /><SelectField label="Country" options={["India", "United States", "United Kingdom"]} /><Field label="Phone Number" placeholder="+91 00000 00000" /></div></section><section className="panel form-panel"><FormHeader title="Contact Methods" description="Add the channels where we can reach you." icon={MessageCircle} /><div className="form-grid three"><Field label="WhatsApp Number" placeholder="WhatsApp number" /><Field label="Telegram Username" placeholder="@username" /><Field label="Skype ID" placeholder="Skype ID" /></div></section><section className="panel form-panel"><FormHeader title="Withdrawal Info" description="Select how you would like to receive your earnings." icon={Wallet} /><div className="form-grid two"><label className="field-label"><span>Withdrawal Method</span><div className="input-wrap select-wrap"><select value={payoutMethod} onChange={(event) => onPayoutMethodChange(event.target.value)}><option value="">Select payment method</option><option>PayPal</option><option>Bitcoin</option><option>Bank Transfer India</option><option>UPI</option><option>GooglePay</option></select><ChevronDown size={14} /></div></label><div className="minimum-list"><span>Minimum withdrawal</span><strong>PayPal <em>$5.00</em></strong><strong>Bitcoin <em>$20.00</em></strong><strong>Bank Transfer India <em>$2.00</em></strong><strong>UPI <em>$2.00</em></strong><strong>GooglePay <em>$2.00</em></strong></div></div><div className={`payout-completion ${payoutMethod ? "complete" : ""}`}><span className="payout-completion-icon">{payoutMethod ? <Check size={14} /> : <CreditCard size={14} />}</span><div><strong>{payoutMethod ? "Payout method complete" : "Payout method incomplete"}</strong><small>{payoutMethod ? `${payoutMethod} is connected and ready for your first withdrawal.` : "Choose a method above to complete this onboarding step."}</small></div></div><button className="primary-button" onClick={() => toast.success(payoutMethod ? "Payout method saved" : "Choose a payout method first")}>Save changes <Check size={15} /></button></section></div>; }
function PasswordForm() { return <div className="settings-content"><section className="panel form-panel narrow-form"><FormHeader title="Change Password" description="Use a unique password to protect your account." icon={LockKeyhole} /><Field label="Current Password" placeholder="Enter current password" type="password" /><Field label="New Password" placeholder="Enter new password" type="password" /><Field label="Re-enter New Password" placeholder="Re-enter new password" type="password" /><button className="primary-button" onClick={() => toast.success("Password updated")}>Update password <Check size={15} /></button></section></div>; }
function EmailForm() { return <div className="settings-content"><section className="panel form-panel narrow-form"><FormHeader title="Change Email" description="Your current email is used for account notifications." icon={Mail} /><div className="current-email"><span>Current email</span><strong>chatakondavasanth360@gmail.com</strong></div><Field label="New Email" placeholder="Enter a new email address" type="email" /><Field label="Re-enter New Email" placeholder="Re-enter the new email address" type="email" /><button className="primary-button" onClick={() => toast.success("Email change request sent")}>Update email <Send size={15} /></button></section></div>; }
function Support() { const [sent, setSent] = useState(false); return <div className="support-grid"><section className="panel form-panel"><FormHeader title="Submit a support ticket" description="We usually reply within 24 hours." icon={Ticket} /><div className="form-grid two"><Field label="Name" placeholder="Your name" /><Field label="Subject" placeholder="How can we help?" /><Field label="Email" placeholder="you@example.com" type="email" /></div><label className="field-label"><span>Message</span><textarea className="textarea" rows={7} placeholder="Describe your question or issue..." /></label><button className="primary-button" onClick={() => { setSent(true); toast.success("Support ticket submitted"); }}>{sent ? <><Check size={15} /> Ticket sent</> : <><Send size={15} /> Send ticket</>}</button></section><section className="support-side"><div className="support-callout"><div className="callout-icon"><MessageCircle size={20} /></div><div><span className="eyebrow">Need a quick answer?</span><h3>Talk to us directly</h3><p>Reach the support team on WhatsApp or Telegram.</p><div className="callout-actions"><button onClick={() => toast.info("WhatsApp chat opens in a new window.")}>WhatsApp <ArrowUpRight size={14} /></button><button onClick={() => toast.info("Telegram opens in a new window.")}>Telegram <ArrowUpRight size={14} /></button></div></div></div><div className="support-facts"><div><span>Average response</span><strong>&lt; 24 hours</strong></div><div><span>Support hours</span><strong>24 / 7</strong></div></div></section></div>; }
function Plans() { const [active, setActive] = useState("default"); const plans = [{ id: "default", name: "Default", price: "$10", suffix: "CPM", pages: "4 pages of ads", detail: "Fixed rate payout", color: "purple", current: true }, { id: "normal", name: "$8 CPM", price: "$8", suffix: "CPM", pages: "3 pages", detail: "2 IP views / day", color: "cyan" }, { id: "professional", name: "Professional", price: "$5", suffix: "CPM", pages: "2 pages", detail: "3 IP views / day", color: "blue" }, { id: "advanced", name: "Advanced", price: "$3", suffix: "CPM", pages: "1 page", detail: "2 IP views / day", color: "orange" }, { id: "easy", name: "Easy Pages", price: "$10", suffix: "CPM", pages: "3–4 simple pages", detail: "2 IP views / day", color: "green" }]; return <><div className="plan-features"><span><Bot size={15} /> Telegram Bot</span><span><HelpCircle size={15} /> 24/7 support</span><span><ShieldCheck size={15} /> Quality traffic tools</span></div><div className="plan-grid">{plans.map((plan) => <article className={`plan-card ${plan.color} ${active === plan.id ? "selected" : ""}`} key={plan.id}><div className="plan-card-head"><span className="plan-icon"><Sparkles size={17} /></span>{plan.current && <span className="active-plan">ACTIVE</span>}</div><h3>{plan.name}</h3><div className="plan-price"><strong>{plan.price}</strong><span>{plan.suffix}</span></div><div className="plan-spec"><Check size={14} /> {plan.pages}</div><div className="plan-spec"><Check size={14} /> {plan.detail}</div><div className="plan-spec"><Check size={14} /> Telegram Bot + 24/7 support</div><button className={active === plan.id ? "selected-button" : "plan-button"} onClick={() => { setActive(plan.id); toast.success(`${plan.name} selected`); }}>{active === plan.id ? <><Check size={14} /> {plan.current ? "Current plan" : "Selected"}</> : "Choose plan"}</button></article>)}</div></>; }
function EarnNow({ navigate }: { navigate: (page: string) => void }) { const offers = [{ icon: Link2, title: "Publish consistently", copy: "Shorten every campaign and build a library of share-ready links.", action: "Create a link", page: "dashboard" }, { icon: Users, title: "Invite your network", copy: "Earn 10% lifetime commission from every active referral.", action: "Open referrals", page: "referrals" }, { icon: Wallet, title: "Get payout-ready", copy: "Add a payment method now so your first withdrawal is frictionless.", action: "Add payout method", page: "settings" }]; return <><section className="earn-hero panel"><div><span className="eyebrow">A clearer path to your next payout</span><h2>Turn attention into earnings.</h2><p>Start with one link, then build the habits that compound: publish, invite, and stay payout-ready.</p></div><div className="earn-hero-badge"><Rocket size={22} /><strong>3 moves</strong><span>to get started</span></div></section><section className="earn-grid">{offers.map((offer, index) => <article className="earn-card" key={offer.title}><div className="earn-card-top"><span className="earn-step">0{index + 1}</span><div className="earn-icon"><offer.icon size={18} /></div></div><h3>{offer.title}</h3><p>{offer.copy}</p><button className="primary-button" onClick={() => navigate(offer.page)}>{offer.action} <ArrowUpRight size={14} /></button></article>)}</section></>; }

function PerformanceTable() { const rows = ["14 Aug", "13 Aug", "12 Aug", "11 Aug", "10 Aug", "09 Aug", "08 Aug"]; return <div className="data-table-wrap"><table><thead><tr><th>DATE</th><th>VIEWS</th><th>LINK EARNINGS</th><th>DAILY CPM</th><th>REFERRAL EARNINGS</th></tr></thead><tbody>{rows.map((row) => <tr key={row}><td>{row}</td><td>0</td><td>$0.00</td><td>0</td><td>$0.00</td></tr>)}</tbody></table><div className="table-pagination"><span>Showing 1–7 of 31 days</span><div><button><ChevronLeft size={14} /></button><button className="active">1</button><button>2</button><button>3</button><button><ChevronRight size={14} /></button></div></div></div>; }
function Metric({ icon, label, value, note, tone }: { icon: IconType; label: string; value: string; note: string; tone: string }) { return <div className={`metric-card ${tone}`}><div className="metric-icon"><Icon icon={icon} size={17} /></div><span>{label}</span><strong>{value}</strong><small>{note}</small></div>; }
function MiniMetric({ icon, label, value }: { icon: IconType; label: string; value: string }) { return <div className="mini-metric"><Icon icon={icon} size={16} /><div><span>{label}</span><strong>{value}</strong></div></div>; }
function Balance({ icon, label, value, tone }: { icon: IconType; label: string; value: string; tone: string }) { return <div className={`balance-card ${tone}`}><div className="balance-icon"><Icon icon={icon} /></div><span>{label}</span><strong>{value}</strong><ArrowUpRight size={15} /></div>; }
function StatusLine({ label, color, text }: { label: string; color: string; text: string }) { return <div className="status-line"><span className={`status-dot ${color}`} /><strong>{label}</strong><span>{text}</span></div>; }
function ToolHead({ eyebrow, title, icon }: { eyebrow: string; title: string; icon: IconType }) { return <div className="tool-head"><div className="tool-head-icon"><Icon icon={icon} size={20} /></div><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div></div>; }
function FormHeader({ title, description, icon }: { title: string; description: string; icon: IconType }) { return <div className="form-header"><div className="form-header-icon"><Icon icon={icon} /></div><div><h2>{title}</h2><p>{description}</p></div></div>; }
function Field({ label, placeholder, value, onChange, icon: FieldIcon, type = "text" }: { label: string; placeholder?: string; value?: string; onChange?: (value: string) => void; icon?: IconType; type?: string }) { return <label className="field-label"><span>{label}</span><div className="input-wrap">{FieldIcon && <FieldIcon size={15} />}<input type={type} value={value} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} /></div></label>; }
function SelectField({ label, options }: { label: string; options: string[] }) { return <label className="field-label"><span>{label}</span><div className="input-wrap select-wrap"><select defaultValue={options[0]}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown size={15} /></div></label>; }
function CalendarIcon() { return <span className="calendar-icon">14</span>; }
function EyeIcon({ size = 16 }: { size?: number }) { return <Activity size={size} />; }
function BookmarkIcon({ size = 16 }: { size?: number }) { return <BookOpen size={size} />; }

export default App;
