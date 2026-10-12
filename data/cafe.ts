/**
 * Nurvana Café — business details.
 * One source for hours, address and contact used by the Visit section, footer and nav.
 */

export interface HoursRow {
  label: string;
  days: number[]; // 0 = Sunday … 6 = Saturday
  open: string;   // "HH:MM" 24h
  close: string;  // "HH:MM" 24h
}

export const CAFE = {
  address: {
    street: "142 Artisan Alley",
    district: "Roast District",
    note: "Corner of Bean & Steam",
  },
  phone: "+1 (555) 234-5678",
  email: "hello@nurvanacafe.com",
  transit: "3 min walk from Roast District Station",
  hours: [
    { label: "Mon – Fri", days: [1, 2, 3, 4, 5], open: "07:00", close: "20:00" },
    { label: "Saturday", days: [6], open: "08:00", close: "21:00" },
    { label: "Sunday", days: [0], open: "08:00", close: "19:00" },
  ] satisfies HoursRow[],
  amenities: [
    { icon: "wifi", label: "Free Wi-Fi" },
    { icon: "power", label: "Outlets at every table" },
    { icon: "pets", label: "Pet-friendly patio" },
    { icon: "local_mall", label: "Pickup counter" },
  ],
};

export const fullAddress = `${CAFE.address.street}, ${CAFE.address.district}`;

/** "07:00" → "7:00 AM" */
export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function rowFor(day: number) {
  return CAFE.hours.find((r) => r.days.includes(day))!;
}

function minutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export interface OpenStatus {
  open: boolean;
  text: string;      // e.g. "Open now · until 8:00 PM"
  todayIndex: number; // index into CAFE.hours for today's row
}

/** Live open/closed status in the visitor's local time. */
export function getOpenStatus(now: Date): OpenStatus {
  const day = now.getDay();
  const today = rowFor(day);
  const mins = now.getHours() * 60 + now.getMinutes();
  const todayIndex = CAFE.hours.indexOf(today);

  if (mins >= minutes(today.open) && mins < minutes(today.close)) {
    const left = minutes(today.close) - mins;
    return {
      open: true,
      text: left <= 60 ? `Closing soon · ${formatTime(today.close)}` : `Open now · until ${formatTime(today.close)}`,
      todayIndex,
    };
  }
  if (mins < minutes(today.open)) {
    return { open: false, text: `Closed · opens ${formatTime(today.open)}`, todayIndex };
  }
  const tomorrow = rowFor((day + 1) % 7);
  return { open: false, text: `Closed · opens ${formatTime(tomorrow.open)} tomorrow`, todayIndex };
}

/** Hero announcement chip. Set to null to hide it. */
export const ANNOUNCEMENT: { label: string; text: string; short: string; href: string } | null = {
  label: "New season",
  text: "Pumpkin Spice Chai & Honey Lavender Latte are back",
  short: "Pumpkin Spice Chai is back",
  href: "/menu#seasonal",
};
