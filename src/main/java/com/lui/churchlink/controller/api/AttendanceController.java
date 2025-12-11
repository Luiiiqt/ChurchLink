package com.lui.churchlink.controller.api;

import com.lui.churchlink.dto.AttendanceDTO;
import com.lui.churchlink.model.Attendance;
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

    @GetMapping
    public List<AttendanceDTO> getAll() {
        return attendanceService.getAllAttendances();
    }

    @PostMapping
    public AttendanceDTO create(@RequestBody Attendance attendance) {
        Attendance saved = attendanceService.saveAttendance(attendance);
        return new AttendanceDTO(
                saved.getAttendanceId(),
                saved.getMember().getMemberId(),
                saved.getMember().getFirstName(),
                saved.getMember().getMiddleName(),
                saved.getMember().getLastName(),
                saved.getMember().getDob(),
                saved.getMember().getGender(),
                saved.getMember().getAddress(),
                saved.getMember().getMinistry() != null ? saved.getMember().getMinistry().getMinistryId() : null,
                saved.getMember().getMinistry() != null ? saved.getMember().getMinistry().getMinistry() : null,
                saved.getActivity().getActivityId(),
                saved.getActivity().getActivity(),
                saved.getActivity().getDate(),
                saved.getActivity().getTime(),
                saved.getActivity().getPlace(),
                saved.getTypeOfActivity()
        );
    }

    @PutMapping("/{id}")
    public AttendanceDTO update(@PathVariable int id, @RequestBody Attendance updatedAttendance) {
        Attendance existing = attendanceService.saveAttendance(updatedAttendance); // Or implement find + update in service
        return new AttendanceDTO(
                existing.getAttendanceId(),
                existing.getMember().getMemberId(),
                existing.getMember().getFirstName(),
                existing.getMember().getMiddleName(),
                existing.getMember().getLastName(),
                existing.getMember().getDob(),
                existing.getMember().getGender(),
                existing.getMember().getAddress(),
                existing.getMember().getMinistry() != null ? existing.getMember().getMinistry().getMinistryId() : null,
                existing.getMember().getMinistry() != null ? existing.getMember().getMinistry().getMinistry() : null,
                existing.getActivity().getActivityId(),
                existing.getActivity().getActivity(),
                existing.getActivity().getDate(),
                existing.getActivity().getTime(),
                existing.getActivity().getPlace(),
                existing.getTypeOfActivity()
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        attendanceService.deleteAttendance(id);
    }
}
