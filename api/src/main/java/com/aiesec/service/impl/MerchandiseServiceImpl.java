package com.aiesec.service.impl;

import com.aiesec.dto.MerchandiseDTO;
import com.aiesec.mapper.MerchandiseMapper;
import com.aiesec.model.event.Event;
import com.aiesec.model.event.Merchandise;
import com.aiesec.repository.event.EventRepository;
import com.aiesec.repository.event.MerchandiseRepository;
import com.aiesec.service.interfaces.MerchandiseService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MerchandiseServiceImpl implements MerchandiseService {

    private final MerchandiseRepository merchandiseRepository;
    private final EventRepository eventRepository;
    private final MerchandiseMapper mapper;

    @Override
    public MerchandiseDTO createMerchandise(MerchandiseDTO dto) {
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        Merchandise merchandise = mapper.toEntity(dto, event);
        return mapper.toDTO(merchandiseRepository.save(merchandise));
    }

    @Override
    public MerchandiseDTO getMerchandiseByEventId(Long eventId) {
        Merchandise merchandise = merchandiseRepository.findByEventEventId(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Merchandise not found for event ID: " + eventId));

        return mapper.toDTO(merchandise); // Will include images + description in DTO
    }

    @Override
    public MerchandiseDTO updateMerchandise(Long id, MerchandiseDTO dto) {
        Merchandise existing = merchandiseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Merchandise not found"));

        existing.setAvailable(dto.isAvailable());
        existing.setDescription(dto.getDescription());
        existing.setImageUrls(dto.getImageUrls());

        return mapper.toDTO(merchandiseRepository.save(existing));
    }
}
