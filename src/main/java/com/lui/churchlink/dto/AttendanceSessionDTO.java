package com.lui.churchlink.dto;

import java.time.LocalDate;

public class AttendanceSessionDTO {

    private int sessionId;
    private Integer activityId; // null → general
    private String activityName; // for general, can be custom input
    private LocalDate date;
    private String[] present; // member IDs
    private String[] absent;

    public AttendanceSessionDTO() {}

    public AttendanceSessionDTO(
            int sessionId,
            Integer activityId,
            String activityName,
            LocalDate date,
            String[] present,
            String[] absent
    ) {
        this.sessionId = sessionId;
        this.activityId = activityId;
        this.activityName = activityName != null ? activityName : (activityId == null ? "General Attendance" : "");
        this.date = date;
        this.present = present;
        this.absent = absent;
    }

    // ---------- Getters & Setters ----------
    public int getSessionId() { return sessionId; }
    public void setSessionId(int sessionId) { this.sessionId = sessionId; }

    public Integer getActivityId() { return activityId; }
    public void setActivityId(Integer activityId) { this.activityId = activityId; }

    public String getActivityName() {
        // fallback to "General Attendance" if null
        return activityName != null ? activityName : (activityId == null ? "General Attendance" : "");
    }
    public void setActivityName(String activityName) { this.activityName = activityName; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String[] getPresent() { return present; }
    public void setPresent(String[] present) { this.present = present; }

    public String[] getAbsent() { return absent; }
    public void setAbsent(String[] absent) { this.absent = absent; }
}
