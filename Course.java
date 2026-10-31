import java.util.Vector;
import java.util.Enumeration;

class NotYetSetException extends Exception {
    public NotYetSetException(String s) { super(s); }
}

class Student {
    private String name;

    Student() { }

    public String getName() { return name; }
    public void setName(String n) { name = n; }
}

class Assignment {
    private double mark = -1;

    Assignment() { }

    public double getMark() throws NotYetSetException {
        if (mark == -1) { 
            throw new NotYetSetException("Mark is not yet set");
        }
        return mark;
    }

    public void setMark(int m) { mark = m; }
}

class CourseRecord {
    private Student student;
    private Vector assignments;

    CourseRecord() { assignments = new Vector(); }

    public Student getStudent() { return student; }
    public void setStudent(Student s) { student = s; }

    public void addAssignment(Assignment a) { assignments.addElement(a); }
    public Enumeration getAssignments() { return assignments.elements(); }
}

public class Course {
    private String title;
    private Vector courseRecords;

    Course() { courseRecords = new Vector(); }

    public String getTitle() { return title; }
    public void setTitle(String t) { title = t; }

    public void addCourseRecord(CourseRecord cr) { courseRecords.addElement(cr); }
    public Enumeration getCourseRecords() { return courseRecords.elements(); }

    public void printCourseStudents() {
        System.out.println("Daftar Mahasiswa di Mata Kuliah: " + title);
        Enumeration e = getCourseRecords();
        while (e.hasMoreElements()) {
            CourseRecord cr = (CourseRecord) e.nextElement();
            System.out.println("- " + cr.getStudent().getName());
        }
    }

    public void printBestStudent() {
        Enumeration eRecords = getCourseRecords();
        Student bestStudent = null;
        double highestAvg = -1;

        while (eRecords.hasMoreElements()) {
            CourseRecord cr = (CourseRecord) eRecords.nextElement();
            Enumeration eAssignments = cr.getAssignments();
            
            double totalMarks = 0;
            int count = 0;
            
            while (eAssignments.hasMoreElements()) {
                Assignment a = (Assignment) eAssignments.nextElement();
                try {
                    totalMarks += a.getMark();
                    count++;
                } catch (NotYetSetException ex) {
                }
            }
            
            if (count > 0) {
                double avg = totalMarks / count;
                if (avg > highestAvg) {
                    highestAvg = avg;
                    bestStudent = cr.getStudent();
                }
            }
        }

        if (bestStudent != null) {
            System.out.println("\nMahasiswa Terbaik: " + bestStudent.getName() + " (Rata-rata: " + highestAvg + ")");
        }
    }

    public void printFinalExamStudents() {
        System.out.println("\nMahasiswa yang Layak Ujian Akhir (Mengerjakan minimal 3 tugas):");
        Enumeration eRecords = getCourseRecords();
        while (eRecords.hasMoreElements()) {
            CourseRecord cr = (CourseRecord) eRecords.nextElement(); 
            Enumeration eAssignments = cr.getAssignments();
            
            int completedAssignments = 0;
            while (eAssignments.hasMoreElements()) {
                Assignment a = (Assignment) eAssignments.nextElement(); 
                try {
                    a.getMark();
                    completedAssignments++;
                } catch (NotYetSetException ex) {
                }
            }
            
            if (completedAssignments >= 3) { 
                System.out.println("- " + cr.getStudent().getName() + " (Selesai " + completedAssignments + " tugas)");
            }
        }
    }
}