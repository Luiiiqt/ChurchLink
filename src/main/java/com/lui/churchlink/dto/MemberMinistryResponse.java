package com.lui.churchlink.dto;

import java.time.LocalDate;

public class MemberMinistryResponse {

    private Integer memberId;
    private String firstName;
    private String middleName;
    private String lastName;
    private LocalDate dob;
    private String gender;
    private String address;
    private MinistryDTO ministry;

    public MemberMinistryResponse() {}

    public MemberMinistryResponse(Integer memberId, String firstName, String middleName, String lastName,
                                  LocalDate dob, String gender, String address,
                                  Integer ministryId, String ministryName) {
        this.memberId = memberId;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.address = address;
        if (ministryId != null && ministryName != null) {
            this.ministry = new MinistryDTO(ministryId, ministryName);
        }
    }

    // Getters & Setters
    public Integer getMemberId() { return memberId; }
    public void setMemberId(Integer memberId) { this.memberId = memberId; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getMiddleName() { return middleName; }
    public void setMiddleName(String middleName) { this.middleName = middleName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public MinistryDTO getMinistry() { return ministry; }
    public void setMinistry(MinistryDTO ministry) { this.ministry = ministry; }
}
