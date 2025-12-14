package com.lui.churchlink.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "attendance_sessions")
public class AttendanceSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sessionId;

    private Integer activityId; // null → general
    private String activityName;
    private LocalDate date;

    @Column(columnDefinition = "json")
    private String present;

    @Column(columnDefinition = "json")
    private String absent;

    @Column(updatable = false, insertable = false, columnDefinition = "timestamp default CURRENT_TIMESTAMP")
    private java.sql.Timestamp createdAt;

    @Column(updatable = false, insertable = false, columnDefinition = "timestamp default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP")
    private java.sql.Timestamp updatedAt;

    // Getters & Setters
    public int getSessionId() { return sessionId; }
    public void setSessionId(int sessionId) { this.sessionId = sessionId; }

    public Integer getActivityId() { return activityId; }
    public void setActivityId(Integer activityId) { this.activityId = activityId; }

    public String getActivityName() { return activityName; }
    public void setActivityName(String activityName) { this.activityName = activityName; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getPresent() { return present; }
    public void setPresent(String present) { this.present = present; }

    public String getAbsent() { return absent; }
    public void setAbsent(String absent) { this.absent = absent; }
}
