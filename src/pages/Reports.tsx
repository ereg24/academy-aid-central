import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSchoolStore } from "@/context/school-store";
import { useMemo } from "react";
import { usePageSEO } from "@/lib/seo";
import { googleSheetsService } from "@/services/googleSheets";

export default function Reports() {
  usePageSEO(
    "Reports – School Management",
    "Financial and attendance reports: paid vs unpaid and absence %.",
    window.location.href
  );

  const { state, setPaid } = useSchoolStore();

  const { paidStudents, unpaidStudents, totalPaid, totalUnpaid, attendanceSummary } = useMemo(() => {
    const paidStudents = state.students.filter((s) => s.paid);
    const unpaidStudents = state.students.filter((s) => !s.paid);
    const totalPaid = paidStudents.reduce((sum, s) => sum + s.fee, 0);
    const totalFees = state.students.reduce((sum, s) => sum + s.fee, 0);
    const totalUnpaid = totalFees - totalPaid;

    // Attendance summary: per student absent percentage across all records
    const perStudent = state.students.map((s) => {
      const recs = state.attendance.filter((a) => a.studentId === s.id);
      const totalPeriods = recs.length * 3;
      const absent = recs.reduce((acc, r) => acc + r.periods.filter((p) => !p).length, 0);
      const present = recs.reduce((acc, r) => acc + r.periods.filter((p) => p).length, 0);
      const percentAbsent = totalPeriods === 0 ? 0 : Math.round((absent / (absent + present)) * 100);
      return { id: s.id, name: s.name, percentAbsent, totalPeriods: absent + present };
    });

    return { paidStudents, unpaidStudents, totalPaid, totalUnpaid, attendanceSummary: perStudent };
  }, [state.students, state.attendance]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Paid Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalPaid.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Unpaid Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalUnpaid.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paid Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paidStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                      No paid students yet.
                    </TableCell>
                  </TableRow>
                )}
                {paidStudents.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>${s.fee.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                        Paid
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unpaid Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unpaidStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                      All students are marked as paid.
                    </TableCell>
                  </TableRow>
                )}
                {unpaidStudents.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>${s.fee.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                        Unpaid
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance – Absent Percentage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Total Periods</TableHead>
                  <TableHead>Absent %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceSummary.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.totalPeriods}</TableCell>
                    <TableCell>{r.percentAbsent}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
