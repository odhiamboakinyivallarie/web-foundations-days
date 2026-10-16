# School Database Design

## Tables

**Students:** Stores each student's unique ID, name and email address. The email is required and must be unique so that two students cannot use the same email.

**Courses:** Stores each course's unique ID and name. Course names are required and unique in this example.

**Enrolments:** Connects students to courses and stores the grade earned by a student in a course. It uses a composite primary key made from `student_id` and `course_id`, preventing the same student from enrolling in the same course more than once. Both columns are foreign keys referencing their respective tables.

## Relationships

The relationship between students and enrolments is one-to-many because one student can have several enrolments, while each enrolment belongs to one student. The relationship between courses and enrolments is also one-to-many because one course can have many enrolments, while each enrolment refers to one course.

Students and courses therefore have a many-to-many relationship: one student can take many courses, and one course can have many students. The enrolments table is needed as a join table to connect the two entities. It also stores information about the relationship itself, such as the student's grade for a particular course.

## Index

I would add an index on `enrolments(course_id)` to help the database find students enrolled in a particular course more efficiently. This can improve course-based lookups and joins, especially as the number of enrolments grows. The composite primary key already creates an index beginning with `student_id`, but it does not provide the same efficient lookup path for `course_id` alone.

## SQL or NoSQL?

I would choose a relational SQL database such as SQLite for this school system. Students, courses and enrolments have clear relationships, and foreign keys help maintain data integrity. SQL also makes it straightforward to join tables, count enrolments and update grades. A NoSQL database could be suitable for some systems with flexible or frequently changing data structures, but its flexibility is not necessary for this relatively structured school database.