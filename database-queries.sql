-- Common SQL Queries for School Management System

-- 1. Insert a new student
INSERT INTO students (name, age, phone, fee, paid) 
VALUES ('John Doe', 16, '+1234567890', 500.00, FALSE);

-- 2. Update student payment status
UPDATE students 
SET paid = TRUE, updated_at = NOW() 
WHERE id = 'student-uuid-here';

-- 3. Record attendance for a student on a specific date
INSERT INTO attendance_records (student_id, date, period_1, period_2, period_3)
VALUES ('student-uuid-here', '2024-01-15', TRUE, TRUE, FALSE)
ON CONFLICT (student_id, date) 
DO UPDATE SET 
    period_1 = EXCLUDED.period_1,
    period_2 = EXCLUDED.period_2, 
    period_3 = EXCLUDED.period_3,
    updated_at = NOW();

-- 4. Get all students with their attendance summary
SELECT * FROM student_summary
ORDER BY name;

-- 5. Get students with poor attendance (less than 80%)
SELECT * FROM student_summary
WHERE absence_percentage > 20
ORDER BY absence_percentage DESC;

-- 6. Get unpaid students
SELECT id, name, phone, fee, (fee) as amount_due
FROM students 
WHERE paid = FALSE
ORDER BY fee DESC;

-- 7. Get paid students
SELECT id, name, phone, fee
FROM students 
WHERE paid = TRUE
ORDER BY name;

-- 8. Get financial summary
SELECT * FROM financial_summary;

-- 9. Get attendance for a specific date
SELECT 
    s.name,
    s.phone,
    ar.period_1,
    ar.period_2,
    ar.period_3,
    (CASE WHEN ar.period_1 THEN 1 ELSE 0 END +
     CASE WHEN ar.period_2 THEN 1 ELSE 0 END +
     CASE WHEN ar.period_3 THEN 1 ELSE 0 END) as periods_present
FROM students s
LEFT JOIN attendance_records ar ON s.id = ar.student_id AND ar.date = '2024-01-15'
ORDER BY s.name;

-- 10. Get attendance statistics for a date range
SELECT 
    DATE(ar.date) as attendance_date,
    COUNT(DISTINCT ar.student_id) as total_students,
    SUM(CASE WHEN ar.period_1 THEN 1 ELSE 0 END) as period_1_present,
    SUM(CASE WHEN ar.period_2 THEN 1 ELSE 0 END) as period_2_present,
    SUM(CASE WHEN ar.period_3 THEN 1 ELSE 0 END) as period_3_present,
    ROUND(
        (SUM(
            CASE WHEN ar.period_1 THEN 1 ELSE 0 END +
            CASE WHEN ar.period_2 THEN 1 ELSE 0 END +
            CASE WHEN ar.period_3 THEN 1 ELSE 0 END
        ) * 100.0) / (COUNT(ar.id) * 3), 2
    ) as overall_attendance_percentage
FROM attendance_records ar
WHERE ar.date BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY DATE(ar.date)
ORDER BY attendance_date;

-- 11. Get students who were absent for a specific period on a date
SELECT s.name, s.phone
FROM students s
JOIN attendance_records ar ON s.id = ar.student_id
WHERE ar.date = '2024-01-15' 
AND ar.period_1 = FALSE; -- Change to period_2 or period_3 as needed

-- 12. Update student information
UPDATE students 
SET name = 'Updated Name', 
    age = 17, 
    phone = '+9876543210', 
    fee = 600.00,
    updated_at = NOW()
WHERE id = 'student-uuid-here';

-- 13. Delete a student (will cascade to attendance and payments)
DELETE FROM students WHERE id = 'student-uuid-here';

-- 14. Get recent fee payment history
SELECT 
    fp.student_name,
    fp.amount,
    fp.paid,
    fp.payment_date
FROM fee_payments fp
ORDER BY fp.payment_date DESC
LIMIT 20;

-- 15. Get monthly attendance summary
SELECT 
    EXTRACT(YEAR FROM ar.date) as year,
    EXTRACT(MONTH FROM ar.date) as month,
    COUNT(DISTINCT ar.student_id) as active_students,
    COUNT(ar.id) as total_attendance_records,
    ROUND(
        (SUM(
            CASE WHEN ar.period_1 THEN 1 ELSE 0 END +
            CASE WHEN ar.period_2 THEN 1 ELSE 0 END +
            CASE WHEN ar.period_3 THEN 1 ELSE 0 END
        ) * 100.0) / (COUNT(ar.id) * 3), 2
    ) as monthly_attendance_percentage
FROM attendance_records ar
GROUP BY EXTRACT(YEAR FROM ar.date), EXTRACT(MONTH FROM ar.date)
ORDER BY year DESC, month DESC;