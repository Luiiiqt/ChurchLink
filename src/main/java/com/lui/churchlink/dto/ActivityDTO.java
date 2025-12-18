package com.lui.churchlink.dto;

import jakarta.validation.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

public class ActivityDTO {

    private Integer activityId;

    @NotBlank(message = "Activity name is required")
    private String activity;

    @NotBlank(message = "Place is required")
    private String place;

    @NotNull(message = "Ministry is required")
    private Integer ministryId;

    @NotBlank(message = "Date is required")
    // Optional: enforce format
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Date must be in yyyy-MM-dd format")
    private String date;

    @NotBlank(message = "Time is required")
    // Optional: enforce format
    @Pattern(regexp = "\\d{2}:\\d{2}", message = "Time must be in HH:mm format")
    private String time;

    private String status;

    public ActivityDTO() {}

    public ActivityDTO(com.lui.churchlink.model.Activity activity) {
        this.activityId = activity.getActivityId();
        this.activity = activity.getActivity();
        this.place = activity.getPlace();
        this.date = activity.getDate() != null ? activity.getDate().toString() : null;
        this.time = activity.getTime() != null ? activity.getTime().toString() : null;
        this.ministryId = activity.getMinistry() != null
                ? activity.getMinistry().getMinistryId()
                : null;
        this.status = activity.getStatus().name();
    }

    // Getters & Setters
    public Integer getActivityId() { return activityId; }
    public void setActivityId(Integer activityId) { this.activityId = activityId; }

    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }

    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }

    public Integer getMinistryId() { return ministryId; }
    public void setMinistryId(Integer ministryId) { this.ministryId = ministryId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
