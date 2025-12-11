package com.lui.churchlink.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ActivityDTO {

    private Integer activityId;
    private String activity;
    private LocalDate date; // Type-safe
    private LocalTime time; // Type-safe
    private String place;
    private Integer ministryId;
    private String ministryName;

    public ActivityDTO() {}

    // Constructor from entity fields
    public ActivityDTO(Integer activityId, String activity, LocalDate date, LocalTime time, String place, Integer ministryId, String ministryName) {
        this.activityId = activityId;
        this.activity = activity;
        this.date = date;
        this.time = time;
        this.place = place;
        this.ministryId = ministryId;
        this.ministryName = ministryName;
    }

    // Constructor from Activity entity
    public ActivityDTO(com.lui.churchlink.model.Activity activityEntity) {
        this.activityId = activityEntity.getActivityId();
        this.activity = activityEntity.getActivity();
        this.date = activityEntity.getDate();
        this.time = activityEntity.getTime();
        this.place = activityEntity.getPlace();
        if (activityEntity.getMinistry() != null) {
            this.ministryId = activityEntity.getMinistry().getMinistryId();
            this.ministryName = activityEntity.getMinistry().getMinistry();
        }
    }

    // Getters & Setters
    public Integer getActivityId() { return activityId; }
    public void setActivityId(Integer activityId) { this.activityId = activityId; }

    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }

    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }

    public Integer getMinistryId() { return ministryId; }
    public void setMinistryId(Integer ministryId) { this.ministryId = ministryId; }

    public String getMinistryName() { return ministryName; }
    public void setMinistryName(String ministryName) { this.ministryName = ministryName; }
}
