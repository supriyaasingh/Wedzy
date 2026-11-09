import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import {
  Wedding,
  WeddingEvent,
  Guest,
  GuestInvitation,
  EventRSVP,
  InvitationTokenRecord,
  InvitationSharingStatus,
} from '../types/wedding';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ==========================================
// WEDDINGS & CEREMONIES
// ==========================================

export async function syncWeddingToFirestore(wedding: Wedding): Promise<void> {
  const path = `weddings/${wedding.weddingId}`;
  try {
    await setDoc(doc(db, 'weddings', wedding.weddingId), wedding, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getWeddingFromFirestore(weddingId: string): Promise<Wedding | null> {
  const path = `weddings/${weddingId}`;
  try {
    const snap = await getDoc(doc(db, 'weddings', weddingId));
    return snap.exists() ? (snap.data() as Wedding) : null;
  } catch (error) {
    console.warn(`[Firestore] Failed to get wedding ${weddingId}:`, error);
    return null;
  }
}

export async function syncEventToFirestore(event: WeddingEvent): Promise<void> {
  const path = `weddings/${event.weddingId}/events/${event.eventId}`;
  try {
    await setDoc(doc(db, 'weddings', event.weddingId, 'events', event.eventId), event, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getEventsFromFirestore(weddingId: string): Promise<WeddingEvent[]> {
  const path = `weddings/${weddingId}/events`;
  try {
    const snap = await getDocs(collection(db, 'weddings', weddingId, 'events'));
    return snap.docs.map((d) => d.data() as WeddingEvent);
  } catch (error) {
    console.warn(`[Firestore] Failed to get events for wedding ${weddingId}:`, error);
    return [];
  }
}

export async function deleteEventFromFirestore(weddingId: string, eventId: string): Promise<void> {
  const path = `weddings/${weddingId}/events/${eventId}`;
  try {
    await deleteDoc(doc(db, 'weddings', weddingId, 'events', eventId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ==========================================
// GUESTS & INVITATIONS
// ==========================================

export async function syncGuestToFirestore(weddingId: string, guest: Guest): Promise<void> {
  const path = `weddings/${weddingId}/guests/${guest.guestId}`;
  try {
    await setDoc(doc(db, 'weddings', weddingId, 'guests', guest.guestId), guest, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getGuestFromFirestore(weddingId: string, guestId: string): Promise<Guest | null> {
  const path = `weddings/${weddingId}/guests/${guestId}`;
  try {
    const snap = await getDoc(doc(db, 'weddings', weddingId, 'guests', guestId));
    return snap.exists() ? (snap.data() as Guest) : null;
  } catch (error) {
    console.warn(`[Firestore] Failed to get guest ${guestId}:`, error);
    return null;
  }
}

export async function deleteGuestFromFirestore(weddingId: string, guestId: string): Promise<void> {
  const path = `weddings/${weddingId}/guests/${guestId}`;
  try {
    await deleteDoc(doc(db, 'weddings', weddingId, 'guests', guestId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncInvitationToFirestore(weddingId: string, invitation: GuestInvitation): Promise<void> {
  const path = `weddings/${weddingId}/invitations/${invitation.invitationId}`;
  try {
    await setDoc(doc(db, 'weddings', weddingId, 'invitations', invitation.invitationId), invitation, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateInvitationStatusInFirestore(
  weddingId: string,
  invitationId: string,
  status: InvitationSharingStatus,
  extra?: Partial<GuestInvitation>
): Promise<void> {
  const path = `weddings/${weddingId}/invitations/${invitationId}`;
  try {
    await updateDoc(doc(db, 'weddings', weddingId, 'invitations', invitationId), {
      sharingStatus: status,
      ...(extra || {}),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn(`[Firestore] Failed to update invitation status ${invitationId}:`, error);
  }
}

// ==========================================
// TOKEN INDEX & PUBLIC RESOLUTION
// ==========================================

/**
 * Saves a fast token lookup document at /invitation_tokens/{token}.
 * Allows zero-friction public access to personalized invitation details
 * without exposing the private guest list.
 */
export async function syncInvitationTokenRecord(record: InvitationTokenRecord): Promise<void> {
  const path = `invitation_tokens/${record.token}`;
  try {
    await setDoc(doc(db, 'invitation_tokens', record.token), record, { merge: true });
  } catch (error) {
    console.warn(`[Firestore] Failed to sync token record ${record.token}:`, error);
  }
}

/**
 * Resolves an invitation token from /invitation_tokens/{token}.
 * Returns token record, or null if not found.
 */
export async function getInvitationTokenRecord(token: string): Promise<InvitationTokenRecord | null> {
  const path = `invitation_tokens/${token}`;
  try {
    const snap = await getDoc(doc(db, 'invitation_tokens', token));
    if (snap.exists()) {
      return snap.data() as InvitationTokenRecord;
    }
    return null;
  } catch (error) {
    console.warn(`[Firestore] Error fetching token record ${token}:`, error);
    return null;
  }
}

// ==========================================
// RSVPS & REAL-TIME DASHBOARD LISTENERS
// ==========================================

/**
 * Syncs RSVP to Firestore (Public guest submissions allowed).
 */
export async function syncRsvpToFirestore(rsvp: EventRSVP): Promise<void> {
  const path = `weddings/${rsvp.weddingId}/rsvps/${rsvp.rsvpId}`;
  try {
    await setDoc(doc(db, 'weddings', rsvp.weddingId, 'rsvps', rsvp.rsvpId), rsvp, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Real-time listener for wedding RSVPs.
 * Automatically updates host dashboard immediately when any guest submits an RSVP.
 */
export function listenToWeddingRsvps(
  weddingId: string,
  onUpdate: (rsvps: EventRSVP[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `weddings/${weddingId}/rsvps`;
  try {
    return onSnapshot(
      collection(db, 'weddings', weddingId, 'rsvps'),
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => docSnap.data() as EventRSVP);
        onUpdate(list);
      },
      (error) => {
        console.warn(`[Firestore] Error listening to RSVPs at ${path}:`, error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.warn(`[Firestore] Failed to attach RSVP listener:`, error);
    return () => {};
  }
}

/**
 * Real-time listener for wedding guests.
 */
export function listenToWeddingGuests(
  weddingId: string,
  onUpdate: (guests: Guest[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    return onSnapshot(
      collection(db, 'weddings', weddingId, 'guests'),
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => docSnap.data() as Guest);
        onUpdate(list);
      },
      (error) => {
        console.warn(`[Firestore] Error listening to guests:`, error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    return () => {};
  }
}
