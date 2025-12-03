package com.lui.churchlink.controller;

import com.lui.churchlink.model.Attendance;
import com.lui.churchlink.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendances")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getAll() {
        return ResponseEntity.ok(attendanceService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attendance> getOne(@PathVariable int id) {
        return ResponseEntity.ok(attendanceService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Attendance> create(@RequestBody Attendance attendance) {
        return ResponseEntity.ok(attendanceService.save(attendance));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Attendance> update(@PathVariable int id, @RequestBody Attendance attendance) {
        return ResponseEntity.ok(attendanceService.update(id, attendance));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        attendanceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}