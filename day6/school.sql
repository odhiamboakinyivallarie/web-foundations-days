-- Day 6 Assignment: School Database
PRAGMA foreign_keys = ON;

-- 1. Create the students table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- 2. Create the courses table
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL UNIQUE
);

-- 3. Create the enrolments table
-- Each record links one student to one course.
CREATE TABLE enrolments (
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- 4. Insert at least 3 students
INSERT INTO students (student_id, name, email) VALUES
(1, 'Amina Otieno', 'amina@gmail.com'),
(2, 'Brian Kamau', 'brian@gmail.com'),
(3, 'Carol Wanjiku', 'carol@gmail.com');

-- 5. Insert at least 3 courses
INSERT INTO courses (course_id, course_name) VALUES
(1, 'Web Development'),
(2, 'Database Systems'),
(3, 'Computer Networks');

-- 6. Insert at least 5 enrolments
INSERT INTO enrolments (student_id, course_id, grade) VALUES
(1, 1, 'A'),
(1, 2, 'B'),
(2, 1, 'B'),
(2, 3, 'A'),
(3, 2, 'A');

-- QUERY 1: All courses taken by one student, searched by name
SELECT s.name, c.course_name, e.grade
FROM students AS s
JOIN enrolments AS e ON s.student_id = e.student_id
JOIN courses AS c ON e.course_id = c.course_id
WHERE s.name = 'Amina Otieno';

-- QUERY 2: All students enrolled in one course
SELECT c.course_name, s.name
FROM courses AS c
JOIN enrolments AS e ON c.course_id = e.course_id
JOIN students AS s ON e.student_id = s.student_id
WHERE c.course_name = 'Web Development';

-- QUERY 3: Number of students enrolled in each course
SELECT c.course_name, COUNT(e.student_id) AS number_of_students
FROM courses AS c
LEFT JOIN enrolments AS e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name
ORDER BY c.course_id;

-- QUERY 4: Students who have no enrolments
SELECT s.student_id, s.name
FROM students AS s
LEFT JOIN enrolments AS e ON s.student_id = e.student_id
WHERE e.student_id IS NULL;

-- QUERY 5: Update one enrolment's grade
UPDATE enrolments
SET grade = 'A'
WHERE student_id = 2 AND course_id = 1;

-- Verify the updated grade
SELECT s.name, c.course_name, e.grade
FROM enrolments AS e
JOIN students AS s ON e.student_id = s.student_id
JOIN courses AS c ON e.course_id = c.course_id
WHERE e.student_id = 2 AND e.course_id = 1;