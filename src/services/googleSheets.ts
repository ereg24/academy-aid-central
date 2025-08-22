const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzUCQRuApzosyUcTVkUd71iAjhl_SRkWVgx4gZp48-f8tvmPEKvwa8JUeQbQzluycRa/exec";

export interface StudentData {
  id: string;
  name: string;
  age: number;
  phone: string;
  fee: number;
  paid: boolean;
}

export interface AttendanceData {
  studentId: string;
  studentName: string;
  date: string;
  period1: boolean;
  period2: boolean;
  period3: boolean;
}

export interface FeePaymentData {
  studentId: string;
  studentName: string;
  amount: number;
  fee: number;
  paid: boolean;
  date: string;
}

export const googleSheetsService = {
  async sendStudentRegistration(student: StudentData): Promise<void> {
    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          action: "REGISTER_STUDENT",
          data: {
            id: student.id,
            name: student.name,
            age: student.age,
            phone: student.phone,
            fee: student.fee,
            paid: student.paid,
            registrationDate: new Date().toISOString(),
          },
        }),
      });
      console.log("Student registration sent to Google Sheets");
    } catch (error) {
      console.error("Failed to send student registration to Google Sheets:", error);
    }
  },

  async sendAttendanceUpdate(attendance: AttendanceData): Promise<void> {
    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          action: "UPDATE_ATTENDANCE",
          data: {
            studentId: attendance.studentId,
            studentName: attendance.studentName,
            date: attendance.date,
            period1: attendance.period1,
            period2: attendance.period2,
            period3: attendance.period3,
            timestamp: new Date().toISOString(),
          },
        }),
      });
      console.log("Attendance update sent to Google Sheets");
    } catch (error) {
      console.error("Failed to send attendance to Google Sheets:", error);
    }
  },

  async sendFeePayment(payment: FeePaymentData): Promise<void> {
    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          action: "UPDATE_FEE_PAYMENT",
          data: {
            studentId: payment.studentId,
            studentName: payment.studentName,
            amount: payment.amount,
            fee: payment.fee,
            paid: payment.paid,
            paymentDate: payment.date,
            timestamp: new Date().toISOString(),
          },
        }),
      });
      console.log("Fee payment update sent to Google Sheets");
    } catch (error) {
      console.error("Failed to send fee payment to Google Sheets:", error);
    }
  },
};