package com.lui.churchlink.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int attendanceId;

    // Many attendances belong to one activity
    @ManyToOne
    @JoinColumn(name = "activity_id")
    private Activity activity;

    // Many attendances belong to one member
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private LocalDate date;
    private String typeOfActivity;

    // Getters and Setters
    public int getAttendanceId() { return attendanceId; }
    public Activity getActivity() { return activity; }
    public void setActivity(Activity activity) { this.activity = activity; }
    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getTypeOfActivity() { return typeOfActivity; }
    public void setTypeOfActivity(String typeOfActivity) { this.typeOfActivity = typeOfActivity; }
}
