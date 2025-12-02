package com.lui.churchlink.service;

import com.lui.churchlink.dto.MemberDTO;
import com.lui.churchlink.exception.ResourceNotFoundException;
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

    // Get all members
    public List<Member> findAll() {
        return memberRepository.findAll();
    }

    // Find member by ID
    public Member findById(int id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
    }

    // Save new member
    public Member save(MemberDTO memberDTO) {
        Member member = new Member();
        member.setFirstName(memberDTO.getFirstName());
        member.setMiddleName(memberDTO.getMiddleName());
        member.setLastName(memberDTO.getLastName());
        member.setDob(memberDTO.getDob());
        member.setGender(memberDTO.getGender());
        member.setAddress(memberDTO.getAddress());

        Ministry ministry = ministryRepository.findById(memberDTO.getMinistryId())
                .orElseThrow(() -> new ResourceNotFoundException("Ministry not found with id: " + memberDTO.getMinistryId()));
        member.setMinistry(ministry);

        return memberRepository.save(member);
    }

    // Update existing member
    public Member updateMember(Member member, MemberDTO memberDTO) {
        member.setFirstName(memberDTO.getFirstName());
        member.setMiddleName(memberDTO.getMiddleName());
        member.setLastName(memberDTO.getLastName());
        member.setDob(memberDTO.getDob());
        member.setGender(memberDTO.getGender());
        member.setAddress(memberDTO.getAddress());

        Ministry ministry = ministryRepository.findById(memberDTO.getMinistryId())
                .orElseThrow(() -> new ResourceNotFoundException("Ministry not found with id: " + memberDTO.getMinistryId()));
        member.setMinistry(ministry);

        return memberRepository.save(member);
    }

    // Delete member by ID
    public void deleteMember(int id) {
        if (!memberRepository.existsById(id)) {
            throw new ResourceNotFoundException("Member not found with id: " + id);
        }
        memberRepository.deleteById(id);
    }
}
