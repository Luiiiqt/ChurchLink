package com.lui.churchlink.dto;

public class MemberAttendanceResponse {
    private int memberId;
    private String firstName;
    private String lastName;
    private boolean present;

    public MemberAttendanceResponse(int memberId, String firstName, String lastName, boolean present) {
        this.memberId = memberId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.present = present;
    }

    // Getters & Setters
    public int getMemberId() { return memberId; }
    public void setMemberId(int memberId) { this.memberId = memberId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public boolean isPresent() { return present; }
    public void setPresent(boolean present) { this.present = present; }
}
