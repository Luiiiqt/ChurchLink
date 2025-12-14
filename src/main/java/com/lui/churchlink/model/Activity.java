package com.lui.churchlink.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int activityId;

    private String activity;      // Specific activity name
    private String eventType;     // General activity type
    private LocalDate date;
    private LocalTime time;
    private String place;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ministry_id")
    private Ministry ministry;

    @OneToMany(mappedBy = "activity")
    private List<Attendance> attendances;

    @Enumerated(EnumType.STRING)
    private ActivityStatus status = ActivityStatus.SCHEDULED;

    private boolean isGeneral = false;

    @Column(name = "completed", nullable = false)
    private boolean completed = false;

    public enum ActivityStatus {
        SCHEDULED,
        CANCELLED,
        RESCHEDULED,
        COMPLETED
    }

    // -------------------
    // Getters & Setters
    // -------------------
    public int getActivityId() { return activityId; }
    public void setActivityId(int activityId) { this.activityId = activityId; }

    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

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

    public ActivityStatus getStatus() { return status; }
    public void setStatus(ActivityStatus status) {
        this.status = status;
        if (status == ActivityStatus.COMPLETED) {
            this.completed = true;
        }
    }

    public boolean isGeneral() { return isGeneral; }
    public void setGeneral(boolean general) { isGeneral = general; }

    public boolean isCompleted() { return completed || status == ActivityStatus.COMPLETED; }
    public void setCompleted(boolean completed) {
        this.completed = completed;
        if (completed) {
            this.status = ActivityStatus.COMPLETED;
        }
    }
}
