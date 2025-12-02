package com.lui.churchlink.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int attendanceId;

    // Many-to-One: Attendance → Member
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    // Many-to-One: Attendance → Activity
    @ManyToOne
    @JoinColumn(name = "activity_id")
    private Activity activity;

    private LocalDate date;
    private String typeOfActivity;

    public int getAttendanceId() {
        return attendanceId;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getTypeOfActivity() {
        return typeOfActivity;
    }

    public void setTypeOfActivity(String typeOfActivity) {
        this.typeOfActivity = typeOfActivity;
    }
}
