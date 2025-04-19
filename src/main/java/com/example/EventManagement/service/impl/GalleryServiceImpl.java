package com.example.EventManagement.service.impl;
import com.example.EventManagement.dto.GalleryDTO;
import com.example.EventManagement.entity.Event;
import com.example.EventManagement.entity.EventGallery;
import com.example.EventManagement.mapper.GalleryMapper;
import com.example.EventManagement.repository.EventRepository;
import com.example.EventManagement.repository.GalleryRepository;
import com.example.EventManagement.service.interfaces.GalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GalleryServiceImpl implements GalleryService {

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
