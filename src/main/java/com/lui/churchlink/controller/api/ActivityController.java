package com.lui.churchlink.controller.api;

import com.lui.churchlink.dto.ActivityDTO;
import com.lui.churchlink.model.Activity;
import com.lui.churchlink.service.ActivityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public List<ActivityDTO> getAll() {
        return activityService.getAllActivities();
    }

    @PostMapping
    public ActivityDTO create(@RequestBody Activity activity) {
        return activityService.saveActivity(activity);
    }

    @PutMapping("/{id}")
    public ActivityDTO update(@PathVariable int id, @RequestBody ActivityDTO dto) {
        dto.setActivityId(id);
        return activityService.updateActivity(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        activityService.deleteActivity(id);
    }
}
