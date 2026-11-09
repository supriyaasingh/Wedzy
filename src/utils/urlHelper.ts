/**
 * URL and Phone formatting utilities for WeddingGuest invitations & WhatsApp integration
 */

/**
 * Returns the base URL of the deployed application.
 * Honors VITE_APP_URL / APP_URL environment variables, falling back to window.location.origin.
 * Never outputs localhost in production.
 */
export function getBaseAppUrl(): string {
  // 1. Check Vite env var (injected from APP_URL)
  const envUrl = (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_URL) ||
    (typeof process !== 'undefined' && process.env?.APP_URL) ||
    ''
  ).trim();

  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/+$/, '');
  }

  // 2. Check window.location if in browser and not localhost
  if (typeof window !== 'undefined' && window.location.origin) {
    const origin = window.location.origin;
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return origin.replace(/\/+$/, '');
    }
  }

  // 3. Fall back to envUrl even if it was localhost (during local development only)
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }

  return typeof window !== 'undefined' ? window.location.origin.replace(/\/+$/, '') : '';
}

/**
 * Generates the canonical, public, permanent invitation URL for a guest token.
 * Uses the format: https://yourdomain.com/invitation/UNIQUE_GUEST_TOKEN
 */
export function getInvitationUrl(token: string): string {
  const baseUrl = getBaseAppUrl();
  return `${baseUrl}/?rsvp=${encodeURIComponent(token.trim())}`;
}

/**
 * Parses invitation token from current URL, supporting:
 * 1. Path routing: /invitation/:token or /rsvp/:token
 * 2. Query param: ?rsvp=:token or ?token=:token
 * 3. Hash routing: #/invitation/:token or #/rsvp/:token
 */
export function parseInvitationTokenFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Check query parameters first (?rsvp=tok_... or ?token=tok_...)
  const searchParams = new URLSearchParams(window.location.search);
  const queryToken = searchParams.get('rsvp') || searchParams.get('token');
  if (queryToken && queryToken.trim()) {
    return queryToken.trim();
  }

  // 2. Check pathname (/invitation/tok_... or /rsvp/tok_...)
  const pathname = window.location.pathname;
  const pathMatch = pathname.match(/^\/(?:invitation|rsvp)\/([^/?#]+)/i);
  if (pathMatch && pathMatch[1]) {
    return decodeURIComponent(pathMatch[1].trim());
  }

  // 3. Check hash fragment (#/invitation/tok_... or #?rsvp=tok_...)
  const hash = window.location.hash;
  if (hash) {
    const hashPathMatch = hash.match(/#(?:(?:\/)?(?:invitation|rsvp)\/)?([^/?#&]+)/i);
    if (hashPathMatch && hashPathMatch[1] && hashPathMatch[1].startsWith('tok_')) {
      return decodeURIComponent(hashPathMatch[1].trim());
    }
    const hashQueryIndex = hash.indexOf('?');
    if (hashQueryIndex !== -1) {
      const hashParams = new URLSearchParams(hash.slice(hashQueryIndex));
      const hashToken = hashParams.get('rsvp') || hashParams.get('token');
      if (hashToken && hashToken.trim()) {
        return hashToken.trim();
      }
    }
  }

  return null;
}

/**
 * Validates and formats a WhatsApp phone number for Click-to-Chat (wa.me) & Cloud API.
 * - Strips all non-digit characters (spaces, brackets, hyphens, plus sign)
 * - Guarantees proper country code
 * - Validates length
 */
export function formatWhatsAppPhoneNumber(
  phone: string,
  countryCode: string = '+91'
): {
  cleanNumber: string;
  isValid: boolean;
  formattedDisplay: string;
  error?: string;
} {
  const rawPhone = (phone || '').trim();
  const rawCode = (countryCode || '+91').trim();

  // Clean country code digits only
  const codeDigits = rawCode.replace(/[^0-9]/g, '') || '91';

  // Clean phone digits only
  let phoneDigits = rawPhone.replace(/[^0-9]/g, '');

  if (!phoneDigits) {
    return {
      cleanNumber: '',
      isValid: false,
      formattedDisplay: '',
      error: 'WhatsApp phone number is required',
    };
  }

  // Remove leading zeros if present (common in Indian landline or STD numbers)
  if (phoneDigits.startsWith('0') && phoneDigits.length === 11) {
    phoneDigits = phoneDigits.substring(1);
  }

  let finalNumber = '';

  // If the number already starts with the country code (e.g. 919876543210 for a 10-digit number)
  if (phoneDigits.startsWith(codeDigits) && phoneDigits.length === codeDigits.length + 10) {
    finalNumber = phoneDigits;
  } else if (phoneDigits.length === 10) {
    // Standard 10-digit mobile number, prepend country code
    finalNumber = `${codeDigits}${phoneDigits}`;
  } else if (phoneDigits.length >= 8 && phoneDigits.length <= 15) {
    // International standard E.164 (without plus)
    finalNumber = phoneDigits;
  } else {
    return {
      cleanNumber: phoneDigits,
      isValid: false,
      formattedDisplay: `+${codeDigits} ${phoneDigits}`,
      error: 'Phone number must be at least 10 digits (excluding country code)',
    };
  }

  const nationalPart = finalNumber.startsWith(codeDigits)
    ? finalNumber.slice(codeDigits.length)
    : finalNumber;

  return {
    cleanNumber: finalNumber, // e.g. 919876543210 (digits only, no plus sign for wa.me)
    isValid: true,
    formattedDisplay: `+${codeDigits} ${nationalPart}`,
  };
}

/**
 * Standard Invitation Message conforming to Part 3 requirements:
 *
 * Hello Rahul Sharma!
 *
 * We are delighted to invite you and your family to the wedding of Priya and Aman.
 *
 * Date: 20 December 2026
 * Time: 7:00 PM
 * Venue: Mumbai
 *
 * Please confirm your attendance using your personal invitation link:
 *
 * [PERSONALIZED INVITATION LINK]
 *
 * We hope to celebrate this special occasion with you!
 */
export function formatOfficialInvitationMessage(params: {
  guestName: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  venueAddress?: string;
  token: string;
  customTemplate?: string;
}): string {
  const invitationUrl = getInvitationUrl(params.token);

  if (params.customTemplate) {
    return params.customTemplate
      .replace(/{guestName}/g, params.guestName)
      .replace(/{brideName}/g, params.brideName)
      .replace(/{groomName}/g, params.groomName)
      .replace(/{weddingDate}/g, params.weddingDate)
      .replace(/{weddingTime}/g, params.weddingTime)
      .replace(/{venue}/g, params.venue)
      .replace(/{venueAddress}/g, params.venueAddress || '')
      .replace(/{invitationUrl}/g, invitationUrl)
      .replace(/{rsvpUrl}/g, invitationUrl);
  }

  return `Hello ${params.guestName}!

We are delighted to invite you and your family to the wedding of ${params.brideName} and ${params.groomName}.

Date: ${params.weddingDate}
Time: ${params.weddingTime}
Venue: ${params.venue}${params.venueAddress ? `, ${params.venueAddress}` : ''}

Please confirm your attendance using your personal invitation link:

${invitationUrl}

We hope to celebrate this special occasion with you!`;
}

/**
 * Standard Reminder Message conforming to Part 8 requirements:
 *
 * Hello Rahul!
 *
 * We are finalizing our wedding arrangements.
 *
 * Could you please confirm whether you and your family will be attending?
 *
 * Please respond here:
 *
 * [PERSONALIZED RSVP LINK]
 *
 * Thank you!
 */
export function formatOfficialReminderMessage(params: {
  guestName: string;
  brideName: string;
  groomName: string;
  token: string;
  customTemplate?: string;
}): string {
  const invitationUrl = getInvitationUrl(params.token);
  const firstName = params.guestName.split(' ')[0] || params.guestName;

  if (params.customTemplate) {
    return params.customTemplate
      .replace(/{guestName}/g, firstName)
      .replace(/{brideName}/g, params.brideName)
      .replace(/{groomName}/g, params.groomName)
      .replace(/{invitationUrl}/g, invitationUrl)
      .replace(/{rsvpUrl}/g, invitationUrl);
  }

  return `Hello ${firstName}!

We are finalizing our wedding arrangements.

Could you please confirm whether you and your family will be attending?

Please respond here:

${invitationUrl}

Thank you!`;
}

/**
 * Generates official WhatsApp Click-to-Chat URL
 * Format: https://wa.me/919876543210?text=ENCODED_MESSAGE
 */
export function generateWhatsAppClickToChatLink(phone: string, countryCode: string = '+91', message: string): {
  link: string;
  cleanPhone: string;
  isValid: boolean;
  error?: string;
} {
  const parsed = formatWhatsAppPhoneNumber(phone, countryCode);
  const encoded = encodeURIComponent(message);

  if (parsed.isValid && parsed.cleanNumber) {
    return {
      link: `https://wa.me/${parsed.cleanNumber}?text=${encoded}`,
      cleanPhone: parsed.cleanNumber,
      isValid: true,
    };
  }

  // Resilient fallback: strip non-digits and ensure country code
  const digits = String(phone || '').replace(/[^0-9]/g, '');
  const codeDigits = String(countryCode || '+91').replace(/[^0-9]/g, '') || '91';
  let fallbackPhone = digits;
  if (digits && !digits.startsWith(codeDigits)) {
    fallbackPhone = `${codeDigits}${digits}`;
  }

  if (fallbackPhone.length >= 8) {
    return {
      link: `https://wa.me/${fallbackPhone}?text=${encoded}`,
      cleanPhone: fallbackPhone,
      isValid: true,
    };
  }

  return {
    link: '',
    cleanPhone: parsed.cleanNumber || digits,
    isValid: false,
    error: parsed.error || 'Invalid phone number for WhatsApp Click-to-Chat',
  };
}
