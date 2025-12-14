package com.lui.churchlink.controller.api;

import com.lui.churchlink.dto.ActivityDTO;
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
    public ActivityDTO create(@RequestBody ActivityDTO dto) {
        return activityService.saveActivity(dto);
    }

    @PutMapping("/{id}")
    public ActivityDTO update(@PathVariable int id, @RequestBody ActivityDTO dto) {
        dto.setActivityId(id);
        return activityService.updateActivity(dto);
    }

    @PutMapping("/{id}/reschedule")
    public ActivityDTO reschedule(@PathVariable int id, @RequestBody ActivityDTO dto) {
        return activityService.rescheduleActivity(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        activityService.deleteActivity(id);
    }
}
