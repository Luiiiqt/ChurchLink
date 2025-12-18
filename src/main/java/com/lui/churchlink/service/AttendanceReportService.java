package com.lui.churchlink.service;

import com.lui.churchlink.dto.AttendanceReportDTO;
import com.lui.churchlink.model.Attendance;
import com.lui.churchlink.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AttendanceReportService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceReportService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public List<AttendanceReportDTO> getAttendanceReport(String type) {
        LocalDate today = LocalDate.now();
        LocalDate startDate;
        LocalDate endDate;

        switch (type.toLowerCase()) {
            case "weekly":
                startDate = today.with(WeekFields.of(Locale.getDefault()).dayOfWeek(), 1);
                endDate = startDate.plusDays(6);
                break;
            case "monthly":
                startDate = today.withDayOfMonth(1);
                endDate = startDate.plusMonths(1).minusDays(1);
                break;
            case "quarterly":
                int currentQuarter = (today.getMonthValue() - 1) / 3 + 1;
                startDate = LocalDate.of(today.getYear(), (currentQuarter - 1) * 3 + 1, 1);
                endDate = startDate.plusMonths(3).minusDays(1);
                break;
            case "yearly":
                startDate = LocalDate.of(today.getYear(), 1, 1);
                endDate = LocalDate.of(today.getYear(), 12, 31);
                break;
            default:
                throw new IllegalArgumentException("Invalid report type: " + type);
        }

        List<Attendance> records = attendanceRepository.findByDateBetween(startDate, endDate);

        return records.stream()
                .map(a -> new AttendanceReportDTO(
                        a.getMember().getFirstName() + " " +
                                (a.getMember().getMiddleName() != null ? a.getMember().getMiddleName() + " " : "") +
                                a.getMember().getLastName(),
                        a.getDate(),
                        a.getActivity() == null ? "General" : a.getActivity().getActivity()
                ))
                .collect(Collectors.toList());
    }
}
