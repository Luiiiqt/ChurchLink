package com.lui.churchlink.dto;

import com.lui.churchlink.model.Member;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MemberDTO {

    private Integer memberId;

    @NotBlank(message = "First name is required")
    private String firstName;

    private String middleName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Date of birth is required")
    private String dob;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Ministry is required")
    private Integer ministryId;

    private String ministryName;

    @NotBlank(message = "Status is required")
    private String status; // ACTIVE, INACTIVE, DECEASED

    @NotBlank(message = "Role is required")
    private String role;   // LEADER, MEMBER, ASSISTANT

    private boolean archived;

    public MemberDTO() {}

    public MemberDTO(Member member) {
        this.memberId = member.getMemberId();
        this.firstName = member.getFirstName();
        this.middleName = member.getMiddleName();
        this.lastName = member.getLastName();
        this.dob = member.getDob() != null ? member.getDob().toString() : null;
        this.gender = member.getGender();
        this.address = member.getAddress();
        this.archived = member.isArchived();
        this.status = member.getStatus().name();
        this.role = member.getRole().name();

        if (member.getMinistry() != null) {
            this.ministryId = member.getMinistry().getMinistryId();
            this.ministryName = member.getMinistry().getMinistry();
        }
    }

    // ===== Getters & Setters =====

    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getMiddleName() { return middleName; }
    public void setMiddleName(String middleName) { this.middleName = middleName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Integer getMinistryId() { return ministryId; }
    public void setMinistryId(Integer ministryId) { this.ministryId = ministryId; }

    public String getMinistryName() { return ministryName; }
    public void setMinistryName(String ministryName) { this.ministryName = ministryName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isArchived() { return archived; }
    public void setArchived(boolean archived) { this.archived = archived; }
}
