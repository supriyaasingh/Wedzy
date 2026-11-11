export type WeddingThemeId = 
  | 'royal_maroon' 
  | 'south_indian' 
  | 'punjabi_baraat' 
  | 'floral_pastel' 
  | 'minimal_gold';

export interface WeddingThemeInfo {
  id: WeddingThemeId;
  name: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  imageAsset: string;
  motifs: string[];
  description: string;
}

export type GuestCategory = 
  | "Bride's family" 
  | "Groom's family" 
  | 'Friends' 
  | 'Relatives' 
  | 'Colleagues' 
  | 'Neighbours' 
  | 'Other';

export type InvitationSharingStatus = 
  | 'not_sent'          // Not Sent
  | 'not_shared'        // Synonym for not_sent
  | 'ready_to_send'     // Ready to Send (valid phone & link generated)
  | 'whatsapp_opened'   // WhatsApp Opened
  | 'marked_sent'       // Manually Marked as Sent
  | 'api_accepted'      // API Accepted (by Meta Cloud API)
  | 'sent'              // Sent (confirmed by Meta webhook)
  | 'delivered'         // Delivered (confirmed by Meta webhook)
  | 'read'              // Read (confirmed by Meta webhook)
  | 'failed'            // Failed (invalid phone or delivery bounce)
  | 'rsvp_received';    // RSVP Received

export type RSVPAttendanceStatus = 
  | 'attending' 
  | 'declined' 
  | 'pending';

export interface WeddingUser {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface WeddingEvent {
  eventId: string;
  weddingId: string;
  eventName: string;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  venue: string;
  address?: string;
  dressCode?: string;
  description?: string;
  separateRsvp: boolean;
  requiredFoodCount?: boolean;
}

export interface Guest {
  guestId: string;
  weddingId: string;
  name: string;
  phone: string;
  countryCode: string; // e.g. "+91"
  email?: string;
  familyName?: string;
  category: GuestCategory;
  expectedMembers: number;
  notes?: string;
  assignedTableId?: string;
  createdAt: string;
}

export type QuestionType = 'yes_no' | 'multiple_choice' | 'short_answer' | 'number';

export interface CustomRsvpQuestion {
  questionId: string;
  weddingId: string;
  eventId?: string; // undefined or '' means applies to all events
  questionText: string;
  questionType: QuestionType;
  options?: string[]; // for multiple choice
  isRequired: boolean;
  order: number;
}

export interface EventRSVP {
  rsvpId: string;
  guestId: string;
  eventId: string;
  weddingId: string;
  attendanceStatus: RSVPAttendanceStatus;
  adultCount: number;
  childCount: number;
  totalAttendees: number;
  accompanyingGuests?: string[];
  dietaryRequirements?: string;
  additionalMessage?: string;
  customAnswers?: Record<string, string | number | boolean>;
  submittedAt: string;
  updatedAt: string;
}

export interface GuestInvitation {
  invitationId: string;
  guestId: string;
  weddingId: string;
  uniqueToken: string;
  sharingStatus: InvitationSharingStatus;
  lastOpenedAt?: string;
  markedSentAt?: string;
  apiMessageId?: string;
  apiStatus?: string;
  apiError?: string;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
}

export interface InvitationTokenRecord {
  token: string;
  weddingId: string;
  guestId: string;
  guestName: string;
  phone: string;
  familyName?: string;
  category?: string;
  expectedMembers: number;
  invitationUrl: string;
  status: InvitationSharingStatus;
  createdAt: string;
  lastAccessedAt?: string;
}

export interface FoodPlan {
  foodPlanId: string;
  weddingId: string;
  eventId: string;
  bufferPercentage: number; // 0 to 30%, default 5
  manualAdjustment: number; // + / - plates
  recommendedPlates: number;
  updatedAt: string;
}

export interface CateringPlan {
  catererName: string;
  contactNumber: string;
  foodMenu: string;
  vegPlates: number;
  nonVegPlates: number;
  childPlates: number;
  specialDietaryMeals: number;
  platesOrdered: number;
  estimatedCostPerPlate: number;
  totalBudget: number;
  depositPaid?: number;
  actualCost?: number;
  notes?: string;
}

export interface SeatingTable {
  tableId: string;
  weddingId: string;
  tableName: string;
  capacity: number;
  assignedGuestIds: string[];
}

export interface GuestCheckIn {
  checkInId: string;
  guestId: string;
  eventId: string;
  checkedInAt: string;
  attendeesPresent: number;
}

export interface Wedding {
  weddingId: string;
  ownerId: string;
  brideName: string;
  groomName: string;
  brideFamilyName?: string;
  groomFamilyName?: string;
  couplePhotoUrl?: string;
  weddingDate: string; // YYYY-MM-DD
  weddingTime: string; // HH:MM
  venue: string;
  venueAddress: string;
  googleMapsUrl?: string;
  rsvpDeadline: string; // YYYY-MM-DD
  contactPhone: string;
  contactEmail?: string;
  theme: WeddingThemeId;
  invitationMessage: string;
  customWhatsAppMessage?: string;
  customWhatsAppReminder?: string;
  isPublished: boolean;
  createdAt: string;
}
