package com.aiesec.service.interfaces;


import com.aiesec.dto.EventExperienceDTO;
import com.aiesec.model.event.EventExperience;

import java.util.List;

public interface EventExperienceService {

    EventExperienceDTO createExperience(EventExperienceDTO experienceDTO);

    EventExperienceDTO addExperience(EventExperienceDTO eventExperienceDTO);

    EventExperienceDTO updateExperience(Long id, EventExperienceDTO experienceDTO);

    void deleteExperience(Long id);

    EventExperienceDTO getExperienceById(Long id);


    EventExperienceDTO saveExperience(EventExperienceDTO experienceDTO);

    EventExperienceDTO shareExperience(EventExperienceDTO dto);

    List<EventExperienceDTO> getExperiencesByEventId(Long eventId);

    List<EventExperienceDTO> getExperiencesByUserId(Long userId);
    List<EventExperience> getAllExperiences();
}
