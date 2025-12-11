package com.lui.churchlink.service;

import com.lui.churchlink.dto.AttendanceDTO;
import com.lui.churchlink.model.Attendance;
import com.lui.churchlink.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public List<AttendanceDTO> getAllAttendances() {
        return attendanceRepository.findAllAttendanceDTO();
    }

    public Attendance saveAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public void deleteAttendance(Integer id) {
        attendanceRepository.deleteById(id);
    }
}
