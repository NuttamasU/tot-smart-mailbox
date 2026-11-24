
"use client";

import { useEffect, useState } from "react";
import {
  Bell, Lock, Unlock, Package, Thermometer,
  Droplets, Gauge, ShieldCheck, ShieldAlert,
  Home, Settings, ChevronRight, Wifi, WifiOff,
  Clock, AlertTriangle, CheckCircle2, Mail,
  Plus, X, ArrowUpRight
} from "lucide-react";

import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

import {
  mockMailbox, mockSensorHistory, mockEvents
} from "@/lib/mock-data";

import { initializeLiff } from "@/lib/liff";

type Tab = "dashboard" | "notifications" | "control";
type Filter = "all" | "critical" | "warning" | "info";

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [hasMailbox, setHasMailbox] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [doorStatus, setDoorStatus] = useState(
    mockMailbox.doorStatus
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingCommand, setPendingCommand] =
    useState<"lock" | "unlock" | null>(null);
  const [commandLoading, setCommandLoading] = useState(false);
  const [lastCommand, setLastCommand] = useState(
    "ยังไม่มีคำสั่งล่าสุด"
  );
  const [profile, setProfile] = useState<{
    userId: string;
    displayName: string;
    pictureUrl?: string;
  } | null>(null);

  useEffect(() => {
    initializeLiff().then((user) => {
      if (user) setProfile(user);
    });
  }, []);

  const mailbox = mockMailbox;

  const filteredEvents = mockEvents.filter((event) =>
    filter === "all" ? true : event.severity === filter
  );

  function requestCommand(command: "lock" | "unlock") {
    setPendingCommand(command);
    setShowConfirm(true);
  }

  async function confirmCommand() {
    if (!pendingCommand) return;

    setCommandLoading(true);

    try {
      // Mock response only.
      // Replace with an authenticated Backend API call later.
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setDoorStatus(pendingCommand === "lock" ? "locked" : "unlocked");

      setLastCommand(
        pendingCommand === "lock"
          ? "ส่งคำสั่งล็อกสำเร็จ (Mock)"
          : "ส่งคำสั่งปลดล็อกสำเร็จ (Mock)"
      );
    } catch {
      setLastCommand("ไม่สามารถส่งคำสั่งได้");
    } finally {
      setCommandLoading(false);
      setShowConfirm(false);
      setPendingCommand(null);
    }
  }

  if (!hasMailbox) {
    return (
      <main className="app-shell">
        <header className="top-header">
          <div className="brand">
            <div className="brand-icon"><Mail /></div>
            <div>
              <h1>Smart Mailbox</h1>
              <p>ระบบจัดการกล่องจดหมายอัจฉริยะ</p>
            </div>
          </div>
        </header>

        <section className="empty-state">
          <div className="empty-icon">
            <Mail size={48} />
          </div>
          <h2>ยังไม่ได้เชื่อมต่อกล่องจดหมาย</h2>
          <p>
            เชื่อมต่อกับ Smart Mailbox ของครอบครัว
            เพื่อเริ่มต้นใช้งานระบบ
          </p>
          <button
            className="primary-button"
            onClick={() => alert("ฟังก์ชันผูกกล่องจะพัฒนาในขั้นถัดไป")}
          >
            <Plus size={18} />
            เชื่อมต่อกล่องจดหมาย
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="top-header">
        <div className="brand">
          <div className="brand-icon"><Mail /></div>
          <div>
            <h1>Smart Mailbox</h1>
            <p>บ้านของครอบครัว</p>
          </div>
        </div>

        <div className="header-right">
          <span className="avatar">
            {profile?.pictureUrl ? (
              <img src={profile.pictureUrl} alt="Profile" />
            ) : (
              profile?.displayName?.charAt(0) || "U"
            )}
          </span>
        </div>
      </header>

      <section className="page-content">
        {tab === "dashboard" && (
          <Dashboard
            doorStatus={doorStatus}
            onNavigate={setTab}
          />
        )}

        {tab === "notifications" && (
          <Notifications
            filter={filter}
            setFilter={setFilter}
            events={filteredEvents}
          />
        )}

        {tab === "control" && (
          <Control
            doorStatus={doorStatus}
            deviceStatus={mailbox.deviceStatus}
            lastCommand={lastCommand}
            onCommand={requestCommand}
          />
        )}
      </section>

      <nav className="bottom-nav">
        <NavItem
          icon={<Home />}
          label="หน้าหลัก"
          active={tab === "dashboard"}
          onClick={() => setTab("dashboard")}
        />
        <NavItem
          icon={<Bell />}
          label="แจ้งเตือน"
          active={tab === "notifications"}
          onClick={() => setTab("notifications")}
          badge={mockEvents.filter(e => e.severity === "critical").length}
        />
        <NavItem
          icon={<Lock />}
          label="ควบคุม"
          active={tab === "control"}
          onClick={() => setTab("control")}
        />
      </nav>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setShowConfirm(false)}
              disabled={commandLoading}
            >
              <X />
            </button>

            <div className="modal-icon">
              {pendingCommand === "unlock"
                ? <Unlock size={28} />
                : <Lock size={28} />}
            </div>

            <h2>
              {pendingCommand === "unlock"
                ? "ยืนยันการปลดล็อก?"
                : "ยืนยันการล็อกกล่อง?"}
            </h2>

            <p>
              {pendingCommand === "unlock"
                ? "คุณต้องการส่งคำสั่งปลดล็อกกล่องจดหมายใช่หรือไม่"
                : "คุณต้องการส่งคำสั่งล็อกกล่องจดหมายใช่หรือไม่"}
            </p>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setShowConfirm(false)}
                disabled={commandLoading}
              >
                ยกเลิก
              </button>
              <button
                className="primary-button"
                onClick={confirmCommand}
                disabled={commandLoading}
              >
                {commandLoading ? "กำลังส่งคำสั่ง..." : "ยืนยัน"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function NavItem({
  icon, label, active, onClick, badge
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      className={`nav-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="nav-icon">
        {icon}
        {!!badge && <span className="nav-badge">{badge}</span>}
      </span>
      <span>{label}</span>
    </button>
  );
}

function SectionTitle({
  title, subtitle, action
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Dashboard({
  doorStatus,
  onNavigate
}: {
  doorStatus: "locked" | "unlocked";
  onNavigate: (tab: Tab) => void;
}) {
  const m = mockMailbox;

  return (
    <div className="page-stack">
      <div className="welcome-row">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h2>ภาพรวมกล่องจดหมาย</h2>
          <p className="muted">ข้อมูลสถานะของบ้านคุณ</p>
        </div>
        <div className="device-online">
          <span className="online-dot" />
          Online
        </div>
      </div>

      <div className="status-card">
        <div className="status-card-top">
          <div>
            <p className="card-label">MAILBOX STATUS</p>
            <h2>กล่องจดหมายปกติ</h2>
            <p className="status-description">
              ระบบทำงานและเชื่อมต่ออุปกรณ์อยู่
            </p>
          </div>
          <div className="status-icon">
            <ShieldCheck size={30} />
          </div>
        </div>

        <div className="status-divider" />

        <div className="status-bottom">
          <div>
            <span className="small-label">สถานะประตู</span>
            <strong>
              {doorStatus === "locked" ? "ล็อกอยู่" : "ปลดล็อกอยู่"}
            </strong>
          </div>
          <div>
            <span className="small-label">รหัสกล่อง</span>
            <strong>{m.code}</strong>
          </div>
          <div>
            <span className="small-label">อัปเดตล่าสุด</span>
            <strong>10:42:15</strong>
          </div>
        </div>
      </div>

      <SectionTitle
        title="ข้อมูลจาก Sensor"
        subtitle="ค่าล่าสุดจากอุปกรณ์"
      />

      <div className="sensor-grid">
        <SensorCard
          icon={<Thermometer />}
          label="อุณหภูมิ"
          value={m.temperature}
          unit="°C"
          color="orange"
          note="อุณหภูมิภายในกล่อง"
        />
        <SensorCard
          icon={<Droplets />}
          label="ความชื้น"
          value={m.humidity}
          unit="%"
          color="blue"
          note="ความชื้นภายในกล่อง"
        />
        <SensorCard
          icon={<Package />}
          label="ความจุกล่อง"
          value={m.fillLevel}
          unit="%"
          color="green"
          note="พื้นที่ภายในที่ถูกใช้งาน"
          progress={m.fillLevel}
        />
        <SensorCard
          icon={<ShieldCheck />}
          label="ความปลอดภัย"
          value="ปกติ"
          unit=""
          color="green"
          note="ไม่พบความผิดปกติ"
        />
      </div>

      <section className="panel">
        <SectionTitle
          title="Sensor History"
          subtitle="ข้อมูลอุณหภูมิย้อนหลัง 24 ชั่วโมง"
          action={<span className="period-tag">24 ชั่วโมง</span>}
        />

        <div className="chart-legend">
          <span><i className="legend-dot temperature" /> อุณหภูมิ (°C)</span>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockSensorHistory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0eb" />
              <XAxis
                dataKey="time"
                tick={{ fill: "#89918a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["dataMin - 2", "dataMax + 2"]}
                tick={{ fill: "#89918a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temperature"
                name="อุณหภูมิ"
                stroke="#3e8654"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <SectionTitle
          title="Recent Activity"
          subtitle="เหตุการณ์ล่าสุดของกล่องจดหมาย"
          action={
            <button
              className="text-button"
              onClick={() => onNavigate("notifications")}
            >
              ดูทั้งหมด <ChevronRight size={15} />
            </button>
          }
        />

        <div className="activity-list">
          {mockEvents.slice(0, 3).map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </div>
      </section>

      <p className="mock-notice">
        * ข้อมูลทั้งหมดในหน้านี้เป็น Mock Data สำหรับทดสอบ UI
      </p>
    </div>
  );
}

function SensorCard({
  icon, label, value, unit, color, note, progress
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  color: string;
  note: string;
  progress?: number;
}) {
  return (
    <div className="sensor-card">
      <div className={`sensor-icon ${color}`}>{icon}</div>
      <p className="sensor-label">{label}</p>
      <div className="sensor-value">
        {value}<span>{unit}</span>
      </div>
      {progress !== undefined && (
        <div className="progress-track">
          <div style={{ width: `${progress}%` }} />
        </div>
      )}
      <p className="sensor-note">{note}</p>
    </div>
  );
}

function EventRow({
  event
}: {
  event: (typeof mockEvents)[number];
}) {
  const styles = {
    info: { icon: <Package />, className: "info" },
    warning: { icon: <AlertTriangle />, className: "warning" },
    critical: { icon: <ShieldAlert />, className: "critical" },
  };

  const style = styles[event.severity];

  return (
    <div className="event-row">
      <div className={`event-icon ${style.className}`}>
        {style.icon}
      </div>
      <div className="event-info">
        <strong>{event.title}</strong>
        <p>{event.description}</p>
        <span><Clock size={12} /> {event.timestamp}</span>
      </div>
      <ArrowUpRight size={16} className="event-arrow" />
    </div>
  );
}

function Notifications({
  filter, setFilter, events
}: {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  events: typeof mockEvents;
}) {
  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "ทั้งหมด" },
    { id: "critical", label: "สำคัญ" },
    { id: "warning", label: "แจ้งเตือน" },
    { id: "info", label: "ปกติ" },
  ];

  return (
    <div className="page-stack">
      <div className="welcome-row">
        <div>
          <p className="eyebrow">ACTIVITY CENTER</p>
          <h2>การแจ้งเตือน</h2>
          <p className="muted">ประวัติเหตุการณ์ของ Smart Mailbox</p>
        </div>
        <div className="notification-count">
          <Bell size={19} />
          {mockEvents.length}
        </div>
      </div>

      <div className="filter-row">
        {filters.map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`filter-chip ${filter === item.id ? "selected" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="panel">
        <SectionTitle
          title="ประวัติเหตุการณ์"
          subtitle={`${events.length} รายการ`}
        />

        {events.length ? (
          <div className="notification-list">
            {events.map((event) => (
              <div key={event.id} className="notification-item">
                <EventRow event={event} />
                <div className="severity-row">
                  <span className={`severity-badge ${event.severity}`}>
                    {event.severity === "critical"
                      ? "Critical"
                      : event.severity === "warning"
                      ? "Warning"
                      : "Info"}
                  </span>
                  <span className="event-time">{event.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <CheckCircle2 size={35} />
            <p>ไม่มีรายการแจ้งเตือนในหมวดนี้</p>
          </div>
        )}
      </section>

      <p className="mock-notice">
        * รายการนี้เป็น Event ตัวอย่าง ยังไม่ได้เชื่อมระบบส่ง LINE Notification
      </p>
    </div>
  );
}

function Control({
  doorStatus, deviceStatus, lastCommand, onCommand
}: {
  doorStatus: "locked" | "unlocked";
  deviceStatus: "online" | "offline";
  lastCommand: string;
  onCommand: (command: "lock" | "unlock") => void;
}) {
  const locked = doorStatus === "locked";
  const online = deviceStatus === "online";

  return (
    <div className="page-stack">
      <div className="welcome-row">
        <div>
          <p className="eyebrow">REMOTE ACCESS</p>
          <h2>ควบคุมกล่องจดหมาย</h2>
          <p className="muted">จัดการสถานะการล็อกกล่อง</p>
        </div>
      </div>

      <section className="control-panel">
        <div className="control-device">
          <div className="control-device-icon">
            {locked ? <Lock size={36} /> : <Unlock size={36} />}
          </div>
          <span className={`device-status ${online ? "online" : "offline"}`}>
            {online ? <Wifi size={13} /> : <WifiOff size={13} />}
            {online ? "Device Online" : "Device Offline"}
          </span>
          <h2>{locked ? "Locked" : "Unlocked"}</h2>
          <p>
            {locked
              ? "กล่องจดหมายอยู่ในสถานะล็อก"
              : "กล่องจดหมายอยู่ในสถานะปลดล็อก"}
          </p>
        </div>

        <div className="control-actions">
          <button
            className="unlock-button"
            onClick={() => onCommand("unlock")}
            disabled={!online || !locked}
          >
            <Unlock size={19} />
            ปลดล็อกกล่อง
          </button>

          <button
            className="lock-button"
            onClick={() => onCommand("lock")}
            disabled={!online || locked}
          >
            <Lock size={19} />
            ล็อกกล่อง
          </button>
        </div>

        {!online && (
          <p className="control-warning">
            ไม่สามารถควบคุมกล่องได้ เนื่องจากอุปกรณ์ Offline
          </p>
        )}
      </section>

      <section className="panel">
        <SectionTitle
          title="ผลการทำงานล่าสุด"
          subtitle="ประวัติคำสั่งควบคุม"
        />
        <div className="last-command">
          <div className="event-icon info">
            <Settings size={20} />
          </div>
          <div>
            <strong>{lastCommand}</strong>
            <p>คำสั่งล่าสุดจากผู้ใช้งาน</p>
          </div>
        </div>
      </section>

      <div className="security-note">
        <ShieldCheck size={22} />
        <div>
          <strong>ระบบรักษาความปลอดภัย</strong>
          <p>
            การควบคุมกล่องจะต้องผ่านการตรวจสอบสิทธิ์ของสมาชิก
            และรอผลยืนยันจาก Hardware ก่อนเปลี่ยนสถานะจริง
          </p>
        </div>
      </div>

      <p className="mock-notice">
        * การควบคุมในเวอร์ชันนี้เป็นการจำลอง ไม่ได้ส่งคำสั่งไปยังอุปกรณ์จริง
      </p>
    </div>
  );
}
