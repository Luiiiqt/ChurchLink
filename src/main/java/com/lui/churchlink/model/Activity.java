package com.lui.churchlink.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int activityId;

    private String activity;
    private LocalDate date;
    private String place;
    private LocalTime time;

    @ManyToOne
    @JoinColumn(name = "ministry_id")
    private Ministry ministry;

    // One activity can have many attendances
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL)
    private List<Attendance> attendances;

    public int getActivityId() { return activityId; }
    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }
    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }
    public Ministry getMinistry() { return ministry; }
    public void setMinistry(Ministry ministry) { this.ministry = ministry; }
    public List<Attendance> getAttendances() { return attendances; }
    public void setAttendances(List<Attendance> attendances) { this.attendances = attendances; }
}
