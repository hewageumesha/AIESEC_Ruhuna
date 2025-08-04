package com.aiesec.service.impl;


import com.aiesec.dto.GalleryDTO;
import com.aiesec.model.event.Event;
import com.aiesec.model.event.EventGallery;
import com.aiesec.mapper.GalleryMapper;
import com.aiesec.repository.event.EventRepository;
import com.aiesec.repository.event.GalleryRepository;
import com.aiesec.service.interfaces.GalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GalleryServiceimpl implements GalleryService {

    @Autowired
    private GalleryRepository galleryRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public GalleryDTO uploadGalleryImage(GalleryDTO dto) {
        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventGallery gallery = GalleryMapper.toEntity(dto, event);
        return GalleryMapper.toDTO(galleryRepository.save(gallery));
    }

    @Override
    public List<GalleryDTO> getAllGalleryImages() {
        return galleryRepository.findAll().stream()
                .map(GalleryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<GalleryDTO> getGalleryImagesByEventId(Long eventId) {
        return galleryRepository.findByEvent_EventId(eventId).stream()
                .map(GalleryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteGalleryImage(Long id) {
        galleryRepository.deleteById(id);
    }
}
