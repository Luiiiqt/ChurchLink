package com.lui.churchlink.repository;

import com.lui.churchlink.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Integer> {

}
