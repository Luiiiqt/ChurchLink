package com.lui.churchlink.service;

import com.lui.churchlink.dto.AttendanceDTO;
import com.lui.churchlink.dto.MemberAttendanceResponse;
import com.lui.churchlink.model.Activity;
import com.lui.churchlink.model.Attendance;
import com.lui.churchlink.model.Member;
import com.lui.churchlink.repository.ActivityRepository;
import com.lui.churchlink.repository.AttendanceRepository;
import com.lui.churchlink.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final MemberRepository memberRepository;
    private final ActivityRepository activityRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository,
            MemberRepository memberRepository,
            ActivityRepository activityRepository
    ) {
        this.attendanceRepository = attendanceRepository;
        this.memberRepository = memberRepository;
        this.activityRepository = activityRepository;
    }

    // ------------------------
    // General attendance
    // ------------------------
    public List<MemberAttendanceResponse> getGeneralAttendance() {
        List<Member> members = memberRepository.findAll();
        List<Attendance> attendances = attendanceRepository.findByActivityIsNull();

        return members.stream()
                .map(m -> new MemberAttendanceResponse(
                        m.getMemberId(),
                        m.getFirstName(),
                        m.getLastName(),
                        attendances.stream()
                                .anyMatch(a -> a.getMember().getMemberId() == m.getMemberId())
                ))
                .collect(Collectors.toList());
    }

    // ------------------------
    // Specific activity attendance
    // ------------------------
    public List<MemberAttendanceResponse> getSpecificAttendance(Integer activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        List<Member> members = memberRepository.findByMinistry_MinistryId(activity.getMinistry().getMinistryId());
        List<Attendance> attendances = attendanceRepository.findByActivity_ActivityId(activityId);

        return members.stream()
                .map(m -> new MemberAttendanceResponse(
                        m.getMemberId(),
                        m.getFirstName(),
                        m.getLastName(),
                        attendances.stream()
                                .anyMatch(a -> a.getMember().getMemberId() == m.getMemberId())
                ))
                .collect(Collectors.toList());
    }

    // ------------------------
// Save attendance (automatic activity completion)
// ------------------------
    public void saveAttendance(Integer memberId, Integer activityId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Attendance attendance = new Attendance();
        attendance.setMember(member);
        attendance.setDate(LocalDate.now());

        if (activityId == null) { // General attendance
            if (attendanceRepository.existsByMember_MemberIdAndActivityIsNull(memberId)) return;
            attendance.setActivity(null);
        } else { // Specific activity attendance
            if (attendanceRepository.existsByMember_MemberIdAndActivity_ActivityId(memberId, activityId)) return;

            Activity activity = activityRepository.findById(activityId)
                    .orElseThrow(() -> new RuntimeException("Activity not found"));
            attendance.setActivity(activity);

            // ✅ Automatically mark activity as completed
            activity.setCompleted(true); // sets BIT = 1 in database
            activity.setStatus(Activity.ActivityStatus.COMPLETED); // use enum, not string
            activityRepository.save(activity);
        }

        attendanceRepository.save(attendance);
    }



    // ------------------------
    // Delete attendance
    // ------------------------
    public void deleteAttendance(Integer attendanceId) {
        attendanceRepository.deleteById(attendanceId);
    }

    // ------------------------
    // Fetch all attendance records for reporting
    // ------------------------
    public List<AttendanceDTO> getAttendanceRecords() {
        return attendanceRepository.findAllAttendanceDTO();
    }
}
