package com.example.EventManagement.service.impl;

import com.example.EventManagement.dto.EventExperienceDTO;
import com.example.EventManagement.entity.EventExperience;
import com.example.EventManagement.mapper.EventExperienceMapper;
import com.example.EventManagement.repository.EventExperienceRepository;
import com.example.EventManagement.service.interfaces.EventExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventExperienceServiceImpl implements EventExperienceService {

    private EventExperienceRepository repository;

    @Override
    public EventExperienceDTO createExperience(EventExperienceDTO experienceDTO) {
        return saveExperience(experienceDTO);
    }

    @Override
    public EventExperienceDTO addExperience(EventExperienceDTO experienceDTO) {
        return saveExperience(experienceDTO);
    }

    @Override
    public EventExperienceDTO updateExperience(Long id, EventExperienceDTO experienceDTO) {
        Optional<EventExperience> existing = repository.findById(id);
        if (existing.isPresent()) {
            EventExperience updated = EventExperienceMapper.toEntity(experienceDTO);
            updated.setExperienceId(id);
            return EventExperienceMapper.toDTO(repository.save(updated));
        }
        return null; // or throw custom exception
    }

    @Override
    public void deleteExperience(Long id) {
        repository.deleteById(id);
    }

    @Override
    public EventExperienceDTO getExperienceById(Long id) {
        Optional<EventExperience> experience = repository.findById(id);
        return experience.map(EventExperienceMapper::toDTO).orElse(null);
    }

    @Override
    public EventExperienceDTO saveExperience(EventExperienceDTO experienceDTO) {
        EventExperience experience = EventExperienceMapper.toEntity(experienceDTO);
        return EventExperienceMapper.toDTO(repository.save(experience));
    }



    @Override
    public EventExperienceDTO shareExperience(EventExperienceDTO dto) {
        return saveExperience(dto);
    }

    @Override
    public List<EventExperienceDTO> getExperiencesByEventId(Long eventId) {
        return repository.findByEvent_EventId(eventId)
                .stream()
                .map(EventExperienceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventExperienceDTO> getExperiencesByUserId(Long userId) {
        return repository.findByUser_UserId(userId)
                .stream()
                .map(EventExperienceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EventExperience> getAllExperiences() {
        return repository.findAll();
    }
}
