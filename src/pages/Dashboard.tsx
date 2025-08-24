import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSchoolStore } from "@/context/school-store";
import { useAuth } from "@/context/auth-context";
import { usePageSEO } from "@/lib/seo";
import { Link } from "react-router-dom";
import { Users, DollarSign, CheckCircle, AlertCircle, UserPlus, FileText, Calendar, GraduationCap, TrendingUp } from "lucide-react";

export default function Dashboard() {
  usePageSEO(
    "Dashboard – School Management",
    "Overview of your school management system",
    window.location.href
  );
  const { state } = useSchoolStore();
  const { user } = useAuth();
  const totalStudents = state.students.length;
  const totalFees = state.students.reduce((sum, s) => sum + (Number(s.fee) || 0), 0);
  const totalPaid = state.students.filter((s) => s.paid).reduce((sum, s) => sum + s.fee, 0);
  const totalUnpaid = totalFees - totalPaid;
  
  const recentStudents = state.students.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl gradient-hero p-8 text-white shadow-elegant">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.full_name}!</h1>
              <p className="text-white/80">
                {user?.role === 'admin' ? 'Full system access' : 'Attendance management dashboard'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <TrendingUp className="w-5 h-5" />
            <span>Your school management overview</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 shadow-elegant hover:shadow-glow transition-all duration-300 border-0 bg-card/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold text-foreground">{totalStudents}</p>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </div>
            <div className="flex items-center justify-center w-14 h-14 gradient-primary rounded-xl shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        {user?.role === 'admin' && (
          <>
            <Card className="p-6 shadow-elegant hover:shadow-glow transition-all duration-300 border-0 bg-card/60 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Fees</p>
                  <p className="text-3xl font-bold text-foreground">${totalFees}</p>
                  <p className="text-xs text-muted-foreground">All student fees</p>
                </div>
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-elegant hover:shadow-glow transition-all duration-300 border-0 bg-card/60 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Paid Fees</p>
                  <p className="text-3xl font-bold text-foreground">${totalPaid}</p>
                  <p className="text-xs text-muted-foreground">Successfully collected</p>
                </div>
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-elegant hover:shadow-glow transition-all duration-300 border-0 bg-card/60 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unpaid Fees</p>
                  <p className="text-3xl font-bold text-foreground">${totalUnpaid}</p>
                  <p className="text-xs text-muted-foreground">Pending collection</p>
                </div>
                <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Recent Students and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Students */}
        <Card className="p-6 shadow-elegant border-0 bg-card/60 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <div className="w-2 h-2 gradient-primary rounded-full"></div>
            Recent Students
          </h2>
          <div className="space-y-4">
            {recentStudents.length > 0 ? (
              recentStudents.map((student, index) => (
                <div key={student.id} className={`flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 animate-slide-up`} style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 gradient-primary rounded-xl">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Age: {student.age}</p>
                    </div>
                  </div>
                  {user?.role === 'admin' && (
                    <div className="text-right">
                      <p className="font-semibold text-lg">${student.fee}</p>
                      <p className={`text-xs px-2 py-1 rounded-full ${student.paid ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'}`}>
                        {student.paid ? 'Paid' : 'Pending'}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="flex items-center justify-center w-16 h-16 gradient-secondary rounded-2xl mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No students registered yet</p>
                {user?.role === 'admin' && (
                  <Link to="/register">
                    <Button className="mt-3" size="sm">
                      Add First Student
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 shadow-elegant border-0 bg-card/60 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <div className="w-2 h-2 gradient-primary rounded-full"></div>
            Quick Actions
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {user?.role === 'admin' && (
              <Link to="/register">
                <Button className="w-full justify-start gap-4 h-14 hover:shadow-lg transition-all duration-300" variant="outline">
                  <div className="flex items-center justify-center w-10 h-10 gradient-primary rounded-xl">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">Add Student</span>
                </Button>
              </Link>
            )}
            
            <Link to="/attendance">
              <Button className="w-full justify-start gap-4 h-14 hover:shadow-lg transition-all duration-300" variant="outline">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">Take Attendance</span>
              </Button>
            </Link>
            
            {user?.role === 'admin' && (
              <>
                <Link to="/reports">
                  <Button className="w-full justify-start gap-4 h-14 hover:shadow-lg transition-all duration-300" variant="outline">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">View Reports</span>
                  </Button>
                </Link>
                
                <Link to="/payments">
                  <Button className="w-full justify-start gap-4 h-14 hover:shadow-lg transition-all duration-300" variant="outline">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">Fee Management</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
