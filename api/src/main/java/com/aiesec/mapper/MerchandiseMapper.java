package com.aiesec.mapper;

import com.aiesec.dto.MerchandiseDTO;
import com.aiesec.model.event.Event;
import com.aiesec.model.event.Merchandise;

public class MerchandiseMapper {
    public static Merchandise toEntity(MerchandiseDTO dto, Event event) {
        return Merchandise.builder()
                .merchandiseId(dto.getMerchandiseId())
                .type(dto.getType())
                .description(dto.getDescription())
                .images(dto.getImages())
                .available(dto.isAvailable())
                .event(event)
                .build();
    }

    public static MerchandiseDTO toDTO(Merchandise merchandise) {
        return MerchandiseDTO.builder()
                .merchandiseId(merchandise.getMerchandiseId())
                .eventId(merchandise.getEvent().getEventId())
                .type(merchandise.getType())
                .description(merchandise.getDescription())
                .images(merchandise.getImages())
                .available(merchandise.isAvailable())
                .build();
    }
}
