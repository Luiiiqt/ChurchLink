package com.lui.churchlink.service;

import com.lui.churchlink.dto.ActivityDTO;
import com.lui.churchlink.model.Activity;
import com.lui.churchlink.model.Ministry;
import com.lui.churchlink.repository.ActivityRepository;
import com.lui.churchlink.repository.MinistryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final MinistryRepository ministryRepository;

    public ActivityService(ActivityRepository activityRepository, MinistryRepository ministryRepository) {
        this.activityRepository = activityRepository;
        this.ministryRepository = ministryRepository;
    }

    public List<ActivityDTO> getAllActivities() {
        return activityRepository.findAll()
                .stream()
                .map(ActivityDTO::new)
                .collect(Collectors.toList());
    }

    public ActivityDTO saveActivity(ActivityDTO dto) {
        Activity activity = new Activity();
        applyDtoToActivity(activity, dto);
        return new ActivityDTO(activityRepository.save(activity));
    }

    public ActivityDTO updateActivity(ActivityDTO dto) {
        Activity activity = activityRepository.findById(dto.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        applyDtoToActivity(activity, dto);
        return new ActivityDTO(activityRepository.save(activity));
    }

    public ActivityDTO rescheduleActivity(Integer id, ActivityDTO dto) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        // Only update date & time
        activity.setDate(LocalDate.parse(dto.getDate()));
        activity.setTime(LocalTime.parse(dto.getTime()));
        activity.setStatus(Activity.ActivityStatus.RESCHEDULED);

        return new ActivityDTO(activityRepository.save(activity));
    }

    public void deleteActivity(Integer id) {
        activityRepository.deleteById(id);
    }

    public void markCompleted(Integer activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        activity.setCompleted(true);
        activity.setStatus(Activity.ActivityStatus.COMPLETED);
        activityRepository.save(activity);
    }

    // -------------------------
    // Helper method to map DTO to entity
    // -------------------------
    private void applyDtoToActivity(Activity activity, ActivityDTO dto) {
        activity.setActivity(dto.getActivity());
        activity.setPlace(dto.getPlace());
        activity.setDate(LocalDate.parse(dto.getDate()));
        activity.setTime(LocalTime.parse(dto.getTime()));

        Ministry ministry = ministryRepository.findById(dto.getMinistryId())
                .orElseThrow(() -> new RuntimeException("Ministry not found"));
        activity.setMinistry(ministry);

        // Optional: reset status if not provided
        if (dto.getStatus() != null) {
            activity.setStatus(Activity.ActivityStatus.valueOf(dto.getStatus()));
        } else if (activity.getStatus() == null) {
            activity.setStatus(Activity.ActivityStatus.SCHEDULED);
        }
    }
}
