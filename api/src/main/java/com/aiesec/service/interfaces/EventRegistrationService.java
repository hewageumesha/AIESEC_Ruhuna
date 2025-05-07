package com.aiesec.service.interfaces;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;
import com.aiesec.dto.GuestEventRegistrationDTO;

public interface EventRegistrationService {
    void registerMember(AiesecMemberEventRegistrationDTO dto);
    void registerGuest(GuestEventRegistrationDTO dto);


}