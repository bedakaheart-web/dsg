import { useEffect, useState } from "react";
import { supabase } from "../js/supabase";
import {
  FaUsers,
  FaUserShield,
  FaUserCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSyncAlt,
  FaToggleOn,
  FaToggleOff,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const RP_STYLE = `
  .rp-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: var(--text, #1F2937);
  }
  .rp-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; flex-wrap: wrap;
    gap: 14px; margin-bottom: 24px;
  }
  .rp-eyebrow {
    font-size: 11px; font-weight: 600; letter-spacing: .5px;
    text-transform: uppercase; color: var(--primary, #0066FF);
    display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
  }
  .rp-eyebrow::before {
    content: ''; display: block; width: 20px; height: 2px;
    background: var(--primary, #0066FF);
  }
  .rp-title {
    font-size: 28px; font-weight: 700; color: var(--text, #1F2937);
    letter-spacing: -.5px; margin: 0 0 4px; line-height: 1.1;
  }
  .rp-subtitle {
    font-size: 11px; color: var(--text-tertiary, #9CA3AF);
    margin: 0; letter-spacing: .3px;
  }
  .rp-add-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px;
    background: linear-gradient(135deg, #0066FF 0%, #0052cc 100%);
    border: none; border-radius: 8px;
    font-family: inherit;
    font-size: 13px; font-weight: 600;
    color: #fff; cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,102,255,.2);
    transition: all .18s; white-space: nowrap;
  }
  .rp-add-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(0,102,255,.3);
  }

  /* Stats */
  .rp-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 12px; margin-bottom: 24px;
  }
  .rp-stat {
    background: var(--surface, #fff);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 12px; padding: 18px 20px;
    position: relative; overflow: hidden;
    transition: all .3s; cursor: default;
  }
  .rp-stat:hover {
    transform: translateY(-3px);
    border-color: var(--s-accent);
    box-shadow: 0 6px 16px rgba(0,0,0,.06);
  }
  .rp-stat::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: var(--s-accent);
  }
  .rp-stat-num {
    font-size: 28px; font-weight: 700;
    color: var(--s-accent); line-height: 1; margin-bottom: 4px;
  }
  .rp-stat-label {
    font-size: 11px; color: var(--text-secondary, #6B7280);
    letter-spacing: .3px; text-transform: uppercase; font-weight: 500;
  }

  /* Tabs */
  .rp-tabs {
    display: flex; gap: 4px;
    background: var(--bg, #FAFBFC);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 10px; padding: 4px;
    width: fit-content; margin-bottom: 14px;
  }
  .rp-tab {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px; border-radius: 7px; border: 1px solid transparent;
    font-family: inherit;
    font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all .17s;
    background: transparent; color: var(--text-secondary, #6B7280);
  }
  .rp-tab:hover {
    color: var(--text, #1F2937);
    background: var(--surface, #fff);
    border-color: var(--border, #E5E7EB);
  }
  .rp-tab.active {
    background: linear-gradient(135deg, #0066FF 0%, #0052cc 100%);
    color: #fff; border-color: transparent; font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,102,255,.2);
  }
  .rp-tab-count {
    background: rgba(0,0,0,.06);
    border-radius: 6px; padding: 1px 7px;
    font-size: 10px; font-weight: 700;
    color: var(--text-secondary, #6B7280);
  }
  .rp-tab.active .rp-tab-count {
    background: rgba(255,255,255,.2);
    color: rgba(255,255,255,.9);
  }

  /* Duty filter */
  .rp-duty-filter { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
  .rp-duty-pill {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 20px; border: 1px solid;
    font-family: inherit;
    font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all .17s; background: transparent;
  }
  .rp-duty-pill--all {
    border-color: var(--border, #E5E7EB);
    color: var(--text-secondary, #6B7280);
  }
  .rp-duty-pill--all.active,
  .rp-duty-pill--all:hover {
    background: var(--bg, #FAFBFC);
    border-color: var(--text-secondary, #6B7280);
    color: var(--text, #1F2937);
  }
  .rp-duty-pill--on { border-color: rgba(0,176,116,.25); color: #00B074; }
  .rp-duty-pill--on.active, .rp-duty-pill--on:hover {
    background: rgba(0,176,116,.06); border-color: #00B074;
  }
  .rp-duty-pill--off { border-color: var(--border, #E5E7EB); color: var(--text-tertiary, #9CA3AF); }
  .rp-duty-pill--off.active, .rp-duty-pill--off:hover {
    background: var(--bg, #FAFBFC);
    border-color: var(--text-secondary, #6B7280);
    color: var(--text-secondary, #6B7280);
  }
  .rp-duty-dot { width: 6px; height: 6px; border-radius: 50%; }

  /* Toolbar */
  .rp-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
  .rp-search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 320px; }
  .rp-search-icon {
    position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
    color: var(--text-tertiary, #9CA3AF); font-size: 12px; pointer-events: none;
  }
  .rp-search {
    width: 100%; padding: 8px 12px 8px 32px;
    background: var(--surface, #fff);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 8px;
    font-family: inherit;
    font-size: 13px; color: var(--text, #1F2937);
    outline: none; transition: border-color .17s;
    box-sizing: border-box;
  }
  .rp-search::placeholder { color: var(--text-tertiary, #9CA3AF); }
  .rp-search:focus { border-color: var(--primary, #0066FF); box-shadow: 0 0 0 3px rgba(0,102,255,.08); }
  .rp-refresh-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px;
    background: var(--surface, #fff);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 8px;
    font-family: inherit;
    font-size: 13px; color: var(--text-secondary, #6B7280);
    cursor: pointer; transition: all .17s;
  }
  .rp-refresh-btn:hover {
    background: var(--bg, #FAFBFC);
    border-color: var(--text-secondary, #6B7280);
    color: var(--text, #1F2937);
  }
  .rp-refresh-btn.spinning svg { animation: rpSpin .7s linear infinite; }
  @keyframes rpSpin { to { transform: rotate(360deg); } }

  /* Notice */
  .rp-notice {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 11px 14px;
    background: rgba(0,102,255,.04);
    border: 1px solid rgba(0,102,255,.14);
    border-radius: 8px; margin-bottom: 16px;
    font-size: 12.5px; color: var(--text-secondary, #6B7280); line-height: 1.6;
  }
  .rp-notice-icon { color: var(--primary, #0066FF); margin-top: 2px; flex-shrink: 0; }

  /* Table */
  .rp-table-wrap {
    background: var(--surface, #fff);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 12px; overflow: hidden;
    overflow-x: auto;
  }
  .rp-table { width: 100%; border-collapse: collapse; }
  .rp-table thead tr { border-bottom: 1px solid var(--border, #E5E7EB); background: var(--bg, #FAFBFC); }
  .rp-table th {
    padding: 11px 16px;
    font-size: 10px; font-weight: 600;
    letter-spacing: .5px; text-transform: uppercase;
    color: var(--text-tertiary, #9CA3AF); text-align: left;
    white-space: nowrap;
  }
  .rp-table td {
    padding: 13px 16px;
    font-size: 13px; color: var(--text-secondary, #6B7280);
    border-bottom: 1px solid var(--border, #E5E7EB);
    vertical-align: middle;
  }
  .rp-table tbody tr:last-child td { border-bottom: none; }
  .rp-table tbody tr:hover td { background: var(--bg, #FAFBFC); }

  /* Avatar */
  .rp-avatar {
    width: 34px; height: 34px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 11px; flex-shrink: 0;
    font-family: inherit;
  }
  .rp-avatar-responder {
    background: rgba(0,102,255,.1);
    color: var(--primary, #0066FF);
    border: 1px solid rgba(0,102,255,.18);
  }
  .rp-avatar-citizen {
    background: rgba(0,176,116,.1);
    color: #00B074;
    border: 1px solid rgba(0,176,116,.18);
  }
  .rp-name-cell { display: flex; align-items: center; gap: 10px; }
  .rp-name { font-weight: 600; color: var(--text, #1F2937); font-size: 13px; }
  .rp-source-tag {
    display: inline-flex; align-items: center; gap: 3px;
    padding: 2px 7px; border-radius: 4px;
    font-size: 9px; font-weight: 600;
    letter-spacing: .1em; text-transform: uppercase;
  }
  .rp-tag-auth {
    background: rgba(0,176,116,.08);
    border: 1px solid rgba(0,176,116,.18);
    color: #00B074;
  }
  .rp-tag-manual {
    background: rgba(255,149,0,.08);
    border: 1px solid rgba(255,149,0,.2);
    color: #FF9500;
  }

  /* Badges */
  .rp-status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 8px; border-radius: 4px;
    font-size: 10px; font-weight: 600;
    text-transform: uppercase; letter-spacing: .06em;
  }
  .rp-status-active {
    background: rgba(0,176,116,.08);
    border: 1px solid rgba(0,176,116,.2);
    color: #00B074;
  }
  .rp-status-inactive {
    background: var(--bg, #FAFBFC);
    border: 1px solid var(--border, #E5E7EB);
    color: var(--text-tertiary, #9CA3AF);
  }
  .rp-status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  .rp-duty-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 8px; border-radius: 4px;
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .06em;
  }
  .rp-duty-badge--on {
    background: rgba(0,176,116,.08);
    border: 1px solid rgba(0,176,116,.2);
    color: #00B074;
  }
  .rp-duty-badge--off {
    background: var(--bg, #FAFBFC);
    border: 1px solid var(--border, #E5E7EB);
    color: var(--text-tertiary, #9CA3AF);
  }
  .rp-duty-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* Last seen */
  .rp-lastseen { font-size: 12px; color: var(--text-secondary, #6B7280); white-space: nowrap; }
  .rp-lastseen--none { color: var(--text-tertiary, #9CA3AF); font-style: italic; }

  /* Action buttons */
  .rp-duty-toggle {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 10px; border-radius: 6px; border: 1px solid;
    font-family: inherit; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all .16s;
  }
  .rp-duty-toggle--on {
    background: rgba(0,176,116,.06);
    border-color: rgba(0,176,116,.2);
    color: #00B074;
  }
  .rp-duty-toggle--on:hover {
    background: rgba(0,176,116,.12);
    border-color: #00B074;
  }
  .rp-duty-toggle--off {
    background: var(--bg, #FAFBFC);
    border-color: var(--border, #E5E7EB);
    color: var(--text-secondary, #6B7280);
  }
  .rp-duty-toggle--off:hover {
    background: var(--surface, #fff);
    border-color: var(--text-secondary, #6B7280);
    color: var(--text, #1F2937);
  }
  .rp-action-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  .rp-btn-edit, .rp-btn-remove {
    display: flex; align-items: center; gap: 5px;
    padding: 5px 10px; border-radius: 6px; border: 1px solid;
    font-family: inherit; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all .16s;
  }
  .rp-btn-edit {
    background: rgba(0,102,255,.06);
    border-color: rgba(0,102,255,.18);
    color: var(--primary, #0066FF);
  }
  .rp-btn-edit:hover {
    background: rgba(0,102,255,.12);
    border-color: var(--primary, #0066FF);
  }
  .rp-btn-remove {
    background: rgba(255,59,48,.05);
    border-color: rgba(255,59,48,.18);
    color: var(--danger, #FF3B30);
  }
  .rp-btn-remove:hover {
    background: rgba(255,59,48,.1);
    border-color: var(--danger, #FF3B30);
  }

  /* Empty state */
  .rp-empty { text-align: center; padding: 52px 20px; color: var(--text-tertiary, #9CA3AF); }
  .rp-empty-icon { font-size: 28px; margin-bottom: 12px; opacity: .35; }
  .rp-empty-text { font-size: 13px; }

  /* Modal overlay */
  .rp-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.35);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .rp-modal {
    background: var(--surface, #fff);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 16px; padding: 28px;
    width: 100%; max-width: 440px;
    box-shadow: 0 12px 40px rgba(0,0,0,.1);
    animation: rpModalIn .2s ease;
  }
  @keyframes rpModalIn {
    from { opacity: 0; transform: translateY(8px) scale(.98); }
    to   { opacity: 1; transform: none; }
  }
  .rp-modal-title {
    font-size: 18px; font-weight: 700;
    color: var(--text, #1F2937); margin: 0 0 5px;
  }
  .rp-modal-sub {
    font-size: 13px; color: var(--text-secondary, #6B7280);
    margin: 0 0 20px; line-height: 1.6;
  }

  /* Auth account toggle */
  .rp-auth-toggle {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 14px;
    background: rgba(0,102,255,.04);
    border: 1px solid rgba(0,102,255,.14);
    border-radius: 8px; margin-bottom: 16px; cursor: pointer;
    transition: background .17s;
  }
  .rp-auth-toggle:hover { background: rgba(0,102,255,.07); }
  .rp-auth-toggle-left { display: flex; flex-direction: column; gap: 2px; }
  .rp-auth-toggle-label { font-size: 13px; font-weight: 600; color: var(--primary, #0066FF); }
  .rp-auth-toggle-sub { font-size: 11px; color: var(--text-tertiary, #9CA3AF); }
  .rp-auth-switch {
    width: 36px; height: 20px; border-radius: 10px;
    background: var(--border, #E5E7EB);
    border: 1px solid var(--border, #E5E7EB);
    position: relative; transition: background .2s; flex-shrink: 0;
  }
  .rp-auth-switch.on { background: var(--primary, #0066FF); border-color: var(--primary, #0066FF); }
  .rp-auth-switch::after {
    content: ''; position: absolute;
    top: 2px; left: 2px;
    width: 14px; height: 14px; border-radius: 50%;
    background: #fff; transition: transform .2s;
    box-shadow: 0 1px 3px rgba(0,0,0,.15);
  }
  .rp-auth-switch.on::after { transform: translateX(16px); }

  /* Auth section */
  .rp-auth-section {
    background: rgba(0,102,255,.03);
    border: 1px solid rgba(0,102,255,.1);
    border-radius: 8px; padding: 14px;
    margin-bottom: 4px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .rp-auth-section-label {
    font-size: 9px; font-weight: 700; letter-spacing: .18em;
    text-transform: uppercase; color: rgba(0,102,255,.5);
    margin-bottom: 2px;
  }

  /* Fields */
  .rp-field { margin-bottom: 14px; }
  .rp-field-row { display: flex; gap: 12px; margin-bottom: 14px; }
  .rp-field-row .rp-field { flex: 1; margin-bottom: 0; min-width: 0; }
  .rp-label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--text-secondary, #6B7280);
    margin-bottom: 6px;
  }
  .rp-input {
    width: 100%; padding: 9px 12px;
    background: var(--bg, #FAFBFC);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 8px; font-family: inherit;
    font-size: 13px; color: var(--text, #1F2937);
    outline: none; transition: border-color .17s, box-shadow .17s;
    box-sizing: border-box;
  }
  .rp-input::placeholder { color: var(--text-tertiary, #9CA3AF); }
  .rp-input:focus {
    border-color: var(--primary, #0066FF);
    box-shadow: 0 0 0 3px rgba(0,102,255,.08);
    background: var(--surface, #fff);
  }
  .rp-input-wrap { position: relative; }
  .rp-pw-toggle {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    background: none; border: none;
    color: var(--text-tertiary, #9CA3AF);
    cursor: pointer; padding: 2px; display: flex; align-items: center;
  }
  .rp-pw-toggle:hover { color: var(--text-secondary, #6B7280); }
  .rp-select {
    width: 100%; padding: 9px 12px;
    background: var(--bg, #FAFBFC);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 8px; font-family: inherit;
    font-size: 13px; color: var(--text, #1F2937);
    outline: none; cursor: pointer; box-sizing: border-box;
  }
  .rp-select:focus {
    border-color: var(--primary, #0066FF);
    box-shadow: 0 0 0 3px rgba(0,102,255,.08);
  }

  /* Banners */
  .rp-modal-error {
    padding: 10px 14px;
    background: rgba(255,59,48,.05);
    border: 1px solid rgba(255,59,48,.18);
    border-radius: 8px; font-size: 12px;
    color: var(--danger, #FF3B30);
    margin-bottom: 14px; line-height: 1.5;
  }
  .rp-modal-success {
    padding: 10px 14px;
    background: rgba(0,176,116,.06);
    border: 1px solid rgba(0,176,116,.2);
    border-radius: 8px; font-size: 12px;
    color: #00B074;
    margin-bottom: 14px; line-height: 1.5;
  }

  /* Modal actions */
  .rp-modal-actions { display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end; }
  .rp-modal-save {
    padding: 10px 20px;
    background: linear-gradient(135deg, #0066FF 0%, #0052cc 100%);
    border: none; border-radius: 8px; font-family: inherit;
    font-size: 13px; font-weight: 700; color: #fff; cursor: pointer;
    transition: all .17s; box-shadow: 0 2px 8px rgba(0,102,255,.2);
    display: flex; align-items: center; gap: 8px;
  }
  .rp-modal-save:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(0,102,255,.3);
  }
  .rp-modal-save:disabled { opacity: .5; cursor: not-allowed; }
  .rp-modal-cancel {
    padding: 10px 16px;
    background: var(--bg, #FAFBFC);
    border: 1px solid var(--border, #E5E7EB);
    border-radius: 8px; font-family: inherit;
    font-size: 13px; font-weight: 500;
    color: var(--text-secondary, #6B7280);
    cursor: pointer; transition: all .17s;
  }
  .rp-modal-cancel:hover {
    background: var(--surface, #fff);
    border-color: var(--text-secondary, #6B7280);
    color: var(--text, #1F2937);
  }
  .rp-spinner {
    display: inline-block; width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    animation: rpSpin .7s linear infinite;
  }
`;

function getInitials(name: string | null | undefined): string {
  if (!name) return "??";
  return (
    name.split(" ").map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase() || "??"
  );
}

// Exact last-seen date & time (not relative) — e.g. "Aug 28, 2026, 3:45 PM"
function fmtExactDateTime(ts?: string | null): string | null {
  if (!ts) return null;
  const d = new Date(ts);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

interface ProfileUser {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  created_at?: string;
  last_seen?: string | null;
  source: "auth";
}

interface ManualResponder {
  id: string;
  name: string | null;
  email: string;
  status: string;
  on_duty: boolean;
  last_seen?: string | null;
  source: "manual";
}

type TabId = "responders" | "citizens";
type DutyFilter = "all" | "on" | "off";

export default function RespondersPage() {
  const [tab, setTab]               = useState<TabId>("responders");
  const [dutyFilter, setDutyFilter] = useState<DutyFilter>("all");

  const [profileResponders, setProfileResponders] = useState<ProfileUser[]>([]);
  const [citizens, setCitizens]                   = useState<ProfileUser[]>([]);
  const [manualResponders, setManualResponders]   = useState<ManualResponder[]>([]);

  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]         = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [showAdd, setShowAdd]           = useState(false);
  const [createAuth, setCreateAuth]     = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving]             = useState(false);
  const [modalError, setModalError]     = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);
  // ── firstName/lastName are combined into a single full name on submit.
  // "on_duty" is no longer set here — new responders are added off-duty
  // and the dashboard flips it automatically based on login/logout. ──
  const [formData, setFormData]         = useState({
    firstName: "", lastName: "", email: "", password: "",
  });

  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState<ManualResponder | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", on_duty: true });

  const fetchAll = async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at, last_seen");

    if (profilesError) console.error("profiles fetch error:", profilesError.message);

    const profileRows = profiles ?? [];

    setProfileResponders(
      profileRows.filter((p) => p.role === "responder")
        .map((p) => ({ ...p, source: "auth" as const }))
    );
    setCitizens(
      profileRows.filter((p) => p.role === "citizen" || !p.role)
        .map((p) => ({ ...p, source: "auth" as const }))
    );

    const { data: manual } = await supabase.from("responders").select("*");
    setManualResponders(
      (manual ?? []).map((r) => ({ ...r, on_duty: r.on_duty ?? false, source: "manual" as const }))
    );

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAll();
    // Live-refresh whenever a profile or responder row changes (e.g. a
    // login/logout writes last_seen) so "Last Seen" updates immediately
    // without the admin needing to click Refresh.
    const channel = supabase
      .channel("rp-live-last-seen")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => fetchAll(true))
      .on("postgres_changes", { event: "*", schema: "public", table: "responders" }, () => fetchAll(true))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const addResponder = async () => {
    const firstName = formData.firstName.trim();
    const lastName  = formData.lastName.trim();
    const fullName  = `${firstName} ${lastName}`.trim();

    if (!firstName || !lastName || !formData.email.trim()) {
      setModalError("First name, last name, and email are required.");
      return;
    }
    if (createAuth && formData.password.length < 6) {
      setModalError("Password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    setModalError(null);
    setModalSuccess(null);

    if (createAuth) {
      // Admin account creation now goes through a Supabase Edge Function
      // ("admin-create-responder") that uses the service role key on the
      // server. This bypasses CAPTCHA entirely (CAPTCHA only applies to
      // public-facing auth.signUp calls from the browser) and never
      // touches or swaps the admin's own browser session, so there's no
      // need to snapshot/restore the admin's session anymore.
      const { data: fnData, error: fnError } = await supabase.functions.invoke(
        "admin-create-responder",
        {
          body: {
            email: formData.email.trim(),
            password: formData.password,
            fullName,
          },
        }
      );

      if (fnError || fnData?.error) {
        setModalError(`Auth account error: ${fnData?.error || fnError?.message}`);
        setSaving(false);
        return;
      }
    }

    // New responders always start off-duty. Duty status becomes "On Duty"
    // automatically once they log in (see AdminDashboard's login/logout
    // handlers, which flip on_duty for the matching email).
    const { error: insertError } = await supabase.from("responders").insert({
      name: fullName,
      email: formData.email.trim(),
      status: "active",
      on_duty: false,
    });

    if (insertError) {
      setModalError(`Responder record error: ${insertError.message}`);
      setSaving(false);
      return;
    }

    setModalSuccess(
      createAuth
        ? `✓ Responder added. A confirmation email was sent to ${formData.email} — they must click the link before they can log in.`
        : `✓ Responder record added for ${fullName}`
    );
    setSaving(false);
    setFormData({ firstName: "", lastName: "", email: "", password: "" });
    setCreateAuth(true);
    fetchAll(true);
    setTimeout(() => { setShowAdd(false); setModalSuccess(null); }, createAuth ? 3000 : 1500);
  };

  const updateResponder = async () => {
    if (!selected) return;
    await supabase
      .from("responders")
      .update({ name: editForm.name, email: editForm.email, on_duty: editForm.on_duty })
      .eq("id", selected.id);
    setShowEdit(false);
    setSelected(null);
    fetchAll(true);
  };

  const removeResponder = async (id: string) => {
    if (!confirm("Remove this responder?")) return;
    await supabase.from("responders").delete().eq("id", id);
    setManualResponders((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleDuty = async (r: ManualResponder) => {
    setTogglingId(r.id);
    const newDuty = !r.on_duty;
    await supabase.from("responders").update({ on_duty: newDuty }).eq("id", r.id);
    setManualResponders((prev) =>
      prev.map((x) => (x.id === r.id ? { ...x, on_duty: newDuty } : x))
    );
    setTogglingId(null);
  };

  const q = search.toLowerCase();

  const allResponders: Array<ProfileUser | ManualResponder> = [
    ...profileResponders,
    ...manualResponders,
  ];

  const filteredResponders = allResponders.filter((r) => {
    const name  = "full_name" in r ? (r.full_name ?? "") : (r.name ?? "");
    const email = r.email ?? "";
    const matchesSearch = name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
    if (dutyFilter !== "all" && "on_duty" in r) {
      if (dutyFilter === "on" && !r.on_duty) return false;
      if (dutyFilter === "off" && r.on_duty) return false;
    }
    return matchesSearch;
  });

  const filteredCitizens = citizens.filter(
    (c) =>
      (c.full_name ?? "").toLowerCase().includes(q) ||
      (c.email ?? "").toLowerCase().includes(q)
  );

  const onDutyCount  = manualResponders.filter((r) => r.on_duty).length;
  const offDutyCount = manualResponders.filter((r) => !r.on_duty).length;

  const stats = [
    { label: "Total Responders", value: allResponders.length,     accent: "#0066FF" },
    { label: "On Duty",          value: onDutyCount,              accent: "#00B074" },
    { label: "Off Duty",         value: offDutyCount,             accent: "#FF9500" },
    { label: "Auth Accounts",    value: profileResponders.length, accent: "#FF9500" },
    { label: "Citizens",         value: citizens.length,          accent: "#6B7280" },
  ];

  const renderResponderRow = (r: ProfileUser | ManualResponder, i: number) => {
    const isAuth   = "full_name" in r;
    const name     = isAuth ? (r.full_name ?? "Unknown") : ((r as ManualResponder).name ?? "Unknown");
    const status   = isAuth ? "active" : (r as ManualResponder).status;
    const isOnDuty = isAuth ? true : (r as ManualResponder).on_duty;
    const lastSeen = fmtExactDateTime(r.last_seen);

    return (
      <tr key={r.id ?? i}>
        <td>
          <div className="rp-name-cell">
            <div className="rp-avatar rp-avatar-responder">{getInitials(name)}</div>
            <div>
              <div className="rp-name">{name || "—"}</div>
              <span className={`rp-source-tag ${isAuth ? "rp-tag-auth" : "rp-tag-manual"}`}>
                {isAuth ? "✓ Signed Up" : "Manual"}
              </span>
            </div>
          </div>
        </td>
        <td style={{ fontSize: 12 }}>{r.email || "—"}</td>
        <td>
          <span className={`rp-status-badge ${status === "active" ? "rp-status-active" : "rp-status-inactive"}`}>
            <span className="rp-status-dot" />{status || "active"}
          </span>
        </td>
        <td>
          <span className={`rp-duty-badge ${isOnDuty ? "rp-duty-badge--on" : "rp-duty-badge--off"}`}>
            <span className="rp-duty-badge-dot" />{isOnDuty ? "On Duty" : "Off Duty"}
          </span>
        </td>
        <td>
          {lastSeen
            ? <span className="rp-lastseen">{lastSeen}</span>
            : <span className="rp-lastseen rp-lastseen--none">Never</span>}
        </td>
        <td>
          {!isAuth ? (
            <div className="rp-action-btns">
              <button
                className={`rp-duty-toggle ${isOnDuty ? "rp-duty-toggle--on" : "rp-duty-toggle--off"}`}
                onClick={() => toggleDuty(r as ManualResponder)}
                disabled={togglingId === r.id}
              >
                {isOnDuty ? <FaToggleOn size={11} /> : <FaToggleOff size={11} />}
                {togglingId === r.id ? "…" : isOnDuty ? "On Duty" : "Off Duty"}
              </button>
              <button
                className="rp-btn-edit"
                onClick={() => {
                  setSelected(r as ManualResponder);
                  setEditForm({ name: (r as ManualResponder).name ?? "", email: r.email, on_duty: (r as ManualResponder).on_duty });
                  setShowEdit(true);
                }}
              >
                <FaEdit size={10} /> Edit
              </button>
              <button className="rp-btn-remove" onClick={() => removeResponder(r.id)}>
                <FaTrash size={10} /> Remove
              </button>
            </div>
          ) : (
            <span style={{ fontSize: 11, color: "var(--text-tertiary, #9CA3AF)" }}>
              Auth-managed
            </span>
          )}
        </td>
      </tr>
    );
  };

  const renderCitizenRow = (c: ProfileUser, i: number) => {
    const lastSeen = fmtExactDateTime(c.last_seen);
    return (
      <tr key={c.id ?? i}>
        <td>
          <div className="rp-name-cell">
            <div className="rp-avatar rp-avatar-citizen">{getInitials(c.full_name)}</div>
            <div>
              <div className="rp-name">{c.full_name || "—"}</div>
              <span className="rp-source-tag rp-tag-auth">✓ Registered</span>
            </div>
          </div>
        </td>
        <td style={{ fontSize: 12 }}>{c.email || "—"}</td>
        <td><span className="rp-status-badge rp-status-active"><span className="rp-status-dot" /> Active</span></td>
        <td><span className="rp-duty-badge rp-duty-badge--on"><span className="rp-duty-badge-dot" /> Registered</span></td>
        <td>
          {lastSeen
            ? <span className="rp-lastseen">{lastSeen}</span>
            : <span className="rp-lastseen rp-lastseen--none">Never</span>}
        </td>
        <td style={{ fontSize: 12, color: "var(--text-tertiary, #9CA3AF)" }}>
          {c.created_at
            ? new Date(c.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })
            : "—"}
        </td>
      </tr>
    );
  };

  return (
    <>
      <style>{RP_STYLE}</style>
      <div className="rp-root">

        {/* Header */}
        <div className="rp-header">
          <div>
            <div className="rp-eyebrow">Personnel Management</div>
            <h2 className="rp-title">Responders &amp; Citizens</h2>
            <p className="rp-subtitle">All registered accounts and manually-added responders</p>
          </div>
          <button
            className="rp-add-btn"
            onClick={() => {
              setFormData({ firstName: "", lastName: "", email: "", password: "" });
              setModalError(null);
              setModalSuccess(null);
              setShowAdd(true);
            }}
          >
            <FaPlus size={11} /> Add Responder
          </button>
        </div>

        {/* Stats */}
        <div className="rp-stats">
          {stats.map((s) => (
            <div key={s.label} className="rp-stat" style={{ "--s-accent": s.accent } as React.CSSProperties}>
              <div className="rp-stat-num">{loading ? "—" : s.value}</div>
              <div className="rp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="rp-tabs">
          <button
            className={`rp-tab${tab === "responders" ? " active" : ""}`}
            onClick={() => { setTab("responders"); setDutyFilter("all"); }}
          >
            <FaUserShield size={11} /> Responders
            <span className="rp-tab-count">{allResponders.length}</span>
          </button>
          <button
            className={`rp-tab${tab === "citizens" ? " active" : ""}`}
            onClick={() => setTab("citizens")}
          >
            <FaUserCircle size={11} /> Citizens
            <span className="rp-tab-count">{citizens.length}</span>
          </button>
        </div>

        {/* Duty filter */}
        {tab === "responders" && (
          <div className="rp-duty-filter">
            <button
              className={`rp-duty-pill rp-duty-pill--all${dutyFilter === "all" ? " active" : ""}`}
              onClick={() => setDutyFilter("all")}
            >
              All ({allResponders.length})
            </button>
            <button
              className={`rp-duty-pill rp-duty-pill--on${dutyFilter === "on" ? " active" : ""}`}
              onClick={() => setDutyFilter("on")}
            >
              <span className="rp-duty-dot" style={{ background: "#00B074" }} />
              On Duty ({onDutyCount})
            </button>
            <button
              className={`rp-duty-pill rp-duty-pill--off${dutyFilter === "off" ? " active" : ""}`}
              onClick={() => setDutyFilter("off")}
            >
              <span className="rp-duty-dot" style={{ background: "#9CA3AF" }} />
              Off Duty ({offDutyCount})
            </button>
          </div>
        )}

        {/* Notice */}
        <div className="rp-notice">
          <FaUserShield className="rp-notice-icon" size={13} />
          <span>
            <strong style={{ color: "var(--primary, #0066FF)" }}>Auth accounts</strong> are from your{" "}
            <code style={{ fontFamily: "monospace", fontSize: 11, background: "rgba(0,0,0,.05)", padding: "1px 5px", borderRadius: 4 }}>profiles</code> table.{" "}
            <strong style={{ color: "#FF9500" }}>Manual entries</strong> are from the{" "}
            <code style={{ fontFamily: "monospace", fontSize: 11, background: "rgba(0,0,0,.05)", padding: "1px 5px", borderRadius: 4 }}>responders</code> table.
            Use <strong style={{ color: "#00B074" }}>Add Responder</strong> to create both at once.
          </span>
        </div>

        {/* Toolbar */}
        <div className="rp-toolbar">
          <div className="rp-search-wrap">
            <FaSearch className="rp-search-icon" />
            <input
              className="rp-search"
              placeholder={`Search ${tab}…`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className={`rp-refresh-btn${refreshing ? " spinning" : ""}`}
            onClick={() => fetchAll(true)}
          >
            <FaSyncAlt size={11} /> Refresh
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{
              display: "inline-block", width: 24, height: 24, borderRadius: "50%",
              border: "2px solid var(--border, #E5E7EB)",
              borderTopColor: "var(--primary, #0066FF)",
              animation: "rpSpin .8s linear infinite",
            }} />
          </div>
        ) : (
          <div className="rp-table-wrap">
            <table className="rp-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Duty</th>
                  <th>Last Seen</th>
                  <th>{tab === "citizens" ? "Joined" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {tab === "responders" && (
                  filteredResponders.length === 0
                    ? <tr><td colSpan={6}><div className="rp-empty"><div className="rp-empty-icon"><FaUsers /></div><div className="rp-empty-text">No responders found</div></div></td></tr>
                    : filteredResponders.map(renderResponderRow)
                )}
                {tab === "citizens" && (
                  filteredCitizens.length === 0
                    ? <tr><td colSpan={6}><div className="rp-empty"><div className="rp-empty-icon"><FaUserCircle /></div><div className="rp-empty-text">No citizens found</div></div></td></tr>
                    : filteredCitizens.map(renderCitizenRow)
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Modal */}
        {showAdd && (
          <div className="rp-overlay" onClick={() => setShowAdd(false)}>
            <div className="rp-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="rp-modal-title">Add Responder</h3>
              <p className="rp-modal-sub">
                Create a login account and add them to the responders list in one step.
                {createAuth && " They'll receive a confirmation email and must verify it before they can sign in."}
              </p>

              <div className="rp-auth-toggle" onClick={() => setCreateAuth((v) => !v)}>
                <div className="rp-auth-toggle-left">
                  <span className="rp-auth-toggle-label">Create Login Account</span>
                  <span className="rp-auth-toggle-sub">Lets the responder log in with email &amp; password</span>
                </div>
                <div className={`rp-auth-switch${createAuth ? " on" : ""}`} />
              </div>

              <div className="rp-field-row">
                <div className="rp-field">
                  <label className="rp-label">First Name</label>
                  <input
                    className="rp-input" placeholder="e.g. Juan"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="rp-field">
                  <label className="rp-label">Last Name</label>
                  <input
                    className="rp-input" placeholder="e.g. dela Cruz"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="rp-field">
                <label className="rp-label">Email</label>
                <input
                  className="rp-input" type="email" placeholder="e.g. juan@bfp.gov.ph"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {createAuth && (
                <div className="rp-auth-section">
                  <div className="rp-auth-section-label">Login Credentials</div>
                  <div className="rp-field" style={{ marginBottom: 0 }}>
                    <label className="rp-label">Password</label>
                    <div className="rp-input-wrap">
                      <input
                        className="rp-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={{ paddingRight: 38 }}
                      />
                      <button className="rp-pw-toggle" type="button" onClick={() => setShowPassword((v) => !v)}>
                        {showPassword ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="rp-notice" style={{ marginTop: 14, marginBottom: 0 }}>
                <FaUserShield className="rp-notice-icon" size={12} />
                <span>
                  Duty status is set automatically — responders are tagged{" "}
                  <strong style={{ color: "#00B074" }}>On Duty</strong> when they log in and{" "}
                  <strong style={{ color: "var(--text-tertiary, #9CA3AF)" }}>Off Duty</strong> when they log out.
                </span>
              </div>

              {modalError   && <div className="rp-modal-error" style={{ marginTop: 14 }}>⚠ {modalError}</div>}
              {modalSuccess && <div className="rp-modal-success" style={{ marginTop: 14 }}>{modalSuccess}</div>}

              <div className="rp-modal-actions">
                <button className="rp-modal-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
                <button className="rp-modal-save" onClick={addResponder} disabled={saving}>
                  {saving && <span className="rp-spinner" />}
                  {saving ? "Saving…" : "Add Responder"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEdit && (
          <div className="rp-overlay" onClick={() => setShowEdit(false)}>
            <div className="rp-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="rp-modal-title">Edit Responder</h3>
              <p className="rp-modal-sub">Update the details for this manual entry.</p>
              <div className="rp-field">
                <label className="rp-label">Full Name</label>
                <input className="rp-input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="rp-field">
                <label className="rp-label">Email</label>
                <input className="rp-input" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
              <div className="rp-field">
                <label className="rp-label">Duty Status</label>
                <select
                  className="rp-select"
                  value={editForm.on_duty ? "on" : "off"}
                  onChange={(e) => setEditForm({ ...editForm, on_duty: e.target.value === "on" })}
                >
                  <option value="on">On Duty</option>
                  <option value="off">Off Duty</option>
                </select>
              </div>
              <div className="rp-modal-actions">
                <button className="rp-modal-cancel" onClick={() => setShowEdit(false)}>Cancel</button>
                <button className="rp-modal-save" onClick={updateResponder}>Update</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}