package com.lui.churchlink.controller;

import com.lui.churchlink.model.Activity;
import com.lui.churchlink.service.ActivityService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<Activity>> getAll() {
        return ResponseEntity.ok(activityService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getOne(@PathVariable int id) {
        return ResponseEntity.ok(activityService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Activity> create(@RequestBody Activity activity) {
        return ResponseEntity.ok(activityService.save(activity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Activity> update(@PathVariable int id, @RequestBody Activity activity) {
        return ResponseEntity.ok(activityService.update(id, activity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        activityService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
