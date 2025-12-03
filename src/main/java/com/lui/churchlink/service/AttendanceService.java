package com.lui.churchlink.service;

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

    public List<Attendance> findAll() {
        return attendanceRepository.findAll();
    }

    public Attendance findById(int id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found with id " + id));
    }

    public Attendance save(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public Attendance update(int id, Attendance attendance) {
        Attendance existing = findById(id);

        existing.setActivity(attendance.getActivity());
        existing.setMember(attendance.getMember());   // FIXED
        existing.setDate(attendance.getDate());
        existing.setTypeOfActivity(attendance.getTypeOfActivity());

        return attendanceRepository.save(existing);
    }

    public void delete(int id) {
        attendanceRepository.deleteById(id);
    }
}
