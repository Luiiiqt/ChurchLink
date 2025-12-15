package com.lui.churchlink.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;

public class AttendanceDTO {

    private int attendanceId;

    // Member info
    @NotNull(message = "Member ID is required")
    private Integer memberId;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    private String memberFirstName;

    @Size(max = 50, message = "Middle name cannot exceed 50 characters")
    private String memberMiddleName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    private String memberLastName;

    @Past(message = "Date of birth must be in the past")
    private LocalDate memberDob;

    @NotBlank(message = "Gender is required")
    private String memberGender;

    @Size(max = 100, message = "Address cannot exceed 100 characters")
    private String memberAddress;

    // Ministry info
    private Integer ministryId;

    @Size(max = 50, message = "Ministry name cannot exceed 50 characters")
    private String ministryName;

    // Activity info (nullable for general attendance)
    private Integer activityId;

    @Size(max = 100, message = "Activity name cannot exceed 100 characters")
    private String activityName;

    private LocalDate activityDate;
    private LocalTime activityTime;
    private String activityPlace;

    private boolean general;

    public AttendanceDTO() {}

    public AttendanceDTO(
            int attendanceId,
            int memberId, String memberFirstName, String memberMiddleName, String memberLastName,
            LocalDate memberDob, String memberGender, String memberAddress,
            Integer ministryId, String ministryName,
            Integer activityId, String activityName, LocalDate activityDate, LocalTime activityTime, String activityPlace,
            boolean general
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
        this.general = general;
    }

    // ---------- Getters & Setters ----------
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

    public Integer getActivityId() { return activityId; }
    public void setActivityId(Integer activityId) { this.activityId = activityId; }

    public String getActivityName() { return activityName; }
    public void setActivityName(String activityName) { this.activityName = activityName; }

    public LocalDate getActivityDate() { return activityDate; }
    public void setActivityDate(LocalDate activityDate) { this.activityDate = activityDate; }

    public LocalTime getActivityTime() { return activityTime; }
    public void setActivityTime(LocalTime activityTime) { this.activityTime = activityTime; }

    public String getActivityPlace() { return activityPlace; }
    public void setActivityPlace(String activityPlace) { this.activityPlace = activityPlace; }

    public boolean isGeneral() { return general; }
    public void setGeneral(boolean general) { this.general = general; }
}
