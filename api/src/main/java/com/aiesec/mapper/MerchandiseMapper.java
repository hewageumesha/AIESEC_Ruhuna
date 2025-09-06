package com.aiesec.mapper;

import com.aiesec.dto.MerchandiseDTO;
import com.aiesec.model.event.Event;
import com.aiesec.model.event.Merchandise;
import org.springframework.stereotype.Component;

@Component
public class MerchandiseMapper {

    // Convert from Entity to DTO
    public static MerchandiseDTO toDTO(Merchandise merchandise) {
        if (merchandise == null) return null;

        return MerchandiseDTO.builder()
                .id(merchandise.getId())
                .available(merchandise.isAvailable())
                .description(merchandise.getDescription())
                .imageUrls(merchandise.getImageUrls())
                .eventId(merchandise.getEvent() != null ? merchandise.getEvent().getEventId() : null)
                .build();
    }

    // Convert from DTO to Entity
    public static Merchandise toEntity(MerchandiseDTO dto, Event event) {
        if (dto == null || event == null) return null;

        return Merchandise.builder()
                .id(dto.getId())
                .available(dto.isAvailable())
                .description(dto.getDescription())
                .imageUrls(dto.getImageUrls())
                .event(event)
                .build();
    }
}
