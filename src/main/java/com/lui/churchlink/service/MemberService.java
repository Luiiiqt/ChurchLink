package com.lui.churchlink.service;

import com.lui.churchlink.dto.MemberDTO;
import com.lui.churchlink.model.Member;
import com.lui.churchlink.model.Ministry;
import com.lui.churchlink.repository.MemberRepository;
import com.lui.churchlink.repository.MinistryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final MinistryRepository ministryRepository;

    public MemberService(MemberRepository memberRepository, MinistryRepository ministryRepository) {
        this.memberRepository = memberRepository;
        this.ministryRepository = ministryRepository;
    }

    public List<MemberDTO> getAllMembers() {
        return memberRepository.findAll()
                .stream()
                .map(MemberDTO::new)
                .collect(Collectors.toList());
    }

    public MemberDTO saveMember(MemberDTO dto) {
        Member member = new Member();
        member.setFirstName(dto.getFirstName());
        member.setMiddleName(dto.getMiddleName());
        member.setLastName(dto.getLastName());
        member.setDob(dto.getDob());
        member.setGender(dto.getGender());
        member.setAddress(dto.getAddress());

        if (dto.getMinistryId() != null) {
            Ministry ministry = ministryRepository.findById(dto.getMinistryId())
                    .orElseThrow(() -> new RuntimeException("Ministry not found"));
            member.setMinistry(ministry);
        }

        Member saved = memberRepository.save(member);
        return new MemberDTO(saved);
    }

    public MemberDTO updateMember(int id, MemberDTO dto) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        member.setFirstName(dto.getFirstName());
        member.setMiddleName(dto.getMiddleName());
        member.setLastName(dto.getLastName());
        member.setDob(dto.getDob());
        member.setGender(dto.getGender());
        member.setAddress(dto.getAddress());

        if (dto.getMinistryId() != null) {
            Ministry ministry = ministryRepository.findById(dto.getMinistryId())
                    .orElseThrow(() -> new RuntimeException("Ministry not found"));
            member.setMinistry(ministry);
        } else {
            member.setMinistry(null);
        }

        Member updated = memberRepository.save(member);
        return new MemberDTO(updated);
    }

    public void deleteMember(int id) {
        memberRepository.deleteById(id);
    }
}

