package com.lui.churchlink.service;

import com.lui.churchlink.dto.MemberDTO;
import com.lui.churchlink.model.Member;
import com.lui.churchlink.model.Ministry;
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
                .map(MemberDTO::new) // converts Member → MemberDTO including ministryName
                .collect(Collectors.toList());
    }

    @Transactional
    public MemberDTO saveMember(MemberDTO dto) {
        Member member = new Member();
        mapDtoToEntity(dto, member);
        Member saved = memberRepository.save(member);
        return new MemberDTO(saved);
    }

    @Transactional
    public MemberDTO updateMember(int id, MemberDTO dto) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        mapDtoToEntity(dto, member);
        Member updated = memberRepository.save(member);
        return new MemberDTO(updated);
    }

    private void mapDtoToEntity(MemberDTO dto, Member member) {
        member.setFirstName(dto.getFirstName());
        member.setMiddleName(dto.getMiddleName());
        member.setLastName(dto.getLastName());

        // Parse String to LocalDate
        if (dto.getDob() != null && !dto.getDob().isEmpty()) {
            member.setDob(LocalDate.parse(dto.getDob()));
        } else {
            member.setDob(null);
        }

        member.setGender(dto.getGender());
        member.setAddress(dto.getAddress());

        // Map ministryId to Ministry entity
        if (dto.getMinistryId() != null) {
            Ministry ministry = ministryRepository.findById(dto.getMinistryId())
                    .orElseThrow(() -> new RuntimeException("Ministry not found"));
            member.setMinistry(ministry);
        } else {
            member.setMinistry(null);
        }
    }

    public void deleteMember(int id) {
        memberRepository.deleteById(id);
    }
}
