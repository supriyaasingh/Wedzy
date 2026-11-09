import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Wedding,
  WeddingEvent,
  Guest,
  GuestInvitation,
  EventRSVP,
  WeddingUser,
  WeddingThemeId,
  CateringPlan,
  SeatingTable,
  GuestCheckIn,
} from '../types/wedding';
import {
  DEMO_USER,
  DEMO_WEDDING,
  DEMO_EVENTS,
  DEMO_GUESTS,
  DEMO_INVITATIONS,
  DEMO_RSVPS,
} from '../data/initialDemoData';
import {
  syncWeddingToFirestore,
  syncEventToFirestore,
  deleteEventFromFirestore,
  syncGuestToFirestore,
  deleteGuestFromFirestore,
  syncInvitationToFirestore,
  updateInvitationStatusInFirestore,
  syncInvitationTokenRecord,
  getInvitationTokenRecord,
  getWeddingFromFirestore,
  getGuestFromFirestore,
  getEventsFromFirestore,
  syncRsvpToFirestore,
  listenToWeddingRsvps,
} from '../lib/firestoreService';
import {
  getBaseAppUrl,
  getInvitationUrl,
  formatWhatsAppPhoneNumber,
  formatOfficialInvitationMessage,
  formatOfficialReminderMessage,
  generateWhatsAppClickToChatLink,
} from '../utils/urlHelper';

interface FoodCalculations {
  confirmedAttendees: number;
  confirmedAdults: number;
  confirmedChildren: number;
  confirmedFamilies: number;
  declinedFamilies: number;
  pendingFamilies: number;
  totalInvitedFamilies: number;
  totalExpectedFromInvited: number;
  recommendedPlates: number;
  bufferPercentage: number;
  manualAdjustment: number;
}

interface WeddingContextType {
  currentUser: WeddingUser | null;
  setCurrentUser: (user: WeddingUser | null) => void;
  weddings: Wedding[];
  currentWedding: Wedding;
  setCurrentWeddingId: (weddingId: string) => void;
  events: WeddingEvent[];
  selectedEventId: string;
  setSelectedEventId: (eventId: string) => void;
  guests: Guest[];
  invitations: GuestInvitation[];
  rsvps: EventRSVP[];
  
  // Food Planning State
  foodBufferPercentage: number;
  setFoodBufferPercentage: (pct: number) => void;
  foodManualAdjustment: number;
  setFoodManualAdjustment: (adj: number) => void;
  getEventFoodCalculation: (eventId?: string) => FoodCalculations;
  cateringPlans: Record<string, CateringPlan>;
  getCateringPlan: (eventId: string) => CateringPlan;
  updateCateringPlan: (eventId: string, data: Partial<CateringPlan>) => void;

  // Actions
  addWedding: (weddingData: Omit<Wedding, 'weddingId' | 'ownerId' | 'createdAt'>) => Wedding;
  updateWedding: (weddingData: Partial<Wedding>) => void;
  deleteWedding: (weddingId: string) => void;
  addEvent: (eventData: Omit<WeddingEvent, 'eventId' | 'weddingId'> & { weddingId?: string }) => WeddingEvent;
  updateEvent: (eventId: string, data: Partial<WeddingEvent>) => void;
  deleteEvent: (eventId: string) => void;
  
  // Guest Management
  addGuest: (guestData: Omit<Guest, 'guestId' | 'weddingId' | 'createdAt'>) => Guest;
  updateGuest: (guestId: string, guestData: Partial<Guest>) => void;
  deleteGuest: (guestId: string) => void;
  bulkAddGuests: (newGuests: Omit<Guest, 'guestId' | 'weddingId' | 'createdAt'>[]) => number;

  // Invitations & WhatsApp
  getGuestInvitation: (guestId: string) => GuestInvitation | undefined;
  getGuestByToken: (token: string) => { guest: Guest; invitation: GuestInvitation; wedding: Wedding } | null;
  resolveGuestInvitationAsync: (token: string) => Promise<{ guest: Guest; invitation: GuestInvitation; wedding: Wedding } | null>;
  getInvitationUrlForGuest: (guestId: string) => string;
  updateInvitationStatus: (guestId: string, status: GuestInvitation['sharingStatus']) => void;
  toggleInvitationMarkedSent: (guestId: string) => void;
  formatPersonalizedWhatsAppMessage: (guest: Guest, customTemplate?: string) => string;
  formatPersonalizedReminderMessage: (guest: Guest, customTemplate?: string) => string;
  generateWhatsAppLink: (guest: Guest, customMsgTemplate?: string) => string;
  generateReminderWhatsAppLink: (guest: Guest, customReminderTemplate?: string) => string;
  validateGuestWhatsAppNumber: (guest: Guest) => { cleanNumber: string; isValid: boolean; formattedDisplay: string; error?: string };

  // RSVPs
  getGuestRSVP: (guestId: string, eventId?: string) => EventRSVP | undefined;
  submitGuestRSVP: (
    guestId: string,
    eventId: string,
    attendanceStatus: 'attending' | 'declined',
    adultCount: number,
    childCount: number,
    extraData?: {
      accompanyingGuests?: string[];
      dietaryRequirements?: string;
      additionalMessage?: string;
    }
  ) => EventRSVP;
  submitMultiEventRSVP: (
    guestId: string,
    responses: Array<{
      eventId: string;
      attendanceStatus: 'attending' | 'declined';
      adultCount: number;
      childCount: number;
      dietaryRequirements?: string;
      accompanyingGuests?: string[];
      additionalMessage?: string;
    }>
  ) => void;

  // Seating Management
  seatingTables: SeatingTable[];
  addTable: (tableName: string, capacity: number) => SeatingTable;
  updateTable: (tableId: string, data: Partial<SeatingTable>) => void;
  deleteTable: (tableId: string) => void;
  assignGuestToTable: (guestId: string, tableId: string | null) => void;

  // Day-of Check-In
  checkIns: GuestCheckIn[];
  checkInGuest: (guestId: string, eventId: string, attendeesPresent: number) => GuestCheckIn;
  undoCheckIn: (guestId: string, eventId: string) => void;
  isGuestCheckedIn: (guestId: string, eventId: string) => GuestCheckIn | undefined;

  // Theme
  setWeddingTheme: (themeId: WeddingThemeId) => void;

  // Reset to Demo
  resetToDemoData: () => void;
}

const STORAGE_KEYS = {
  USER: 'weddingguest_user_v1',
  WEDDINGS: 'weddingguest_weddings_v1',
  ACTIVE_WEDDING_ID: 'weddingguest_active_wedding_id_v1',
  EVENTS: 'weddingguest_events_v1',
  GUESTS: 'weddingguest_guests_v1',
  INVITATIONS: 'weddingguest_invitations_v1',
  RSVPS: 'weddingguest_rsvps_v1',
  BUFFER: 'weddingguest_buffer_v1',
  MANUAL_ADJ: 'weddingguest_manual_adj_v1',
};

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Current User
  const [currentUser, setCurrentUser] = useState<WeddingUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  // 2. Weddings
  const [weddings, setWeddings] = useState<Wedding[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEDDINGS);
      return saved ? JSON.parse(saved) : [DEMO_WEDDING];
    } catch {
      return [DEMO_WEDDING];
    }
  });

  const [currentWeddingId, setCurrentWeddingId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_WEDDING_ID) || DEMO_WEDDING.weddingId;
    } catch {
      return DEMO_WEDDING.weddingId;
    }
  });

  const currentWedding = weddings.find((w) => w.weddingId === currentWeddingId) || weddings[0] || DEMO_WEDDING;

  // Sanitizers to guarantee 100% unique IDs across all entities even with historical localStorage data
  const sanitizeEventList = (raw: WeddingEvent[]): WeddingEvent[] => {
    const seenIds = new Set<string>();
    return raw.map((ev, idx) => {
      let id = ev.eventId;
      if (!id || seenIds.has(id)) {
        id = `${id || 'evt'}_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
      }
      seenIds.add(id);
      return { ...ev, eventId: id };
    });
  };

  const sanitizeGuestList = (raw: Guest[]): Guest[] => {
    const seenIds = new Set<string>();
    return raw.map((g, idx) => {
      let id = g.guestId;
      if (!id || seenIds.has(id)) {
        id = `${id || 'gst'}_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
      }
      seenIds.add(id);
      return { ...g, guestId: id };
    });
  };

  const sanitizeInvitationList = (raw: GuestInvitation[]): GuestInvitation[] => {
    const seenIds = new Set<string>();
    return raw.map((inv, idx) => {
      let id = inv.invitationId;
      if (!id || seenIds.has(id)) {
        id = `${id || 'inv'}_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
      }
      seenIds.add(id);
      return { ...inv, invitationId: id };
    });
  };

  const sanitizeRsvpList = (raw: EventRSVP[]): EventRSVP[] => {
    const seenIds = new Set<string>();
    return raw.map((rsvp, idx) => {
      let id = rsvp.rsvpId;
      if (!id || seenIds.has(id)) {
        id = `${id || 'rsvp'}_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
      }
      seenIds.add(id);
      return { ...rsvp, rsvpId: id };
    });
  };

  // 3. Events
  const [events, setEvents] = useState<WeddingEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? sanitizeEventList(JSON.parse(saved)) : sanitizeEventList(DEMO_EVENTS);
    } catch {
      return sanitizeEventList(DEMO_EVENTS);
    }
  });

  const [selectedEventId, setSelectedEventId] = useState<string>(() => {
    const initialEvents = events && events.length > 0 ? events : DEMO_EVENTS;
    return initialEvents[2]?.eventId || initialEvents[0]?.eventId || 'evt_wedding';
  });

  // 4. Guests
  const [guests, setGuests] = useState<Guest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GUESTS);
      return saved ? sanitizeGuestList(JSON.parse(saved)) : DEMO_GUESTS;
    } catch {
      return DEMO_GUESTS;
    }
  });

  // 5. Invitations
  const [invitations, setInvitations] = useState<GuestInvitation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVITATIONS);
      return saved ? sanitizeInvitationList(JSON.parse(saved)) : DEMO_INVITATIONS;
    } catch {
      return DEMO_INVITATIONS;
    }
  });

  // 6. RSVPs
  const [rsvps, setRsvps] = useState<EventRSVP[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RSVPS);
      return saved ? sanitizeRsvpList(JSON.parse(saved)) : DEMO_RSVPS;
    } catch {
      return DEMO_RSVPS;
    }
  });

  // 7. Food buffer percentage (default 5%) & Manual Adjustment
  const [foodBufferPercentage, setFoodBufferPercentage] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUFFER);
      return saved ? Number(saved) : 5;
    } catch {
      return 5;
    }
  });

  const [foodManualAdjustment, setFoodManualAdjustment] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MANUAL_ADJ);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEDDINGS, JSON.stringify(weddings));
  }, [weddings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_WEDDING_ID, currentWeddingId);
  }, [currentWeddingId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(invitations));
  }, [invitations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(rsvps));
  }, [rsvps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUFFER, foodBufferPercentage.toString());
  }, [foodBufferPercentage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MANUAL_ADJ, foodManualAdjustment.toString());
  }, [foodManualAdjustment]);

  // Food Planning Calculator Logic (Crucial Business Objective)
  const getEventFoodCalculation = (targetEventId?: string): FoodCalculations => {
    const eventId = targetEventId || selectedEventId;
    const currentGuests = guests.filter((g) => g.weddingId === currentWedding.weddingId);
    const eventRsvps = rsvps.filter((r) => r.eventId === eventId && r.weddingId === currentWedding.weddingId);

    let confirmedAttendees = 0;
    let confirmedAdults = 0;
    let confirmedChildren = 0;
    let confirmedFamilies = 0;
    let declinedFamilies = 0;

    const rsvpByGuest = new Map<string, EventRSVP>();
    eventRsvps.forEach((r) => {
      rsvpByGuest.set(r.guestId, r);
    });

    currentGuests.forEach((guest) => {
      const rsvp = rsvpByGuest.get(guest.guestId);
      if (rsvp) {
        if (rsvp.attendanceStatus === 'attending') {
          confirmedFamilies += 1;
          confirmedAdults += rsvp.adultCount;
          confirmedChildren += rsvp.childCount;
          confirmedAttendees += rsvp.totalAttendees;
        } else if (rsvp.attendanceStatus === 'declined') {
          declinedFamilies += 1;
        }
      }
    });

    const totalInvitedFamilies = currentGuests.length;
    const pendingFamilies = Math.max(0, totalInvitedFamilies - confirmedFamilies - declinedFamilies);
    const totalExpectedFromInvited = currentGuests.reduce((acc, g) => acc + (g.expectedMembers || 1), 0);

    // Formula: Recommended plates = Confirmed attendees * (1 + buffer percentage / 100) + manualAdjustment
    // Round result up to next whole number
    const baseRecommended = Math.ceil(confirmedAttendees * (1 + foodBufferPercentage / 100));
    const recommendedPlates = Math.max(0, baseRecommended + foodManualAdjustment);

    return {
      confirmedAttendees,
      confirmedAdults,
      confirmedChildren,
      confirmedFamilies,
      declinedFamilies,
      pendingFamilies,
      totalInvitedFamilies,
      totalExpectedFromInvited,
      recommendedPlates,
      bufferPercentage: foodBufferPercentage,
      manualAdjustment: foodManualAdjustment,
    };
  };

  const DEFAULT_CATERING_PLANS: Record<string, CateringPlan> = {
    evt_haldi: {
      catererName: 'Maharaja Royal Caterers & Halwai',
      contactNumber: '+91 98290 12345',
      foodMenu: 'Rajasthani Morning Breakfast & Haldi Lunch, Dal Baati Churma, Gatte ki Sabzi, Live Jalebi & Rabdi',
      vegPlates: 40,
      nonVegPlates: 0,
      childPlates: 5,
      specialDietaryMeals: 3,
      platesOrdered: 45,
      estimatedCostPerPlate: 950,
      totalBudget: 42750,
      depositPaid: 15000,
    },
    evt_mehendi_sangeet: {
      catererName: 'Maharaja Royal Caterers & Halwai',
      contactNumber: '+91 98290 12345',
      foodMenu: 'Live Chaat counters, Pav Bhaji, Dum Biryani, Paneer Tikka, Kesariya Kulfi, Cocktail Appetizers',
      vegPlates: 70,
      nonVegPlates: 0,
      childPlates: 10,
      specialDietaryMeals: 5,
      platesOrdered: 80,
      estimatedCostPerPlate: 1200,
      totalBudget: 96000,
      depositPaid: 35000,
    },
    evt_wedding: {
      catererName: 'Maharaja Royal Caterers & Halwai',
      contactNumber: '+91 98290 12345',
      foodMenu: 'Grand Royal Banquet, Shahi Paneer, Dal Makhani, Malai Kofta, Live Tandoor Naans, Rasmalai, Moong Dal Halwa',
      vegPlates: 95,
      nonVegPlates: 0,
      childPlates: 15,
      specialDietaryMeals: 8,
      platesOrdered: 110,
      estimatedCostPerPlate: 1500,
      totalBudget: 165000,
      depositPaid: 60000,
    },
    evt_reception: {
      catererName: 'Maharaja Royal Caterers & Halwai',
      contactNumber: '+91 98290 12345',
      foodMenu: 'Continental & Indian Fusion Gala Dinner, Dum Biryani, Pasta Station, Live Dessert Bar, Kulfi Falooda',
      vegPlates: 100,
      nonVegPlates: 0,
      childPlates: 15,
      specialDietaryMeals: 6,
      platesOrdered: 115,
      estimatedCostPerPlate: 1600,
      totalBudget: 184000,
      depositPaid: 70000,
    },
  };

  const [cateringPlans, setCateringPlans] = useState<Record<string, CateringPlan>>(() => {
    try {
      const saved = localStorage.getItem('weddingguest_catering_plans_v1');
      return saved ? JSON.parse(saved) : DEFAULT_CATERING_PLANS;
    } catch {
      return DEFAULT_CATERING_PLANS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('weddingguest_catering_plans_v1', JSON.stringify(cateringPlans));
    } catch {}
  }, [cateringPlans]);

  const getCateringPlan = (eventId: string): CateringPlan => {
    const calc = getEventFoodCalculation(eventId);
    if (cateringPlans[eventId]) {
      return cateringPlans[eventId];
    }
    return {
      catererName: 'Maharaja Royal Caterers & Halwai',
      contactNumber: '+91 98290 12345',
      foodMenu: 'Traditional Royal Indian Wedding Banquet',
      vegPlates: calc.confirmedAdults || 25,
      nonVegPlates: 0,
      childPlates: calc.confirmedChildren || 5,
      specialDietaryMeals: 2,
      platesOrdered: calc.recommendedPlates || 30,
      estimatedCostPerPlate: 1200,
      totalBudget: (calc.recommendedPlates || 30) * 1200,
      depositPaid: 10000,
    };
  };

  const updateCateringPlan = (eventId: string, data: Partial<CateringPlan>) => {
    setCateringPlans((prev) => {
      const current = prev[eventId] || getCateringPlan(eventId);
      const updated = { ...current, ...data };
      if (data.platesOrdered !== undefined || data.estimatedCostPerPlate !== undefined) {
        const plates = data.platesOrdered ?? updated.platesOrdered;
        const cost = data.estimatedCostPerPlate ?? updated.estimatedCostPerPlate;
        updated.totalBudget = plates * cost;
      }
      return {
        ...prev,
        [eventId]: updated,
      };
    });
  };

  const DEFAULT_SEATING_TABLES: SeatingTable[] = [
    {
      tableId: 'tbl_vip_stage',
      weddingId: currentWedding.weddingId,
      tableName: 'Table 1: Royal Mandap VIP Stage',
      capacity: 8,
      assignedGuestIds: ['gst_uncle_ramesh', 'gst_aunt_sunita'],
    },
    {
      tableId: 'tbl_bride_family',
      weddingId: currentWedding.weddingId,
      tableName: "Table 2: Bride's Immediate Family - Sharma Court",
      capacity: 10,
      assignedGuestIds: ['gst_rahul_sharma'],
    },
    {
      tableId: 'tbl_groom_family',
      weddingId: currentWedding.weddingId,
      tableName: "Table 3: Groom's Extended Relatives - Malhotra Court",
      capacity: 10,
      assignedGuestIds: ['gst_arjun_mehta', 'gst_sneha_reddy'],
    },
    {
      tableId: 'tbl_friends_lounge',
      weddingId: currentWedding.weddingId,
      tableName: 'Table 4: College & School Friends Lounge',
      capacity: 8,
      assignedGuestIds: ['gst_priya_patel', 'gst_vikram_singhania'],
    },
    {
      tableId: 'tbl_colleagues',
      weddingId: currentWedding.weddingId,
      tableName: 'Table 5: Tech & Corporate Colleagues',
      capacity: 8,
      assignedGuestIds: ['gst_neha_gupta'],
    },
    {
      tableId: 'tbl_kids_cousins',
      weddingId: currentWedding.weddingId,
      tableName: 'Table 6: Young Cousins & Kids Pavilion',
      capacity: 8,
      assignedGuestIds: ['gst_amit_verma'],
    },
  ];

  const DEFAULT_CHECKINS: GuestCheckIn[] = [
    {
      checkInId: 'chk_1',
      guestId: 'gst_uncle_ramesh',
      eventId: 'evt_wedding',
      checkedInAt: '2026-11-08T18:15:00Z',
      attendeesPresent: 5,
    },
    {
      checkInId: 'chk_2',
      guestId: 'gst_aunt_sunita',
      eventId: 'evt_wedding',
      checkedInAt: '2026-11-08T18:30:00Z',
      attendeesPresent: 2,
    },
  ];

  const [seatingTables, setSeatingTables] = useState<SeatingTable[]>(() => {
    try {
      const saved = localStorage.getItem('weddingguest_seating_v1');
      return saved ? JSON.parse(saved) : DEFAULT_SEATING_TABLES;
    } catch {
      return DEFAULT_SEATING_TABLES;
    }
  });

  const [checkIns, setCheckIns] = useState<GuestCheckIn[]>(() => {
    try {
      const saved = localStorage.getItem('weddingguest_checkins_v1');
      return saved ? JSON.parse(saved) : DEFAULT_CHECKINS;
    } catch {
      return DEFAULT_CHECKINS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('weddingguest_seating_v1', JSON.stringify(seatingTables));
    } catch {}
  }, [seatingTables]);

  useEffect(() => {
    try {
      localStorage.setItem('weddingguest_checkins_v1', JSON.stringify(checkIns));
    } catch {}
  }, [checkIns]);

  const addTable = (tableName: string, capacity: number): SeatingTable => {
    const newTable: SeatingTable = {
      tableId: `tbl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      weddingId: currentWedding.weddingId,
      tableName,
      capacity,
      assignedGuestIds: [],
    };
    setSeatingTables((prev) => [...prev, newTable]);
    return newTable;
  };

  const updateTable = (tableId: string, data: Partial<SeatingTable>) => {
    setSeatingTables((prev) =>
      prev.map((t) => (t.tableId === tableId ? { ...t, ...data } : t))
    );
  };

  const deleteTable = (tableId: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.assignedTableId === tableId ? { ...g, assignedTableId: undefined } : g))
    );
    setSeatingTables((prev) => prev.filter((t) => t.tableId !== tableId));
  };

  const assignGuestToTable = (guestId: string, tableId: string | null) => {
    setGuests((prev) =>
      prev.map((g) => (g.guestId === guestId ? { ...g, assignedTableId: tableId || undefined } : g))
    );
    setSeatingTables((prev) =>
      prev.map((t) => {
        const withoutGuest = t.assignedGuestIds.filter((id) => id !== guestId);
        if (t.tableId === tableId) {
          return { ...t, assignedGuestIds: [...withoutGuest, guestId] };
        }
        return { ...t, assignedGuestIds: withoutGuest };
      })
    );
  };

  const checkInGuest = (guestId: string, eventId: string, attendeesPresent: number): GuestCheckIn => {
    const existingIdx = checkIns.findIndex((c) => c.guestId === guestId && c.eventId === eventId);
    const now = new Date().toISOString();
    let record: GuestCheckIn;

    if (existingIdx >= 0) {
      record = {
        ...checkIns[existingIdx],
        attendeesPresent,
        checkedInAt: now,
      };
      setCheckIns((prev) => {
        const next = [...prev];
        next[existingIdx] = record;
        return next;
      });
    } else {
      record = {
        checkInId: `chk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        guestId,
        eventId,
        checkedInAt: now,
        attendeesPresent,
      };
      setCheckIns((prev) => [record, ...prev]);
    }
    return record;
  };

  const undoCheckIn = (guestId: string, eventId: string) => {
    setCheckIns((prev) => prev.filter((c) => !(c.guestId === guestId && c.eventId === eventId)));
  };

  const isGuestCheckedIn = (guestId: string, eventId: string): GuestCheckIn | undefined => {
    return checkIns.find((c) => c.guestId === guestId && c.eventId === eventId);
  };

  // Actions
  const addWedding = (weddingData: Omit<Wedding, 'weddingId' | 'ownerId' | 'createdAt'>): Wedding => {
    const newWedding: Wedding = {
      ...weddingData,
      weddingId: `wed_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ownerId: currentUser?.userId || 'usr_guest',
      createdAt: new Date().toISOString(),
    };
    setWeddings((prev) => [newWedding, ...prev]);
    setCurrentWeddingId(newWedding.weddingId);
    return newWedding;
  };

  const updateWedding = (data: Partial<Wedding>) => {
    setWeddings((prev) =>
      prev.map((w) => (w.weddingId === currentWedding.weddingId ? { ...w, ...data } : w))
    );
  };

  const deleteWedding = (weddingId: string) => {
    setWeddings((prev) => {
      const remaining = prev.filter((w) => w.weddingId !== weddingId);
      return remaining.length > 0 ? remaining : [DEMO_WEDDING];
    });
    if (currentWeddingId === weddingId) {
      const remaining = weddings.filter((w) => w.weddingId !== weddingId);
      setCurrentWeddingId(remaining.length > 0 ? remaining[0].weddingId : DEMO_WEDDING.weddingId);
    }
  };

  const setWeddingTheme = (themeId: WeddingThemeId) => {
    updateWedding({ theme: themeId });
  };

  const addEvent = (eventData: Omit<WeddingEvent, 'eventId' | 'weddingId'> & { weddingId?: string }): WeddingEvent => {
    const generatedId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newEvent: WeddingEvent = {
      ...eventData,
      eventId: generatedId,
      weddingId: eventData.weddingId || currentWedding.weddingId,
    };
    setEvents((prev) => {
      let finalId = newEvent.eventId;
      if (prev.some((e) => e.eventId === finalId)) {
        finalId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      }
      return [...prev, { ...newEvent, eventId: finalId }];
    });
    setSelectedEventId(newEvent.eventId);
    return newEvent;
  };

  const updateEvent = (eventId: string, data: Partial<WeddingEvent>) => {
    setEvents((prev) => prev.map((e) => (e.eventId === eventId ? { ...e, ...data } : e)));
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.eventId !== eventId));
    if (selectedEventId === eventId) {
      const remaining = events.filter((e) => e.eventId !== eventId);
      if (remaining.length > 0) setSelectedEventId(remaining[0].eventId);
    }
  };

  const addGuest = (guestData: Omit<Guest, 'guestId' | 'weddingId' | 'createdAt'>): Guest => {
    const guestId = `gst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newGuest: Guest = {
      ...guestData,
      guestId,
      weddingId: currentWedding.weddingId,
      createdAt: new Date().toISOString(),
    };
    setGuests((prev) => [newGuest, ...prev]);

    // Create unique invitation token
    const uniqueToken = `tok_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36).substring(3)}`;
    const newInvitation: GuestInvitation = {
      invitationId: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      guestId,
      weddingId: currentWedding.weddingId,
      uniqueToken,
      sharingStatus: 'not_shared',
      createdAt: new Date().toISOString(),
    };
    setInvitations((prev) => [...prev, newInvitation]);

    return newGuest;
  };

  const updateGuest = (guestId: string, guestData: Partial<Guest>) => {
    setGuests((prev) => prev.map((g) => (g.guestId === guestId ? { ...g, ...guestData } : g)));
  };

  const deleteGuest = (guestId: string) => {
    setGuests((prev) => prev.filter((g) => g.guestId !== guestId));
    setInvitations((prev) => prev.filter((inv) => inv.guestId !== guestId));
    setRsvps((prev) => prev.filter((r) => r.guestId !== guestId));
  };

  const bulkAddGuests = (newGuests: Omit<Guest, 'guestId' | 'weddingId' | 'createdAt'>[]): number => {
    let addedCount = 0;
    const guestsToAdd: Guest[] = [];
    const invitationsToAdd: GuestInvitation[] = [];

    newGuests.forEach((g) => {
      const guestId = `gst_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      guestsToAdd.push({
        ...g,
        guestId,
        weddingId: currentWedding.weddingId,
        createdAt: new Date().toISOString(),
      });
      invitationsToAdd.push({
        invitationId: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        guestId,
        weddingId: currentWedding.weddingId,
        uniqueToken: `tok_${Math.random().toString(36).substring(2, 8)}_${Math.random().toString(36).substring(2, 6)}`,
        sharingStatus: 'not_shared',
        createdAt: new Date().toISOString(),
      });
      addedCount++;
    });

    setGuests((prev) => [...guestsToAdd, ...prev]);
    setInvitations((prev) => [...invitationsToAdd, ...prev]);
    return addedCount;
  };

  const getGuestInvitation = (guestId: string): GuestInvitation | undefined => {
    return invitations.find((inv) => inv.guestId === guestId);
  };

  const getGuestByToken = (token: string) => {
    const invitation = invitations.find((inv) => inv.uniqueToken === token);
    if (!invitation) return null;
    const guest = guests.find((g) => g.guestId === invitation.guestId);
    if (!guest) return null;
    const wedding = weddings.find((w) => w.weddingId === invitation.weddingId) || currentWedding;
    return { guest, invitation, wedding };
  };

  const updateInvitationStatus = (guestId: string, status: GuestInvitation['sharingStatus']) => {
    setInvitations((prev) =>
      prev.map((inv) => {
        if (inv.guestId === guestId) {
          return {
            ...inv,
            sharingStatus: status,
            lastOpenedAt: status === 'whatsapp_opened' ? new Date().toISOString() : inv.lastOpenedAt,
            markedSentAt: status === 'marked_sent' ? new Date().toISOString() : inv.markedSentAt,
          };
        }
        return inv;
      })
    );
  };

  const toggleInvitationMarkedSent = (guestId: string) => {
    setInvitations((prev) =>
      prev.map((inv) => {
        if (inv.guestId === guestId) {
          if (inv.sharingStatus === 'marked_sent') {
            const revertedStatus = inv.lastOpenedAt ? 'whatsapp_opened' : 'not_shared';
            return {
              ...inv,
              sharingStatus: revertedStatus,
              markedSentAt: undefined,
            };
          } else if (inv.sharingStatus === 'rsvp_received') {
            return inv;
          } else {
            return {
              ...inv,
              sharingStatus: 'marked_sent',
              markedSentAt: new Date().toISOString(),
            };
          }
        }
        return inv;
      })
    );
  };

  const formatPersonalizedWhatsAppMessage = (guest: Guest, customTemplate?: string): string => {
    const invitation = getGuestInvitation(guest.guestId);
    const token = invitation?.uniqueToken || '';
    const rsvpUrl = `${window.location.origin}/?rsvp=${token}`;
    const defaultTemplate = 
`Namaste {guestName}! 🙏

We are overjoyed to invite you and your family to celebrate the wedding ceremonies of {brideName} and {groomName}.

📅 Date: {weddingDate}
⏰ Time: {weddingTime}
📍 Venue: {venue}, {venueAddress}

To help us make perfect arrangements and reduce food wastage, please confirm how many members will be attending using your personal RSVP link:
👉 {rsvpUrl}

We warmly look forward to celebrating with you!

With love & respect,
{brideName} & {groomName}`;

    const template = customTemplate || currentWedding.customWhatsAppMessage || defaultTemplate;

    return template
      .replace(/{guestName}/g, guest.name)
      .replace(/{brideName}/g, currentWedding.brideName)
      .replace(/{groomName}/g, currentWedding.groomName)
      .replace(/{weddingDate}/g, new Date(currentWedding.weddingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }))
      .replace(/{weddingTime}/g, currentWedding.weddingTime)
      .replace(/{venue}/g, currentWedding.venue)
      .replace(/{venueAddress}/g, currentWedding.venueAddress)
      .replace(/{rsvpUrl}/g, rsvpUrl);
  };

  const formatPersonalizedReminderMessage = (guest: Guest, customTemplate?: string): string => {
    const invitation = getGuestInvitation(guest.guestId);
    const token = invitation?.uniqueToken || '';
    const rsvpUrl = `${window.location.origin}/?rsvp=${token}`;
    const defaultReminder = 
`Namaste {guestName}! 🙏

Hope you are doing well. As we finalize catering and seating arrangements for the wedding of {brideName} & {groomName}, we would love to know if you and your family will be joining us.

Please take 30 seconds to confirm your attendance count here:
👉 {rsvpUrl}

Your confirmation helps our family prepare exact food quantities and avoid wastage. Thank you so much!

With warm regards,
{brideName} & {groomName}`;

    const template = customTemplate || currentWedding.customWhatsAppReminder || defaultReminder;

    return template
      .replace(/{guestName}/g, guest.name)
      .replace(/{brideName}/g, currentWedding.brideName)
      .replace(/{groomName}/g, currentWedding.groomName)
      .replace(/{weddingDate}/g, new Date(currentWedding.weddingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }))
      .replace(/{weddingTime}/g, currentWedding.weddingTime)
      .replace(/{venue}/g, currentWedding.venue)
      .replace(/{venueAddress}/g, currentWedding.venueAddress)
      .replace(/{rsvpUrl}/g, rsvpUrl);
  };

  // WhatsApp Link Pre-filler (Follows Meta Click-to-Chat)
  const generateWhatsAppLink = (guest: Guest, customMsgTemplate?: string): string => {
    const message = formatPersonalizedWhatsAppMessage(guest, customMsgTemplate);
    const cleanPhone = `${guest.countryCode || '+91'}${guest.phone}`.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const generateReminderWhatsAppLink = (guest: Guest, customReminderTemplate?: string): string => {
    const message = formatPersonalizedReminderMessage(guest, customReminderTemplate);
    const cleanPhone = `${guest.countryCode || '+91'}${guest.phone}`.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const getGuestRSVP = (guestId: string, targetEventId?: string): EventRSVP | undefined => {
    const eventId = targetEventId || selectedEventId;
    return rsvps.find((r) => r.guestId === guestId && r.eventId === eventId);
  };

  const submitGuestRSVP = (
    guestId: string,
    eventId: string,
    attendanceStatus: 'attending' | 'declined',
    adultCount: number,
    childCount: number,
    extraData?: {
      accompanyingGuests?: string[];
      dietaryRequirements?: string;
      additionalMessage?: string;
    }
  ): EventRSVP => {
    const totalAttendees = attendanceStatus === 'attending' ? Math.max(1, adultCount + childCount) : 0;
    const now = new Date().toISOString();

    const existingIndex = rsvps.findIndex((r) => r.guestId === guestId && r.eventId === eventId);
    let updatedRsvp: EventRSVP;

    if (existingIndex >= 0) {
      updatedRsvp = {
        ...rsvps[existingIndex],
        attendanceStatus,
        adultCount: attendanceStatus === 'attending' ? adultCount : 0,
        childCount: attendanceStatus === 'attending' ? childCount : 0,
        totalAttendees,
        accompanyingGuests: extraData?.accompanyingGuests || rsvps[existingIndex].accompanyingGuests,
        dietaryRequirements: extraData?.dietaryRequirements ?? rsvps[existingIndex].dietaryRequirements,
        additionalMessage: extraData?.additionalMessage ?? rsvps[existingIndex].additionalMessage,
        updatedAt: now,
      };
      setRsvps((prev) => {
        const next = [...prev];
        next[existingIndex] = updatedRsvp;
        return next;
      });
    } else {
      updatedRsvp = {
        rsvpId: `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        guestId,
        eventId,
        weddingId: currentWedding.weddingId,
        attendanceStatus,
        adultCount: attendanceStatus === 'attending' ? adultCount : 0,
        childCount: attendanceStatus === 'attending' ? childCount : 0,
        totalAttendees,
        accompanyingGuests: extraData?.accompanyingGuests || [],
        dietaryRequirements: extraData?.dietaryRequirements || '',
        additionalMessage: extraData?.additionalMessage || '',
        submittedAt: now,
        updatedAt: now,
      };
      setRsvps((prev) => [...prev, updatedRsvp]);
    }

    // Automatically mark invitation status as rsvp_received
    updateInvitationStatus(guestId, 'rsvp_received');

    return updatedRsvp;
  };

  const submitMultiEventRSVP = (
    guestId: string,
    responses: Array<{
      eventId: string;
      attendanceStatus: 'attending' | 'declined';
      adultCount: number;
      childCount: number;
      dietaryRequirements?: string;
      accompanyingGuests?: string[];
      additionalMessage?: string;
    }>
  ) => {
    const now = new Date().toISOString();
    setRsvps((prev) => {
      let next = [...prev];
      responses.forEach((resp) => {
        const totalAttendees = resp.attendanceStatus === 'attending' ? Math.max(1, resp.adultCount + resp.childCount) : 0;
        const existingIdx = next.findIndex((r) => r.guestId === guestId && r.eventId === resp.eventId);
        if (existingIdx >= 0) {
          next[existingIdx] = {
            ...next[existingIdx],
            attendanceStatus: resp.attendanceStatus,
            adultCount: resp.attendanceStatus === 'attending' ? resp.adultCount : 0,
            childCount: resp.attendanceStatus === 'attending' ? resp.childCount : 0,
            totalAttendees,
            accompanyingGuests: resp.accompanyingGuests || next[existingIdx].accompanyingGuests,
            dietaryRequirements: resp.dietaryRequirements ?? next[existingIdx].dietaryRequirements,
            additionalMessage: resp.additionalMessage ?? next[existingIdx].additionalMessage,
            updatedAt: now,
          };
        } else {
          next.push({
            rsvpId: `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            guestId,
            eventId: resp.eventId,
            weddingId: currentWedding.weddingId,
            attendanceStatus: resp.attendanceStatus,
            adultCount: resp.attendanceStatus === 'attending' ? resp.adultCount : 0,
            childCount: resp.attendanceStatus === 'attending' ? resp.childCount : 0,
            totalAttendees,
            accompanyingGuests: resp.accompanyingGuests || [],
            dietaryRequirements: resp.dietaryRequirements || '',
            additionalMessage: resp.additionalMessage || '',
            submittedAt: now,
            updatedAt: now,
          });
        }
      });
      return next;
    });

    updateInvitationStatus(guestId, 'rsvp_received');
  };

  const resetToDemoData = () => {
    setCurrentUser(DEMO_USER);
    setWeddings([DEMO_WEDDING]);
    setCurrentWeddingId(DEMO_WEDDING.weddingId);
    setEvents(DEMO_EVENTS);
    setSelectedEventId(DEMO_EVENTS[2].eventId);
    setGuests(DEMO_GUESTS);
    setInvitations(DEMO_INVITATIONS);
    setRsvps(DEMO_RSVPS);
    setFoodBufferPercentage(5);
    setFoodManualAdjustment(0);
    localStorage.clear();
  };

  return (
    <WeddingContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        weddings,
        currentWedding,
        setCurrentWeddingId,
        events,
        selectedEventId,
        setSelectedEventId,
        guests,
        invitations,
        rsvps,
        foodBufferPercentage,
        setFoodBufferPercentage,
        foodManualAdjustment,
        setFoodManualAdjustment,
        getEventFoodCalculation,
        addWedding,
        updateWedding,
        deleteWedding,
        addEvent,
        updateEvent,
        deleteEvent,
        addGuest,
        updateGuest,
        deleteGuest,
        bulkAddGuests,
        getGuestInvitation,
        getGuestByToken,
        updateInvitationStatus,
        toggleInvitationMarkedSent,
        formatPersonalizedWhatsAppMessage,
        formatPersonalizedReminderMessage,
        generateWhatsAppLink,
        generateReminderWhatsAppLink,
        getGuestRSVP,
        submitGuestRSVP,
        submitMultiEventRSVP,
        cateringPlans,
        getCateringPlan,
        updateCateringPlan,
        seatingTables,
        addTable,
        updateTable,
        deleteTable,
        assignGuestToTable,
        checkIns,
        checkInGuest,
        undoCheckIn,
        isGuestCheckedIn,
        setWeddingTheme,
        resetToDemoData,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
