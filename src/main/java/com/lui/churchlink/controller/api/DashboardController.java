package com.lui.churchlink.controller.api;

import org.springframework.web.bind.annotation.*;
import com.lui.churchlink.repository.MemberRepository;
import com.lui.churchlink.repository.MinistryRepository;
import org.springframework.stereotype.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final MemberRepository memberRepository;
    private final MinistryRepository ministryRepository;

    public DashboardController(MemberRepository memberRepository, MinistryRepository ministryRepository) {
        this.memberRepository = memberRepository;
        this.ministryRepository = ministryRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMembers", memberRepository.count());
        stats.put("totalMinistries", ministryRepository.count());
        return stats;
    }
}

