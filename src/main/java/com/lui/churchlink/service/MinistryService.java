package com.lui.churchlink.service;

import com.lui.churchlink.model.Ministry;
import com.lui.churchlink.model.User;
import com.lui.churchlink.repository.MinistryRepository;
import com.lui.churchlink.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MinistryService {

    private final MinistryRepository ministryRepository;
    private final UserRepository userRepository;

    public MinistryService(MinistryRepository ministryRepository, UserRepository userRepository) {
        this.ministryRepository = ministryRepository;
        this.userRepository = userRepository;
    }

    public List<Ministry> findAll() {
        return ministryRepository.findAll();
    }

    public Ministry findById(int id) {
        return ministryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ministry not found"));
    }

    public Ministry save(Ministry ministry) {
        return ministryRepository.save(ministry);
    }

    // ✅ Updated to accept (id, Ministry entity)
    public Ministry update(int id, Ministry ministryDetails) {
        Ministry ministry = ministryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ministry not found"));

        ministry.setMinistry(ministryDetails.getMinistry());

        // Set leader if provided
        if (ministryDetails.getLeader() != null) {
            User leader = userRepository.findById(ministryDetails.getLeader().getUserId())
                    .orElseThrow(() -> new RuntimeException("Leader not found"));
            ministry.setLeader(leader);
        }

        return ministryRepository.save(ministry);
    }

    public void delete(int id) {
        ministryRepository.deleteById(id);
    }
}
