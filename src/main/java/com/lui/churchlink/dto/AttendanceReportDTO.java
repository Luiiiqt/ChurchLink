package com.lui.churchlink.dto;

import java.time.LocalDate;

public class AttendanceReportDTO {
    private String memberName;
    private LocalDate date;
    private String status;

    public AttendanceReportDTO(String memberName, LocalDate date, String status) {
        this.memberName = memberName;
        this.date = date;
        this.status = status;
    }

    public String getMemberName() { return memberName; }
    public LocalDate getDate() { return date; }
    public String getStatus() { return status; }
}
