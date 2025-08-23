-- School Management System Database Schema

-- Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age < 100),
    phone VARCHAR(20) NOT NULL,
    fee DECIMAL(10,2) NOT NULL CHECK (fee >= 0),
    paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance records table
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    period_1 BOOLEAN DEFAULT FALSE, -- Period 1 attendance
    period_2 BOOLEAN DEFAULT FALSE, -- Period 2 attendance  
    period_3 BOOLEAN DEFAULT FALSE, -- Period 3 attendance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, date) -- One record per student per day
);

-- Fee payments table (for tracking payment history)
CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    paid BOOLEAN NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_students_name ON students(name);
CREATE INDEX idx_students_paid ON students(paid);
CREATE INDEX idx_attendance_student_date ON attendance_records(student_id, date);
CREATE INDEX idx_attendance_date ON attendance_records(date);
CREATE INDEX idx_fee_payments_student ON fee_payments(student_id);
CREATE INDEX idx_fee_payments_date ON fee_payments(payment_date);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at 
    BEFORE UPDATE ON attendance_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries
CREATE VIEW student_summary AS
SELECT 
    s.id,
    s.name,
    s.age,
    s.phone,
    s.fee,
    s.paid,
    COUNT(ar.id) as total_attendance_records,
    COALESCE(SUM(
        CASE WHEN ar.period_1 THEN 1 ELSE 0 END +
        CASE WHEN ar.period_2 THEN 1 ELSE 0 END +
        CASE WHEN ar.period_3 THEN 1 ELSE 0 END
    ), 0) as total_periods_present,
    COALESCE(SUM(
        CASE WHEN NOT ar.period_1 THEN 1 ELSE 0 END +
        CASE WHEN NOT ar.period_2 THEN 1 ELSE 0 END +
        CASE WHEN NOT ar.period_3 THEN 1 ELSE 0 END
    ), 0) as total_periods_absent,
    CASE 
        WHEN COUNT(ar.id) > 0 THEN 
            ROUND(
                (COALESCE(SUM(
                    CASE WHEN NOT ar.period_1 THEN 1 ELSE 0 END +
                    CASE WHEN NOT ar.period_2 THEN 1 ELSE 0 END +
                    CASE WHEN NOT ar.period_3 THEN 1 ELSE 0 END
                ), 0) * 100.0) / 
                (COUNT(ar.id) * 3)
            , 2)
        ELSE 0 
    END as absence_percentage
FROM students s
LEFT JOIN attendance_records ar ON s.id = ar.student_id
GROUP BY s.id, s.name, s.age, s.phone, s.fee, s.paid;

-- View for financial summary
CREATE VIEW financial_summary AS
SELECT 
    COUNT(*) as total_students,
    COUNT(CASE WHEN paid THEN 1 END) as paid_students,
    COUNT(CASE WHEN NOT paid THEN 1 END) as unpaid_students,
    SUM(fee) as total_fees,
    SUM(CASE WHEN paid THEN fee ELSE 0 END) as total_paid,
    SUM(CASE WHEN NOT paid THEN fee ELSE 0 END) as total_unpaid
FROM students;