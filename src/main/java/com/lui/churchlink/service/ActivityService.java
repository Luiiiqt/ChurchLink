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
        applyCommonFields(activity, dto);
        return new ActivityDTO(activityRepository.save(activity));
    }

    public ActivityDTO updateActivity(ActivityDTO dto) {
        Activity activity = activityRepository.findById(dto.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        applyCommonFields(activity, dto);
        return new ActivityDTO(activityRepository.save(activity));
    }

    private void applyCommonFields(Activity activity, ActivityDTO dto) {
        if (dto.getDate() != null && !dto.getDate().isBlank())
            activity.setDate(LocalDate.parse(dto.getDate()));
        if (dto.getTime() != null && !dto.getTime().isBlank())
            activity.setTime(LocalTime.parse(dto.getTime()));

        activity.setPlace(dto.getPlace());
        activity.setActivity(dto.getActivity() != null && !dto.getActivity().isBlank() ? dto.getActivity() : "Unnamed Activity");

        if (dto.getMinistryId() == null)
            throw new RuntimeException("Ministry is required for activities");

        Ministry ministry = ministryRepository.findById(dto.getMinistryId())
                .orElseThrow(() -> new RuntimeException("Ministry not found"));
        activity.setMinistry(ministry);

        // Remove general/eventType handling
        activity.setEventType(null);
    }

    public ActivityDTO rescheduleActivity(Integer id, ActivityDTO dto) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        if (dto.getDate() != null && !dto.getDate().isBlank())
            activity.setDate(LocalDate.parse(dto.getDate()));
        if (dto.getTime() != null && !dto.getTime().isBlank())
            activity.setTime(LocalTime.parse(dto.getTime()));
        activity.setStatus(Activity.ActivityStatus.RESCHEDULED);
        return new ActivityDTO(activityRepository.save(activity));
    }

    public void deleteActivity(Integer id) {
        activityRepository.deleteById(id);
    }

    // -------------------------
    // New: Mark activity as completed
    // -------------------------
    public void markCompleted(Integer activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        activity.setCompleted(true); // also sets status to COMPLETED
        activityRepository.save(activity);
    }
}
