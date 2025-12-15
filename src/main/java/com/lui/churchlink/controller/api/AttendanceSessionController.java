package com.lui.churchlink.controller.api;

import com.lui.churchlink.dto.AttendanceSessionDTO;
import com.lui.churchlink.service.AttendanceSessionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @PostMapping("/session")
    public void saveAttendanceSession(@Valid @RequestBody AttendanceSessionRequest request) throws JsonProcessingException {
        String activityName = request.getActivityName();
        if (request.getActivityId() == null && (activityName == null || activityName.isEmpty())) {
            activityName = "Sunday Service";
        }
        service.saveAttendanceSession(request.getActivityId(), activityName, request.getDate(), request.getPresent());
    }

    @GetMapping("/sessions")
    public List<AttendanceSessionDTO> getAllSessions() {
        return service.getAllSessions();
    }

    @GetMapping("/sessions/general")
    public List<AttendanceSessionDTO> getGeneralSessions() {
        return service.getGeneralSessions();
    }

    @GetMapping("/sessions/specific")
    public List<AttendanceSessionDTO> getSpecificSessions() {
        return service.getSpecificSessions();
    }

    // DTO for POST
    public static class AttendanceSessionRequest {
        private Integer activityId;

        @Size(max = 100, message = "Activity name cannot exceed 100 characters")
        private String activityName;

        @NotNull(message = "Date is required")
        private LocalDate date;

        @NotEmpty(message = "Present member list cannot be empty")
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
