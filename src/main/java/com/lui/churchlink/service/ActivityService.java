package com.lui.churchlink.service;

import com.lui.churchlink.dto.ActivityDTO;
import com.lui.churchlink.model.Activity;
import com.lui.churchlink.model.Ministry;
import com.lui.churchlink.repository.ActivityRepository;
import com.lui.churchlink.repository.MinistryRepository;
import org.springframework.stereotype.Service;

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

    public ActivityDTO saveActivity(Activity activity) {
        if (activity.getMinistry() != null) {
            Integer ministryId = activity.getMinistry().getMinistryId();
            if (ministryId != null) {
                Ministry ministry = ministryRepository.findById(ministryId)
                        .orElseThrow(() -> new RuntimeException("Ministry not found"));
                activity.setMinistry(ministry);
            }
        }
        Activity saved = activityRepository.save(activity);
        return new ActivityDTO(saved);
    }

    public ActivityDTO updateActivity(ActivityDTO dto) {
        Activity activity = activityRepository.findById(dto.getActivityId())
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        activity.setActivity(dto.getActivity());
        if (dto.getDate() != null) activity.setDate(dto.getDate());
        if (dto.getTime() != null) activity.setTime(dto.getTime());
        activity.setPlace(dto.getPlace());

        if (dto.getMinistryId() != null) {
            Ministry ministry = ministryRepository.findById(dto.getMinistryId())
                    .orElseThrow(() -> new RuntimeException("Ministry not found"));
            activity.setMinistry(ministry);
        }

        Activity updated = activityRepository.save(activity);
        return new ActivityDTO(updated);
    }

    public void deleteActivity(Integer id) {
        activityRepository.deleteById(id);
    }
}
