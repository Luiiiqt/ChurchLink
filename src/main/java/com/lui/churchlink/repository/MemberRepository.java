package com.lui.churchlink.repository;

import com.lui.churchlink.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Integer> {

    // Fetch all members by ministry ID
    List<Member> findByMinistry_MinistryId(Integer ministryId);
}
