import { createContext, useContext, useEffect, useMemo, useReducer } from "react";


export type Student = {
  id: string;
  name: string;
  age: number;
  phone: string;
  fee: number; // expected fee
  paid: boolean; // has fully paid
};

export type AttendanceRecord = {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  periods: [boolean, boolean, boolean]; // true = present, false = absent
};

type State = {
  students: Student[];
  attendance: AttendanceRecord[];
};

type Action =
  | { type: "ADD_STUDENT"; payload: Omit<Student, "id" | "paid"> & { paid?: boolean } }
  | { type: "SET_PAID"; payload: { studentId: string; paid: boolean } }
  | { type: "UPSERT_ATTENDANCE"; payload: { studentId: string; date: string; periodIndex: 0 | 1 | 2; present: boolean } };

const initialState: State = {
  students: [],
  attendance: [],
};

const STORAGE_KEY = "school-store-v1";

function genId() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  return `id_${Date.now()}_${Math.random().toString(36).slice(2,9)}`;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_STUDENT": {
      const newStudent: Student = {
        id: uuid(),
        name: action.payload.name.trim(),
        age: action.payload.age,
        phone: action.payload.phone.trim(),
        fee: action.payload.fee,
        paid: Boolean(action.payload.paid) || false,
      };
      return { ...state, students: [newStudent, ...state.students] };
    }
    case "SET_PAID": {
      const { studentId, paid } = action.payload;
      return {
        ...state,
        students: state.students.map((s) => (s.id === studentId ? { ...s, paid } : s)),
      };
    }
    case "UPSERT_ATTENDANCE": {
      const { studentId, date, periodIndex, present } = action.payload;
      const existing = state.attendance.find((a) => a.studentId === studentId && a.date === date);
      if (!existing) {
        const periods: [boolean, boolean, boolean] = [false, false, false];
        periods[periodIndex] = present;
        const newRec: AttendanceRecord = { id: uuid(), studentId, date, periods };
        return { ...state, attendance: [newRec, ...state.attendance] };
      }
      const updated = state.attendance.map((a) =>
        a.id === existing.id
          ? { ...a, periods: a.periods.map((v, i) => (i === periodIndex ? present : v)) as [boolean, boolean, boolean] }
          : a
      );
      return { ...state, attendance: updated };
    }
    default:
      return state;
  }
}

const StoreCtx = createContext<{
  state: State;
  addStudent: (data: { name: string; age: number; phone: string; fee: number; paid?: boolean }) => void;
  setPaid: (studentId: string, paid: boolean) => void;
  upsertAttendance: (args: { studentId: string; date: string; periodIndex: 0 | 1 | 2; present: boolean }) => void;
} | null>(null);

export function SchoolStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as State;
    } catch {}
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      addStudent: (data: { name: string; age: number; phone: string; fee: number; paid?: boolean }) =>
        dispatch({ type: "ADD_STUDENT", payload: data }),
      setPaid: (studentId: string, paid: boolean) => dispatch({ type: "SET_PAID", payload: { studentId, paid } }),
      upsertAttendance: (args: { studentId: string; date: string; periodIndex: 0 | 1 | 2; present: boolean }) =>
        dispatch({ type: "UPSERT_ATTENDANCE", payload: args }),
    }),
    [state]
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useSchoolStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useSchoolStore must be used within SchoolStoreProvider");
  return ctx;
}

export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}
