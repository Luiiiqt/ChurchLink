package com.lui.churchlink.controller.api;

import com.lui.churchlink.dto.AttendanceDTO;
import com.lui.churchlink.dto.MemberAttendanceResponse;
import com.lui.churchlink.service.AttendanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendances")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // ------------------------
    // General attendance endpoints
    // ------------------------

    // GET all members with general attendance status
    @GetMapping("/general/members")
    public List<MemberAttendanceResponse> getGeneralMembers() {
        return attendanceService.getGeneralAttendance();
    }

    // ------------------------
    // Specific activity attendance endpoints
    // ------------------------

    // GET members for a specific activity
    @GetMapping("/activity/{activityId}/members")
    public List<MemberAttendanceResponse> getSpecificMembers(@PathVariable Integer activityId) {
        return attendanceService.getSpecificAttendance(activityId);
    }

    // ------------------------
    // Attendance record endpoints
    // ------------------------

    // GET all attendance records (full DTO)
    @GetMapping("/records")
    public List<AttendanceDTO> getAttendanceRecords() {
        return attendanceService.getAttendanceRecords();
    }

    // Shortcut: allow GET /api/attendances to return all records
    @GetMapping
    public List<AttendanceDTO> getAllAttendances() {
        return attendanceService.getAttendanceRecords();
    }

    // ------------------------
    // Save / Delete endpoints
    // ------------------------

    // Save attendance
    @PostMapping
    public void saveAttendance(@RequestBody MemberAttendanceRequest request) {
        attendanceService.saveAttendance(request.getMemberId(), request.getActivityId());
    }

    // Delete attendance
    @DeleteMapping("/{attendanceId}")
    public void delete(@PathVariable Integer attendanceId) {
        attendanceService.deleteAttendance(attendanceId);
    }

    // ------------------------
    // DTO for frontend POST
    // ------------------------
    public static class MemberAttendanceRequest {
        private Integer memberId;
        private Integer activityId;

        public Integer getMemberId() { return memberId; }
        public void setMemberId(Integer memberId) { this.memberId = memberId; }

        public Integer getActivityId() { return activityId; }
        public void setActivityId(Integer activityId) { this.activityId = activityId; }
    }
}
