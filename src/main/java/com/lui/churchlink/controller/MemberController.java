package com.lui.churchlink.controller;

import com.lui.churchlink.dto.MemberDTO;
import com.lui.churchlink.model.Member;
import com.lui.churchlink.service.MemberService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<Member>> getAll() {
        return ResponseEntity.ok(memberService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getOne(@PathVariable int id) {
        return ResponseEntity.ok(memberService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Member> create(@RequestBody MemberDTO dto) {
        return ResponseEntity.ok(memberService.save(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> update(@PathVariable int id, @RequestBody MemberDTO dto) {
        return ResponseEntity.ok(memberService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        memberService.delete(id);
        return ResponseEntity.noContent().build();
    }
}