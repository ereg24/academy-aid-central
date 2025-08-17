import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSchoolStore } from "@/context/school-store";
import { toast } from "sonner";
import { usePageSEO } from "@/lib/seo";

export default function Register() {
  usePageSEO(
    "Register Student – School Management",
    "Register a student with name, age, phone, and fee.",
    window.location.href
  );

  const { addStudent } = useSchoolStore();
  const [form, setForm] = useState({ name: "", age: "", phone: "", fee: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = Number(form.age);
    const fee = Number(form.fee);
    if (!form.name.trim() || isNaN(age) || isNaN(fee) || form.phone.length !== 9) {
      toast.error("Please provide valid name, age, fee, and 9-digit phone number");
      return;
    }
    addStudent({ name: form.name, age, phone: `+252${form.phone}`, fee, paid: false });
    toast.success("Student registered");
    setForm({ name: "", age: "", phone: "", fee: "" });
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Register Student</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm">Student Name</label>
            <Input
              placeholder="e.g. Jane Doe"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm">Age</label>
              <Input
                type="number"
                min={3}
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm">Phone</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 border-input rounded-l-md">
                  +252
                </span>
                <Input
                  placeholder="123456789"
                  value={form.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 9) {
                      setForm((f) => ({ ...f, phone: value }));
                    }
                  }}
                  className="rounded-l-none"
                  maxLength={9}
                  pattern="[0-9]{9}"
                />
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Fee (amount)</label>
            <Input
              type="number"
              min={0}
              value={form.fee}
              onChange={(e) => setForm((f) => ({ ...f, fee: e.target.value }))}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Register</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
