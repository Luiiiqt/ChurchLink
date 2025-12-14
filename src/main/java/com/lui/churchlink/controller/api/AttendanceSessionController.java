package com.lui.churchlink.controller.api;

import com.lui.churchlink.dto.AttendanceSessionDTO;
import com.lui.churchlink.service.AttendanceSessionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendances")
public class AttendanceSessionController {

    private final AttendanceSessionService service;

    public AttendanceSessionController(AttendanceSessionService service) {
        this.service = service;
    }

    // ---------------------------
    // Save session (general or specific)
    // ---------------------------
    @PostMapping("/session")
    public void saveAttendanceSession(@RequestBody AttendanceSessionRequest request) throws JsonProcessingException {
        // If general attendance, provide default activity name if none
        String activityName = request.getActivityName();
        if (request.getActivityId() == null && (activityName == null || activityName.isEmpty())) {
            activityName = "Sunday Service";
        }
        service.saveAttendanceSession(
                request.getActivityId(),
                activityName,
                request.getDate(),
                request.getPresent()
        );
    }

    // ---------------------------
    // Get all sessions
    // ---------------------------
    @GetMapping("/sessions")
    public List<AttendanceSessionDTO> getAllSessions() {
        return service.getAllSessions();
    }

    // ---------------------------
    // General sessions only
    // ---------------------------
    @GetMapping("/sessions/general")
    public List<AttendanceSessionDTO> getGeneralSessions() {
        return service.getGeneralSessions();
    }

    // ---------------------------
    // Specific sessions only
    // ---------------------------
    @GetMapping("/sessions/specific")
    public List<AttendanceSessionDTO> getSpecificSessions() {
        return service.getSpecificSessions();
    }

    // ---------------------------
    // DTO for POST
    // ---------------------------
    public static class AttendanceSessionRequest {
        private Integer activityId;   // null → general
        private String activityName;  // optional for general
        private LocalDate date;       // optional for general
        private List<Integer> present;

        public Integer getActivityId() { return activityId; }
        public void setActivityId(Integer activityId) { this.activityId = activityId; }

        public String getActivityName() { return activityName; }
        public void setActivityName(String activityName) { this.activityName = activityName; }

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public List<Integer> getPresent() { return present; }
        public void setPresent(List<Integer> present) { this.present = present; }
    }
}
