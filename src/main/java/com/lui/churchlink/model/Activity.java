package com.lui.churchlink.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "activity")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int activityId;

    private String activity;
    private LocalDate date;
    private LocalTime time;
    private String place;

    @ManyToOne
    @JoinColumn(name = "ministry_id")
    private Ministry ministry;

    @OneToMany(mappedBy = "activity")
    private List<Attendance> attendances;

    // Getters & Setters
    public int getActivityId() { return activityId; }
    public void setActivityId(int activityId) { this.activityId = activityId; }

    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }

    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }

    public Ministry getMinistry() { return ministry; }
    public void setMinistry(Ministry ministry) { this.ministry = ministry; }

    public List<Attendance> getAttendances() { return attendances; }
    public void setAttendances(List<Attendance> attendances) { this.attendances = attendances; }
}
