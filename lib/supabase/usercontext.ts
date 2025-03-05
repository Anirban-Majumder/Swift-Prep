import React from 'react';
import { Session } from '@supabase/supabase-js';
import { Profile } from '../db_types';

export interface SessionData {
  session: Session | null;
  profile: Profile | null;
}

export interface SessionContextType {
  sessionData: SessionData;
  setSessionData: React.Dispatch<React.SetStateAction<SessionData>>;
}

export const SessionContext = React.createContext<SessionContextType>({
  sessionData: { session: null, profile: null },
  setSessionData: () => {},
});