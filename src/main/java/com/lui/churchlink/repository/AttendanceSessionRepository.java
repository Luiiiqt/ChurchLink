package com.lui.churchlink.repository;

import com.lui.churchlink.model.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Integer> {

    // Fetch general (activityId = null)
    List<AttendanceSession> findByActivityIdIsNull();

    // Fetch specific (activityId != null)
    List<AttendanceSession> findByActivityIdIsNotNull();

    // Optional: find by activityId (for checking if already saved)
    List<AttendanceSession> findByActivityId(Integer activityId);
}
