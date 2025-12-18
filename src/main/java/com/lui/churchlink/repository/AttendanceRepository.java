package com.lui.churchlink.repository;

import com.lui.churchlink.dto.AttendanceDTO;
import com.lui.churchlink.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    // --- Attendance logic ---

    // Find all general attendance (no activity)
    List<Attendance> findByActivityIsNull();

    // Find attendance for a specific activity
    List<Attendance> findByActivity_ActivityId(Integer activityId);

    // Check if a member already has general attendance
    boolean existsByMember_MemberIdAndActivityIsNull(Integer memberId);

    // Check if a member already attended a specific activity
    boolean existsByMember_MemberIdAndActivity_ActivityId(Integer memberId, Integer activityId);

    List<Attendance> findByDateBetween(LocalDate start, LocalDate end);

    // --- Attendance reporting DTO ---
    @Query("""
SELECT new com.lui.churchlink.dto.AttendanceDTO(
    a.attendanceId,
    m.memberId, m.firstName, m.middleName, m.lastName, m.dob, m.gender, m.address,
    min.ministryId, min.ministry,
    act.activityId,
    act.activity,
    act.date, act.time, act.place,
    CASE WHEN act IS NULL THEN true ELSE false END
)
FROM Attendance a
JOIN a.member m
LEFT JOIN m.ministry min
LEFT JOIN a.activity act
ORDER BY act.date DESC
""")
    List<AttendanceDTO> findAllAttendanceDTO();


}
