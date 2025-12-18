package com.lui.churchlink.controller.api;

import com.lui.churchlink.dto.AttendanceReportDTO;
import com.lui.churchlink.service.AttendanceReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class AttendanceReportController {

    private final AttendanceReportService reportService;

    public AttendanceReportController(AttendanceReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<AttendanceReportDTO>> getAttendanceReport(@RequestParam String type) {
        try {
            List<AttendanceReportDTO> data = reportService.getAttendanceReport(type);
            return ResponseEntity.ok(data);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}
