package com.lui.churchlink.service;

import com.lui.churchlink.dto.MemberDTO;
import com.lui.churchlink.model.Member;
import com.lui.churchlink.model.Ministry;
import com.lui.churchlink.repository.MemberRepository;
import com.lui.churchlink.repository.MinistryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final MinistryRepository ministryRepository;

    public MemberService(MemberRepository memberRepository, MinistryRepository ministryRepository) {
        this.memberRepository = memberRepository;
        this.ministryRepository = ministryRepository;
    }

    public List<Member> findAll() {
        return memberRepository.findAll();
    }

    public Member findById(int id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    public Member save(MemberDTO dto) {
        Member member = new Member();
        member.setFirstName(dto.getFirstName());
        member.setMiddleName(dto.getMiddleName());
        member.setLastName(dto.getLastName());
        member.setDob(dto.getDob());
        member.setGender(dto.getGender());
        member.setAddress(dto.getAddress());

        Ministry ministry = ministryRepository.findById(dto.getMinistryId())
                .orElseThrow(() -> new RuntimeException("Ministry not found"));
        member.setMinistry(ministry);

        return memberRepository.save(member);
    }

    // ✅ Updated to accept ID + DTO
    public Member update(int id, MemberDTO dto) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        member.setFirstName(dto.getFirstName());
        member.setMiddleName(dto.getMiddleName());
        member.setLastName(dto.getLastName());
        member.setDob(dto.getDob());
        member.setGender(dto.getGender());
        member.setAddress(dto.getAddress());

        Ministry ministry = ministryRepository.findById(dto.getMinistryId())
                .orElseThrow(() -> new RuntimeException("Ministry not found"));
        member.setMinistry(ministry);

        return memberRepository.save(member);
    }

    public void delete(int id) {
        memberRepository.deleteById(id);
    }
}