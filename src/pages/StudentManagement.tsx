import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSchoolStore } from "@/context/school-store";
import { usePageSEO } from "@/lib/seo";
import { Edit, Trash2, User, Phone, DollarSign, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StudentManagement() {
  usePageSEO(
    "Student Management – School Management",
    "Update and delete student information",
    window.location.href
  );

  const { state, updateStudent, deleteStudent } = useSchoolStore();
  const { toast } = useToast();
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    age: "",
    phone: "",
    fee: "",
  });

  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name,
      age: student.age.toString(),
      phone: student.phone,
      fee: student.fee.toString(),
    });
  };

  const handleUpdateStudent = () => {
    if (!editingStudent) return;
    
    updateStudent({
      ...editingStudent,
      name: editForm.name,
      age: parseInt(editForm.age),
      phone: editForm.phone,
      fee: parseFloat(editForm.fee),
    });
    
    setEditingStudent(null);
    toast({
      title: "Success",
      description: "Student information updated successfully",
    });
  };

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    deleteStudent(studentId);
    toast({
      title: "Success",
      description: `${studentName} has been removed from the system`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
        <p className="text-muted-foreground">Update or delete student information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">STUDENT</TableHead>
                  <TableHead className="text-muted-foreground">CONTACT</TableHead>
                  <TableHead className="text-muted-foreground">FEE</TableHead>
                  <TableHead className="text-muted-foreground">STATUS</TableHead>
                  <TableHead className="text-muted-foreground">ACTIONS</TableHead>
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
                {state.students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{student.name}</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            Age: {student.age}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        {student.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        ${student.fee}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${
                        student.paid ? 'text-success' : 'text-warning'
                      }`}>
                        {student.paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Student</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  value={editForm.name}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                  id="age"
                                  type="number"
                                  value={editForm.age}
                                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                  id="phone"
                                  value={editForm.phone}
                                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="fee">Fee</Label>
                                <Input
                                  id="fee"
                                  type="number"
                                  step="0.01"
                                  value={editForm.fee}
                                  onChange={(e) => setEditForm({ ...editForm, fee: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setEditingStudent(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateStudent}>
                                Update Student
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 text-warning" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Student</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {student.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteStudent(student.id, student.name)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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