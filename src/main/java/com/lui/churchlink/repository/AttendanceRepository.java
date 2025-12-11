package com.lui.churchlink.repository;

import com.lui.churchlink.dto.AttendanceDTO;
import com.lui.churchlink.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    @Query("""
        SELECT new com.lui.churchlink.dto.AttendanceDTO(
            a.attendanceId,
            m.memberId, m.firstName, m.middleName, m.lastName, m.dob, m.gender, m.address,
            min.ministryId, min.ministry,
            act.activityId, act.activity, act.date, act.time, act.place,
            a.typeOfActivity
        )
        FROM Attendance a
        JOIN a.member m
        JOIN m.ministry min
        JOIN a.activity act
        ORDER BY a.date DESC
    """)
    List<AttendanceDTO> findAllAttendanceDTO();
}
