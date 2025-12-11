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

    @GetMapping
    public List<MemberDTO> getAll() {
        return memberService.getAllMembers();
    }

    @PostMapping
    public MemberDTO create(@RequestBody MemberDTO dto) {
        return memberService.saveMember(dto);
    }

    @PutMapping("/{id}")
    public MemberDTO update(@PathVariable int id, @RequestBody MemberDTO dto) {
        return memberService.updateMember(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        memberService.deleteMember(id);
    }
}
