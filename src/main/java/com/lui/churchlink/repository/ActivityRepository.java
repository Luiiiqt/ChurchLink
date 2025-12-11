package com.lui.churchlink.repository;

import com.lui.churchlink.dto.ActivityDTO;
import com.lui.churchlink.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Integer> {

    @Query("""
        SELECT new com.lui.churchlink.dto.ActivityDTO(
            a.activityId, a.activity, a.date, a.time, a.place, m.ministryId, m.ministry
        )
        FROM Activity a
        JOIN a.ministry m
    """)
    List<ActivityDTO> findAllActivitiesDTO();
}
