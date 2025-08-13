import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSchoolStore } from "@/context/school-store";
import { usePageSEO } from "@/lib/seo";

export default function Dashboard() {
  usePageSEO(
    "Dashboard – School Management",
    "Dashboard showing total registered students and total fees.",
    window.location.href
  );
  const { state } = useSchoolStore();
  const totalStudents = state.students.length;
  const totalFees = state.students.reduce((sum, s) => sum + (Number(s.fee) || 0), 0);

  const totalPaid = state.students.filter((s) => s.paid).reduce((sum, s) => sum + s.fee, 0);
  const totalUnpaid = totalFees - totalPaid;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Students</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalStudents}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Fees (Expected)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${totalFees.toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Paid Fees</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${totalPaid.toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Unpaid Fees</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${totalUnpaid.toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
