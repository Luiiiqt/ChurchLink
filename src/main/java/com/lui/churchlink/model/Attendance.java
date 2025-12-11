package com.lui.churchlink.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "attendance")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int attendanceId;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "activity_id")
    private Activity activity;

    private LocalDate date;
    private String typeOfActivity;

    // Getters & Setters
    public int getAttendanceId() { return attendanceId; }
    public void setAttendanceId(int attendanceId) { this.attendanceId = attendanceId; }

    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }

    public Activity getActivity() { return activity; }
    public void setActivity(Activity activity) { this.activity = activity; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getTypeOfActivity() { return typeOfActivity; }
    public void setTypeOfActivity(String typeOfActivity) { this.typeOfActivity = typeOfActivity; }
}
