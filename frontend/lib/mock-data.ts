
export const mockMailbox = {
  id: "mock-mailbox-001",
  name: "บ้านของครอบครัว",
  code: "MB-001",
  deviceStatus: "online" as "online" | "offline",
  doorStatus: "locked" as "locked" | "unlocked",
  securityStatus: "normal" as "normal" | "warning",
  temperature: 29,
  humidity: 65,
  fillLevel: 45,
  lastUpdated: new Date().toISOString(),
};

export const mockSensorHistory = [
  { time: "00:00", temperature: 27, humidity: 70 },
  { time: "04:00", temperature: 26, humidity: 72 },
  { time: "08:00", temperature: 28, humidity: 68 },
  { time: "12:00", temperature: 31, humidity: 62 },
  { time: "16:00", temperature: 30, humidity: 64 },
  { time: "20:00", temperature: 29, humidity: 65 },
  { time: "24:00", temperature: 28, humidity: 67 },
];

export type MailboxEvent = {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
};

export const mockEvents: MailboxEvent[] = [
  {
    id: "event-001",
    type: "parcel_received",
    title: "มีพัสดุเข้ามา",
    description: "ตรวจพบพัสดุใหม่ในกล่องจดหมาย",
    severity: "info",
    timestamp: "วันนี้ 10:30",
  },
  {
    id: "event-002",
    type: "tampering_detected",
    title: "ตรวจพบความผิดปกติบริเวณประตู",
    description: "ระบบตรวจพบการเปิดประตูที่ผิดปกติ",
    severity: "critical",
    timestamp: "วันนี้ 10:35",
  },
  {
    id: "event-003",
    type: "water_detected",
    title: "ตรวจพบน้ำเข้า",
    description: "เซนเซอร์ตรวจพบความผิดปกติจากน้ำ",
    severity: "warning",
    timestamp: "วันนี้ 09:15",
  },
  {
    id: "event-004",
    type: "mailbox_full",
    title: "กล่องจดหมายใกล้เต็ม",
    description: "ความจุกล่องจดหมายถึงระดับที่กำหนด",
    severity: "warning",
    timestamp: "เมื่อวาน 18:20",
  },
];
