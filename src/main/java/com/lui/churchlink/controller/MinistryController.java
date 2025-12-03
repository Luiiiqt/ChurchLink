package com.lui.churchlink.controller;

import com.lui.churchlink.model.Ministry;
import com.lui.churchlink.service.MinistryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ministries")
public class MinistryController {

    private final MinistryService ministryService;

    public MinistryController(MinistryService ministryService) {
        this.ministryService = ministryService;
    }

    @GetMapping
    public ResponseEntity<List<Ministry>> getAll() {
        return ResponseEntity.ok(ministryService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ministry> getOne(@PathVariable int id) {
        return ResponseEntity.ok(ministryService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Ministry> create(@RequestBody Ministry ministry) {
        return ResponseEntity.ok(ministryService.save(ministry));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ministry> update(@PathVariable int id, @RequestBody Ministry ministry) {
        return ResponseEntity.ok(ministryService.update(id, ministry));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        ministryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
