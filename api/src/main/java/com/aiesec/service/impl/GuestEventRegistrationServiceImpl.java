package com.aiesec.service.impl;

import com.aiesec.dto.GuestEventRegistrationDTO;
import com.aiesec.mapper.GuestEventRegistrationMapper;
import com.aiesec.model.event.GuestEventRegistration;
import com.aiesec.repository.event.GuestEventRegistrationRepository;
import com.aiesec.service.interfaces.GuestEventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


    @Service
    @RequiredArgsConstructor
    public class GuestEventRegistrationServiceImpl implements GuestEventRegistrationService {

        private final GuestEventRegistrationRepository registrationRepository;

        @Override
        public GuestEventRegistrationDTO register(GuestEventRegistrationDTO dto) {
            GuestEventRegistration entity = GuestEventRegistrationMapper.toEntity(dto);
            GuestEventRegistration saved = registrationRepository.save(entity);
            return GuestEventRegistrationMapper.toDTO(saved);
        }

        @Override
        public List<GuestEventRegistrationDTO> getAllByEventId(Long eventId) {
            return registrationRepository.findByEventId(eventId)
                    .stream()
                    .map(GuestEventRegistrationMapper::toDTO)
                    .collect(Collectors.toList());
        }
    }

