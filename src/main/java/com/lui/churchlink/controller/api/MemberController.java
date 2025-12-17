package com.lui.churchlink.controller.api;

import com.lui.churchlink.dto.MemberDTO;
import com.lui.churchlink.service.MemberService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // All members, including archived
    @GetMapping
    public List<MemberDTO> getAllMembers() {
        return memberService.getAllMembers();
    }

    // Only active (not archived) members
    @GetMapping("/active")
    public List<MemberDTO> getActiveMembers() {
        return memberService.getActiveMembers();
    }

    @GetMapping("/{id}")
    public MemberDTO getMemberById(@PathVariable int id) {
        return new MemberDTO(memberService.getMemberById(id));
    }

    @PostMapping
    public MemberDTO saveMember(@RequestBody MemberDTO dto) {
        return memberService.saveMember(dto);
    }

    @PutMapping("/{id}")
    public MemberDTO updateMember(@PathVariable int id, @RequestBody MemberDTO dto) {
        return memberService.updateMember(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteMember(@PathVariable int id) {
        memberService.deleteMember(id);
    }

    @PutMapping("/{id}/archive")
    public MemberDTO archiveMember(@PathVariable int id) {
        return memberService.archiveMember(id);
    }

    @PutMapping("/{id}/recover")
    public MemberDTO recoverMember(@PathVariable int id) {
        return memberService.recoverMember(id);
    }
}
