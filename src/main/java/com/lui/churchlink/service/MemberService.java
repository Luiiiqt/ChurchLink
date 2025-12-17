package com.lui.churchlink.service;

import com.lui.churchlink.dto.MemberDTO;
import com.lui.churchlink.model.*;
import com.lui.churchlink.repository.MemberRepository;
import com.lui.churchlink.repository.MinistryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final MinistryRepository ministryRepository;

    public MemberService(MemberRepository memberRepository,
                         MinistryRepository ministryRepository) {
        this.memberRepository = memberRepository;
        this.ministryRepository = ministryRepository;
    }

    public List<MemberDTO> getAllMembers() {
        return memberRepository.findAll()
                .stream()
                .map(MemberDTO::new)
                .collect(Collectors.toList());
    }

    public List<MemberDTO> getActiveMembers() {
        return memberRepository.findAll()
                .stream()
                .filter(m -> !m.isArchived())
                .map(MemberDTO::new)
                .collect(Collectors.toList());
    }

    public Member getMemberById(int id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    @Transactional
    public MemberDTO saveMember(MemberDTO dto) {
        Member member = new Member();
        mapDtoToEntity(dto, member);
        return new MemberDTO(memberRepository.save(member));
    }

    @Transactional
    public MemberDTO updateMember(int id, MemberDTO dto) {
        Member member = getMemberById(id);
        mapDtoToEntity(dto, member);
        return new MemberDTO(memberRepository.save(member));
    }

    @Transactional
    public void deleteMember(int id) {
        memberRepository.deleteById(id);
    }

    @Transactional
    public MemberDTO archiveMember(int id) {
        Member member = getMemberById(id);
        member.setArchived(true);
        return new MemberDTO(memberRepository.save(member));
    }

    @Transactional
    public MemberDTO recoverMember(int id) {
        Member member = getMemberById(id);
        member.setArchived(false);
        return new MemberDTO(memberRepository.save(member));
    }

    private void mapDtoToEntity(MemberDTO dto, Member member) {

        member.setFirstName(dto.getFirstName());
        member.setMiddleName(dto.getMiddleName());
        member.setLastName(dto.getLastName());

        member.setDob(dto.getDob() != null && !dto.getDob().isEmpty()
                ? LocalDate.parse(dto.getDob())
                : null);

        member.setGender(dto.getGender());
        member.setAddress(dto.getAddress());

        member.setStatus(MemberStatus.valueOf(dto.getStatus().toUpperCase()));
        member.setRole(MemberRole.valueOf(dto.getRole().toUpperCase()));

        Ministry ministry = ministryRepository.findById(dto.getMinistryId())
                .orElseThrow(() -> new RuntimeException("Ministry not found"));
        member.setMinistry(ministry);
    }
}
