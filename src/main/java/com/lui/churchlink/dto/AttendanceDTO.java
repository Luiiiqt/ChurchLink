package com.lui.churchlink.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AttendanceDTO {
    private int attendanceId;

    private int memberId;
    private String memberFirstName;
    private String memberMiddleName;
    private String memberLastName;
    private LocalDate memberDob;
    private String memberGender;
    private String memberAddress;

    private Integer ministryId;
    private String ministryName;

    private int activityId;
    private String activityName;
    private LocalDate activityDate;
    private LocalTime activityTime;
    private String activityPlace;

    private String typeOfActivity;

    // Default constructor
    public AttendanceDTO() {}

    // Constructor matching your JPQL query
    public AttendanceDTO(
            int attendanceId,
            int memberId, String memberFirstName, String memberMiddleName, String memberLastName,
            LocalDate memberDob, String memberGender, String memberAddress,
            Integer ministryId, String ministryName,
            int activityId, String activityName, LocalDate activityDate, LocalTime activityTime, String activityPlace,
            String typeOfActivity
    ) {
        this.attendanceId = attendanceId;
        this.memberId = memberId;
        this.memberFirstName = memberFirstName;
        this.memberMiddleName = memberMiddleName;
        this.memberLastName = memberLastName;
        this.memberDob = memberDob;
        this.memberGender = memberGender;
        this.memberAddress = memberAddress;
        this.ministryId = ministryId;
        this.ministryName = ministryName;
        this.activityId = activityId;
        this.activityName = activityName;
        this.activityDate = activityDate;
        this.activityTime = activityTime;
        this.activityPlace = activityPlace;
        this.typeOfActivity = typeOfActivity;
    }

    // Getters and Setters for all fields
    public int getAttendanceId() { return attendanceId; }
    public void setAttendanceId(int attendanceId) { this.attendanceId = attendanceId; }

    public int getMemberId() { return memberId; }
    public void setMemberId(int memberId) { this.memberId = memberId; }

    public String getMemberFirstName() { return memberFirstName; }
    public void setMemberFirstName(String memberFirstName) { this.memberFirstName = memberFirstName; }

    public String getMemberMiddleName() { return memberMiddleName; }
    public void setMemberMiddleName(String memberMiddleName) { this.memberMiddleName = memberMiddleName; }

    public String getMemberLastName() { return memberLastName; }
    public void setMemberLastName(String memberLastName) { this.memberLastName = memberLastName; }

    public LocalDate getMemberDob() { return memberDob; }
    public void setMemberDob(LocalDate memberDob) { this.memberDob = memberDob; }

    public String getMemberGender() { return memberGender; }
    public void setMemberGender(String memberGender) { this.memberGender = memberGender; }

    public String getMemberAddress() { return memberAddress; }
    public void setMemberAddress(String memberAddress) { this.memberAddress = memberAddress; }

    public Integer getMinistryId() { return ministryId; }
    public void setMinistryId(Integer ministryId) { this.ministryId = ministryId; }

    public String getMinistryName() { return ministryName; }
    public void setMinistryName(String ministryName) { this.ministryName = ministryName; }

    public int getActivityId() { return activityId; }
    public void setActivityId(int activityId) { this.activityId = activityId; }

    public String getActivityName() { return activityName; }
    public void setActivityName(String activityName) { this.activityName = activityName; }

    public LocalDate getActivityDate() { return activityDate; }
    public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }

    public LocalTime getActivityTime() { return activityTime; }
    public void setActivityTime(LocalTime activityTime) { this.activityTime = activityTime; }

    public String getActivityPlace() { return activityPlace; }
    public void setActivityPlace(String activityPlace) { this.activityPlace = activityPlace; }

    public String getTypeOfActivity() { return typeOfActivity; }
    public void setTypeOfActivity(String typeOfActivity) { this.typeOfActivity = typeOfActivity; }
}
