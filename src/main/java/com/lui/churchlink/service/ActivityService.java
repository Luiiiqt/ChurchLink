package com.lui.churchlink.service;

import com.lui.churchlink.model.Activity;
import com.lui.churchlink.repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public List<Activity> findAll() {
        return activityRepository.findAll();
    }

    public Activity findById(int id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found with id " + id));
    }

    public Activity save(Activity activity) {
        return activityRepository.save(activity);
    }

    public Activity update(int id, Activity activity) {
        Activity existing = findById(id);
        existing.setActivity(activity.getActivity());
        existing.setDate(activity.getDate());
        existing.setPlace(activity.getPlace());
        existing.setTime(activity.getTime());
        existing.setMinistry(activity.getMinistry());
        return activityRepository.save(existing);
    }

    public void delete(int id) {
        activityRepository.deleteById(id);
    }
}
