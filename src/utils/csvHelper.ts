import { Guest, GuestCategory } from '../types/wedding';

export interface ParsedGuestRow {
  name: string;
  phone: string;
  countryCode: string;
  familyName?: string;
  category: GuestCategory;
  expectedMembers: number;
  notes?: string;
  isValid: boolean;
  errors: string[];
}

export const SAMPLE_CSV_TEMPLATE = `Full Name,Phone Number,Country Code,Family Group Name,Category,Expected Members,Notes
Amitabh Bachchan,9820011223,+91,Bachchan Family,Relatives,4,Traveling with family
Sunita Agarwal,9811224455,+91,Agarwal Family,Bride's family,3,Vegetarian only
Karan Johar,9833446677,+91,Johar Family,Friends,2,College friend
Deepika Padukone,9844558899,+91,Padukone Family,Friends,2,Plus one attending
Ramesh Patel,9855661122,+91,Patel Family,Neighbours,5,Elderly family members
`;

export function downloadSampleCsvTemplate() {
  const blob = new Blob([SAMPLE_CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'weddingguest_sample_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseAndValidateCsv(
  csvText: string,
  existingPhones: Set<string>
): ParsedGuestRow[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  // Determine if first row is header
  const firstRow = lines[0].toLowerCase();
  const startIndex = firstRow.includes('name') || firstRow.includes('phone') ? 1 : 0;

  const validCategories: GuestCategory[] = [
    "Bride's family",
    "Groom's family",
    'Friends',
    'Relatives',
    'Colleagues',
    'Neighbours',
    'Other',
  ];

  const seenInFile = new Set<string>();
  const parsedRows: ParsedGuestRow[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const rawLine = lines[i];
    // Simple CSV tokenizer handling quoted strings
    const cols: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let charIdx = 0; charIdx < rawLine.length; charIdx++) {
      const char = rawLine[charIdx];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cols.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    cols.push(current.trim());

    if (cols.length === 0 || cols.every((c) => c === '')) continue;

    const name = cols[0] || '';
    const rawPhone = cols[1] || '';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const countryCode = cols[2]?.startsWith('+') ? cols[2] : '+91';
    const familyName = cols[3] || (name ? `${name.split(' ')[0]} Family` : '');
    
    // Normalize Category
    let category: GuestCategory = 'Friends';
    const rawCat = cols[4]?.toLowerCase() || '';
    if (rawCat.includes('bride')) category = "Bride's family";
    else if (rawCat.includes('groom')) category = "Groom's family";
    else if (rawCat.includes('relative')) category = 'Relatives';
    else if (rawCat.includes('colleague') || rawCat.includes('office') || rawCat.includes('work')) category = 'Colleagues';
    else if (rawCat.includes('neighbour') || rawCat.includes('neighbor')) category = 'Neighbours';
    else if (rawCat.includes('friend')) category = 'Friends';
    else if (rawCat.includes('other')) category = 'Other';

    const expectedMembers = Math.max(1, parseInt(cols[5]) || 2);
    const notes = cols[6] || '';

    // Validations
    const errors: string[] = [];

    if (!name || name.trim().length < 2) {
      errors.push('Missing or invalid guest name');
    }

    if (!cleanPhone || cleanPhone.length < 8) {
      errors.push('Phone number is too short or missing');
    }

    if (seenInFile.has(cleanPhone)) {
      errors.push('Duplicate phone number in this file');
    } else {
      seenInFile.add(cleanPhone);
    }

    if (existingPhones.has(cleanPhone)) {
      errors.push('Phone number already exists in your guest list');
    }

    parsedRows.push({
      name,
      phone: cleanPhone,
      countryCode,
      familyName,
      category,
      expectedMembers,
      notes,
      isValid: errors.length === 0,
      errors,
    });
  }

  return parsedRows;
}

export function exportGuestsToCsv(
  guests: Guest[],
  weddingTitle: string,
  rsvpLookup: (guestId: string) => { status: string; total: number; adults: number; kids: number; dietary?: string }
) {
  const headers = [
    'Guest Name',
    'Phone Number',
    'Country Code',
    'Family Group',
    'Category',
    'Expected Members',
    'RSVP Status',
    'Confirmed Attendees',
    'Adults',
    'Children',
    'Dietary Requirements',
    'Notes',
  ];

  const rows = guests.map((g) => {
    const rsvp = rsvpLookup(g.guestId);
    return [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.phone}"`,
      `"${g.countryCode}"`,
      `"${(g.familyName || '').replace(/"/g, '""')}"`,
      `"${g.category}"`,
      g.expectedMembers,
      `"${rsvp.status}"`,
      rsvp.total,
      rsvp.adults,
      rsvp.kids,
      `"${(rsvp.dietary || '').replace(/"/g, '""')}"`,
      `"${(g.notes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${weddingTitle.replace(/\s+/g, '_')}_Guest_List.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
