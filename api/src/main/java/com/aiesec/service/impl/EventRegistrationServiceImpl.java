package com.aiesec.service.impl;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;
import com.aiesec.dto.GuestEventRegistrationDTO;
import com.aiesec.model.event.AiesecMemberEventRegistration;
import com.aiesec.model.event.GuestEventRegistration;
import com.aiesec.repository.event.AiesecMemberEventRegistrationRepository;
import com.aiesec.repository.event.GuestEventRegistrationRepository;
import com.aiesec.service.interfaces.EventRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventRegistrationServiceImpl implements EventRegistrationService {

    @Autowired
    private AiesecMemberEventRegistrationRepository memberRepo;

    @Autowired
    private GuestEventRegistrationRepository guestRepo;

    @Override
    public void registerMember(AiesecMemberEventRegistrationDTO dto) {
        AiesecMemberEventRegistration reg = new AiesecMemberEventRegistration();
        reg.setUserId(dto.getUserId());
        reg.setEventId(dto.getEventId());
        reg.setInterestStatus(dto.getInterestStatus());
        reg.setComment(dto.getComment());
        memberRepo.save(reg);
    }

    @Override
    public void registerGuest(GuestEventRegistrationDTO dto) {
        GuestEventRegistration reg = new GuestEventRegistration();
        reg.setEventId(dto.getEventId());
        reg.setGuestName(dto.getName());
        reg.setEmail(dto.getEmail());
        reg.setPhone(dto.getPhone());
        reg.setInterestStatus(dto.getInterestStatus());
        reg.setComment(dto.getComment());
        guestRepo.save(reg);
    }
}
