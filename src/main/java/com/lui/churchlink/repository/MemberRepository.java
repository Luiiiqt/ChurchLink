package com.lui.churchlink.repository;

import com.lui.churchlink.dto.MemberMinistryResponse;
import com.lui.churchlink.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Integer> {

    @Query("""
        SELECT new com.lui.churchlink.dto.MemberMinistryResponse(
            m.memberId, m.firstName, m.middleName, m.lastName,
            m.dob, m.gender, m.address,
            min.ministryId, min.ministry
        )
        FROM Member m
        LEFT JOIN m.ministry min
    """)
    List<MemberMinistryResponse> getMembersWithMinistry();

    @Query("""
        SELECT new com.lui.churchlink.dto.MemberMinistryResponse(
            m.memberId, m.firstName, m.middleName, m.lastName,
            m.dob, m.gender, m.address,
            min.ministryId, min.ministry
        )
        FROM Member m
        LEFT JOIN m.ministry min
        WHERE min.ministryId = :ministryId
    """)
    List<MemberMinistryResponse> getMembersByMinistryId(@Param("ministryId") Integer ministryId);
}
