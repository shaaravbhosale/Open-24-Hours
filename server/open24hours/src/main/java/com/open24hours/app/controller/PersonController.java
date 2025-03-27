package com.open24hours.app.controller;

import com.open24hours.app.repository.PersonRepository;
import com.open24hours.app.repository.dto.PersonDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/person")
public class PersonController {
    @Autowired
    PersonRepository personRepository;

    @GetMapping(path = "/allpeople")
    public List<PersonDto> getPersons() {
        return personRepository.findAll();
    }

    @PostMapping(path = "/save")
    public void setPersons(@RequestBody PersonDto person) {
        personRepository.save(person);
    }
    // post request (PostMapping)
    // pass in a personDto
    // call personRepository.save()
}
