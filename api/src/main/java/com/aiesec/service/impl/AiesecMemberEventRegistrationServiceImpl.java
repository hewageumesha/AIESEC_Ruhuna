package com.aiesec.service.impl;

import com.aiesec.dto.AiesecMemberEventRegistrationDTO;
import com.aiesec.mapper.AiesecMemberEventRegistrationMapper;
import com.aiesec.model.event.AiesecMemberEventRegistration;
import com.aiesec.repository.event.AiesecMemberEventRegistrationRepository;
import com.aiesec.service.interfaces.AiesecMemberEventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiesecMemberEventRegistrationServiceImpl implements AiesecMemberEventRegistrationService {

    private final AiesecMemberEventRegistrationRepository registrationRepository;

    @Override
    public AiesecMemberEventRegistrationDTO register(AiesecMemberEventRegistrationDTO dto) {
        if (registrationRepository.existsByUserIdAndEventId(dto.getUserId(), dto.getEventId())) {
            throw new IllegalStateException("User with ID " + dto.getUserId() + " is already registered for event ID " + dto.getEventId());
        }

        AiesecMemberEventRegistration entity = AiesecMemberEventRegistrationMapper.toEntity(dto);
        AiesecMemberEventRegistration saved = registrationRepository.save(entity);
        return AiesecMemberEventRegistrationMapper.toDTO(saved);
    }

    @Override
    public List<AiesecMemberEventRegistrationDTO> getByUserIdAndEventId(Long userId, Long eventId) {
        return registrationRepository.findByUserIdAndEventId(userId, eventId)
                .stream()
                .map(AiesecMemberEventRegistrationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean alreadyRegistered(Long userId, Long eventId) {
        return registrationRepository.existsByUserIdAndEventId(userId, eventId);
    }
}
