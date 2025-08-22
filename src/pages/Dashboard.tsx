import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSchoolStore } from "@/context/school-store";
import { usePageSEO } from "@/lib/seo";
import { Link } from "react-router-dom";
import { Users, DollarSign, CheckCircle, AlertCircle, UserPlus, FileText, Calendar } from "lucide-react";

export default function Dashboard() {
  usePageSEO(
    "Dashboard – School Management",
    "Overview of your school management system",
    window.location.href
  );
  const { state } = useSchoolStore();
  const totalStudents = state.students.length;
  const totalFees = state.students.reduce((sum, s) => sum + (Number(s.fee) || 0), 0);
  const totalPaid = state.students.filter((s) => s.paid).reduce((sum, s) => sum + s.fee, 0);
  const totalUnpaid = totalFees - totalPaid;
  
  const recentStudents = state.students.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your school management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">{totalStudents}</p>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Fees</p>
              <p className="text-2xl font-bold">${totalFees}</p>
              <p className="text-xs text-muted-foreground">All student fees</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Paid Fees</p>
              <p className="text-2xl font-bold">${totalPaid}</p>
              <p className="text-xs text-muted-foreground">Successfully collected</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Unpaid Fees</p>
              <p className="text-2xl font-bold">${totalUnpaid}</p>
              <p className="text-xs text-muted-foreground">Pending collection</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Students and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Students */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Students</h2>
          <div className="space-y-4">
            {recentStudents.length > 0 ? (
              recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Age: {student.age}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${student.fee}</p>
                    <p className="text-xs text-green-600">Paid</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No students registered yet</p>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-3 grid-cols-2">
            <Link to="/register">
              <Button className="w-full justify-start gap-2 h-12" variant="outline">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                Add Student
              </Button>
            </Link>
            
            <Link to="/attendance">
              <Button className="w-full justify-start gap-2 h-12" variant="outline">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                Take Attendance
              </Button>
            </Link>
            
            <Link to="/reports">
              <Button className="w-full justify-start gap-2 h-12" variant="outline">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                View Reports
              </Button>
            </Link>
            
            <Link to="/reports">
              <Button className="w-full justify-start gap-2 h-12" variant="outline">
                <div className="flex items-center justify-center w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <DollarSign className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                Fee Management
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
