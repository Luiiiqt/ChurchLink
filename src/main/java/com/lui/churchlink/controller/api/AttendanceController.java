package com.lui.churchlink.controller.api;

import com.lui.churchlink.dto.AttendanceDTO;
import com.lui.churchlink.dto.MemberAttendanceResponse;
import com.lui.churchlink.service.AttendanceService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendances")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/general/members")
    public List<MemberAttendanceResponse> getGeneralMembers() {
        return attendanceService.getGeneralAttendance();
    }

    @GetMapping("/activity/{activityId}/members")
    public List<MemberAttendanceResponse> getSpecificMembers(@PathVariable Integer activityId) {
        return attendanceService.getSpecificAttendance(activityId);
    }

    @GetMapping("/records")
    public List<AttendanceDTO> getAttendanceRecords() {
        return attendanceService.getAttendanceRecords();
    }

    @GetMapping
    public List<AttendanceDTO> getAllAttendances() {
        return attendanceService.getAttendanceRecords();
    }

    // Save attendance
    @PostMapping
    public void saveAttendance(@Valid @RequestBody MemberAttendanceRequest request) {
        attendanceService.saveAttendance(request.getMemberId(), request.getActivityId());
    }

    @DeleteMapping("/{attendanceId}")
    public void delete(@PathVariable Integer attendanceId) {
        attendanceService.deleteAttendance(attendanceId);
    }

    // DTO for POST
    public static class MemberAttendanceRequest {
        @NotNull(message = "Member ID is required")
        private Integer memberId;

        @NotNull(message = "Activity ID is required")
        private Integer activityId;

        public Integer getMemberId() { return memberId; }
        public void setMemberId(Integer memberId) { this.memberId = memberId; }

        public Integer getActivityId() { return activityId; }
        public void setActivityId(Integer activityId) { this.activityId = activityId; }
    }
}
