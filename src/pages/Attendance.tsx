import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useSchoolStore, formatDate } from "@/context/school-store";
import { usePageSEO } from "@/lib/seo";

export default function Attendance() {
  usePageSEO(
    "Attendance – School Management",
    "Mark attendance for 3 periods per day.",
    window.location.href
  );

  const { state, upsertAttendance } = useSchoolStore();
  const [date, setDate] = useState(formatDate(new Date()));

  const attendanceByStudent = useMemo(() => {
    const map = new Map<string, [boolean, boolean, boolean]>();
    state.students.forEach((s) => map.set(s.id, [false, false, false]));
    state.attendance
      .filter((a) => a.date === date)
      .forEach((a) => map.set(a.studentId, a.periods));
    return map;
  }, [state.students, state.attendance, date]);

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="text-sm">Select date</label>
            <input
              className="rounded-md border bg-background px-3 py-2 text-sm"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Period 1</TableHead>
                  <TableHead>Period 2</TableHead>
                  <TableHead>Period 3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                      No students registered yet.
                    </TableCell>
                  </TableRow>
                )}
                {state.students.map((s) => {
                  const periods = attendanceByStudent.get(s.id) || [false, false, false];
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      {[0, 1, 2].map((pi) => (
                        <TableCell key={pi}>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={periods[pi as 0 | 1 | 2]}
                              onCheckedChange={(v) =>
                                upsertAttendance({
                                  studentId: s.id,
                                  date,
                                  periodIndex: pi as 0 | 1 | 2,
                                  present: v,
                                })
                              }
                            />
                            <span className="text-sm text-muted-foreground">{periods[pi as 0 | 1 | 2] ? "Present" : "Absent"}</span>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
