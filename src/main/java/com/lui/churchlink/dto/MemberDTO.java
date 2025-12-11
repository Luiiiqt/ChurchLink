package com.lui.churchlink.dto;

import com.lui.churchlink.model.Member;
import java.time.LocalDate;

public class MemberDTO {
    private int id; // maps to memberId in entity
    private String firstName;
    private String middleName;
    private String lastName;
    private LocalDate dob;
    private String gender;
    private String address;
    private Integer ministryId; // Can be null

    public MemberDTO() {}

    // Constructor from Member entity
    public MemberDTO(Member member) {
        this.id = member.getMemberId(); // corrected
        this.firstName = member.getFirstName();
        this.middleName = member.getMiddleName();
        this.lastName = member.getLastName();
        this.dob = member.getDob();
        this.gender = member.getGender();
        this.address = member.getAddress();
        this.ministryId = member.getMinistry() != null ? member.getMinistry().getMinistryId() : null;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

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

    public Integer getMinistryId() { return ministryId; }
    public void setMinistryId(Integer ministryId) { this.ministryId = ministryId; }
}
