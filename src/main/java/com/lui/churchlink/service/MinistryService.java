package com.lui.churchlink.service;

import com.lui.churchlink.dto.MinistryDTO;
import com.lui.churchlink.model.Ministry;
import com.lui.churchlink.repository.MinistryRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MinistryService {

    private final MinistryRepository ministryRepository;

    public MinistryService(MinistryRepository ministryRepository) {
        this.ministryRepository = ministryRepository;
    }

    public List<MinistryDTO> getAllMinistries() {
        return ministryRepository.findAll()
                .stream()
                .map(MinistryDTO::new)
                .collect(Collectors.toList());
    }

    public MinistryDTO createMinistry(MinistryDTO dto) {
        Ministry ministry = new Ministry();
        ministry.setMinistry(dto.getMinistryName()); // <-- use getMinistryName()
        return new MinistryDTO(ministryRepository.save(ministry));
    }

    public void deleteMinistry(int id) {
        ministryRepository.deleteById(id);
    }
}
