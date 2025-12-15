package com.lui.churchlink.dto;

import jakarta.validation.constraints.*;

public class ActivityDTO {
    private Integer activityId;

    @NotBlank(message = "Activity name is required")
    @Size(max = 100, message = "Activity name cannot exceed 100 characters")
    private String activity;

    @Size(max = 50, message = "Event type cannot exceed 50 characters")
    private String eventType;

    // Date and time as String
    private String date;
    private String time;

    @Size(max = 100, message = "Place cannot exceed 100 characters")
    private String place;

    private Boolean isGeneral;

    private Integer ministryId;

    @Size(max = 50, message = "Status cannot exceed 50 characters")
    private String status;

    public ActivityDTO() {}

    public ActivityDTO(com.lui.churchlink.model.Activity activity) {
        this.activityId = activity.getActivityId();
        this.activity = activity.getActivity();
        this.eventType = activity.getEventType();
        this.place = activity.getPlace();
        this.isGeneral = activity.isGeneral();
        this.date = activity.getDate() != null ? activity.getDate().toString() : null;
        this.time = activity.getTime() != null ? activity.getTime().toString() : null;
        this.ministryId = activity.getMinistry() != null ? activity.getMinistry().getMinistryId() : null;
        this.status = activity.getStatus() != null ? activity.getStatus().name() : null;
    }

    // Getters / Setters
    public Integer getActivityId() { return activityId; }
    public void setActivityId(Integer activityId) { this.activityId = activityId; }
    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }
    public Boolean isGeneral() { return isGeneral != null && isGeneral; }
    public void setGeneral(Boolean general) { isGeneral = general; }
    public Integer getMinistryId() { return ministryId; }
    public void setMinistryId(Integer ministryId) { this.ministryId = ministryId; }
    public boolean isMinistryValid() { return isGeneral() || (ministryId != null); }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
