import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useSchoolStore } from "@/context/school-store";
import { usePageSEO } from "@/lib/seo";
import { googleSheetsService } from "@/services/googleSheets";
import { DollarSign, User, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Payments() {
  usePageSEO(
    "Payments – School Management",
    "Manage student fee payments",
    window.location.href
  );

  const { state, setPaid } = useSchoolStore();
  const { toast } = useToast();

  const paymentStats = useMemo(() => {
    const paidStudents = state.students.filter((s) => s.paid);
    const unpaidStudents = state.students.filter((s) => !s.paid);
    const totalPaid = paidStudents.reduce((sum, s) => sum + s.fee, 0);
    const totalUnpaid = unpaidStudents.reduce((sum, s) => sum + s.fee, 0);
    
    return {
      paidCount: paidStudents.length,
      unpaidCount: unpaidStudents.length,
      totalPaid,
      totalUnpaid,
    };
  }, [state.students]);

  const handlePaymentToggle = async (studentId: string, studentName: string, fee: number, newPaidStatus: boolean) => {
    setPaid(studentId, newPaidStatus);
    
    await googleSheetsService.sendFeePayment({
      studentId,
      studentName,
      amount: fee,
      fee: fee,
      paid: newPaidStatus,
      date: new Date().toISOString().split('T')[0],
    });
    
    toast({
      title: "Success",
      description: `${studentName} marked as ${newPaidStatus ? 'paid' : 'unpaid'}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payment Management</h1>
        <p className="text-muted-foreground">Toggle payment status for students</p>
      </div>

      {/* Payment Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CreditCard className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Students</p>
                <p className="text-2xl font-bold text-foreground">{paymentStats.paidCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <User className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unpaid Students</p>
                <p className="text-2xl font-bold text-foreground">{paymentStats.unpaidCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-success">${paymentStats.totalPaid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <DollarSign className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Unpaid</p>
                <p className="text-2xl font-bold text-warning">${paymentStats.totalUnpaid}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Payment List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">STUDENT</TableHead>
                  <TableHead className="text-muted-foreground">FEE AMOUNT</TableHead>
                  <TableHead className="text-muted-foreground">STATUS</TableHead>
                  <TableHead className="text-muted-foreground">TOGGLE PAYMENT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                      No students registered yet.
                    </TableCell>
                  </TableRow>
                )}
                {state.students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{student.name}</div>
                          <div className="text-sm text-muted-foreground">Age: {student.age}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-lg font-semibold">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        {student.fee}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.paid 
                          ? 'bg-success/10 text-success' 
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {student.paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={student.paid}
                          onCheckedChange={(checked) => 
                            handlePaymentToggle(student.id, student.name, student.fee, checked)
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          {student.paid ? 'Mark Unpaid' : 'Mark Paid'}
                        </span>
                      </div>
                    </TableCell>
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