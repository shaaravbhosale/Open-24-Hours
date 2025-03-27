package com.open24hours.app.repository;

import com.open24hours.app.repository.dto.PersonDto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<PersonDto, Integer> {
}
