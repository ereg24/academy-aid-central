import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSchoolStore, formatDate } from "@/context/school-store";
import { usePageSEO } from "@/lib/seo";
import { googleSheetsService } from "@/services/googleSheets";
import { Check, X, Clock, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Attendance() {
  usePageSEO(
    "Attendance – School Management",
    "Mark attendance for 3 periods per day.",
    window.location.href
  );

  const { state, upsertAttendance } = useSchoolStore();
  const [date, setDate] = useState(formatDate(new Date()));
  const { toast } = useToast();

  const attendanceByStudent = useMemo(() => {
    const map = new Map<string, [boolean, boolean, boolean]>();
    state.students.forEach((s) => map.set(s.id, [false, false, false]));
    state.attendance
      .filter((a) => a.date === date)
      .forEach((a) => map.set(a.studentId, a.periods));
    return map;
  }, [state.students, state.attendance, date]);

  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    
    state.students.forEach((student) => {
      const periods = attendanceByStudent.get(student.id) || [false, false, false];
      const attendedPeriods = periods.filter(Boolean).length;
      if (attendedPeriods > 0) present++;
      if (attendedPeriods < 3) absent++;
    });
    
    const total = state.students.length;
    const attendancePercentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { present, absent, attendancePercentage };
  }, [state.students, attendanceByStudent]);

  const handleMarkAllPresent = async () => {
    for (const student of state.students) {
      for (let periodIndex = 0; periodIndex < 3; periodIndex++) {
        upsertAttendance({
          studentId: student.id,
          date,
          periodIndex: periodIndex as 0 | 1 | 2,
          present: true,
        });
      }
      
      await googleSheetsService.sendAttendanceUpdate({
        studentId: student.id,
        studentName: student.name,
        date,
        period1: true,
        period2: true,
        period3: true,
      });
    }
    
    toast({
      title: "Success",
      description: "All students marked present for all periods",
    });
  };

  const handleSaveAttendance = () => {
    toast({
      title: "Success",
      description: "Attendance saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Attendance Management</h1>
        <p className="text-muted-foreground">Mark attendance for 3 daily periods</p>
      </div>

      {/* Date Selector and Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-sm font-medium">Select Date</label>
                <input
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Check className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-2xl font-bold text-foreground">{stats.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <X className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold text-foreground">{stats.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="text-2xl font-bold text-info">{stats.attendancePercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Attendance Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daily Attendance</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleMarkAllPresent} className="bg-success hover:bg-success/90">
              Mark All Present
            </Button>
            <Button onClick={handleSaveAttendance} className="bg-info hover:bg-info/90">
              Save Attendance
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">STUDENT</TableHead>
                  <TableHead className="text-muted-foreground">PERIOD 1</TableHead>
                  <TableHead className="text-muted-foreground">PERIOD 2</TableHead>
                  <TableHead className="text-muted-foreground">PERIOD 3</TableHead>
                  <TableHead className="text-muted-foreground">STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                      No students registered yet.
                    </TableCell>
                  </TableRow>
                )}
                {state.students.map((s) => {
                  const periods = attendanceByStudent.get(s.id) || [false, false, false];
                  const attendedPeriods = periods.filter(Boolean).length;
                  const isPresent = attendedPeriods > 0;
                  
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{s.name}</div>
                            <div className="text-sm text-muted-foreground">Age: {s.age}</div>
                          </div>
                        </div>
                      </TableCell>
                      {[0, 1, 2].map((pi) => (
                        <TableCell key={pi}>
                          <button
                            onClick={async () => {
                              const newValue = !periods[pi as 0 | 1 | 2];
                              upsertAttendance({
                                studentId: s.id,
                                date,
                                periodIndex: pi as 0 | 1 | 2,
                                present: newValue,
                              });

                              const updatedPeriods = [...periods];
                              updatedPeriods[pi] = newValue;
                              await googleSheetsService.sendAttendanceUpdate({
                                studentId: s.id,
                                studentName: s.name,
                                date,
                                period1: updatedPeriods[0],
                                period2: updatedPeriods[1],
                                period3: updatedPeriods[2],
                              });
                            }}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                              periods[pi as 0 | 1 | 2] 
                                ? 'bg-success/10 hover:bg-success/20' 
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                          >
                            {periods[pi as 0 | 1 | 2] ? (
                              <Check className="h-4 w-4 text-success" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </TableCell>
                      ))}
                      <TableCell>
                        <span className={`text-sm font-medium ${
                          isPresent ? 'text-success' : 'text-warning'
                        }`}>
                          {isPresent ? 'Present' : 'Absent'}
                        </span>
                      </TableCell>
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
