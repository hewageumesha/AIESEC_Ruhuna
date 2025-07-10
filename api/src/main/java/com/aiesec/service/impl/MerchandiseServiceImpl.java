package com.aiesec.service.impl;

import com.aiesec.dto.MerchandiseDTO;
import com.aiesec.mapper.MerchandiseMapper;
import com.aiesec.model.event.Event;
import com.aiesec.model.event.Merchandise;

import com.aiesec.repository.event.EventRepository;
import com.aiesec.repository.event.MerchandiseRepository;
import com.aiesec.service.interfaces.MerchandiseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MerchandiseServiceImpl implements MerchandiseService {

    @Autowired
    private MerchandiseRepository merchandiseRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public MerchandiseDTO createMerchandise(MerchandiseDTO dto) {
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + dto.getEventId()));

        Merchandise saved = merchandiseRepository.save(
                MerchandiseMapper.toEntity(dto, event)
        );

        return MerchandiseMapper.toDTO(saved);
    }

    @Override
    public List<MerchandiseDTO> getMerchandiseByEventId(Long eventId) {
        return merchandiseRepository.findByEventEventId(eventId)
                .stream()
                .map(MerchandiseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteByEventId(Long eventId) {
        merchandiseRepository.deleteByEventEventId(eventId);
    }


}
