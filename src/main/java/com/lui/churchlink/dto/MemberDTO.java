package com.lui.churchlink.dto;

import com.lui.churchlink.model.Member;

public class MemberDTO {

    private Integer memberId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String dob; // String for JSON
    private String gender;
    private String address;

    private Integer ministryId;
    private String ministryName; // NEW

    public MemberDTO() {}

    // Constructor from Member entity
    public MemberDTO(Member member) {
        this.memberId = member.getMemberId();
        this.firstName = member.getFirstName();
        this.middleName = member.getMiddleName();
        this.lastName = member.getLastName();
        this.dob = member.getDob() != null ? member.getDob().toString() : null;
        this.gender = member.getGender();
        this.address = member.getAddress();

        if (member.getMinistry() != null) {
            this.ministryId = member.getMinistry().getMinistryId();
            this.ministryName = member.getMinistry().getMinistry(); // NEW: set ministry name
        }
    }

    // Getters and Setters
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
}
