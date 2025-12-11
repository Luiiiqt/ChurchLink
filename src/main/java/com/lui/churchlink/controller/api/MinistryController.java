package com.lui.churchlink.controller.api;

import com.lui.churchlink.dto.MinistryDTO;
import com.lui.churchlink.service.MinistryService;
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
    public List<MinistryDTO> getAll() {
        return ministryService.getAllMinistries();
    }

    @PostMapping
    public MinistryDTO create(@RequestBody MinistryDTO dto) {
        return ministryService.createMinistry(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        ministryService.deleteMinistry(id);
    }
}
