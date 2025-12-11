package com.lui.churchlink.repository;

import com.lui.churchlink.model.Ministry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MinistryRepository extends JpaRepository<Ministry, Integer> {
    Optional<Ministry> findByMinistry(String ministryName);
}
