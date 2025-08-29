package com.aiesec.mapper;

import com.aiesec.dto.EventVersionDTO;
import com.aiesec.model.event.EventCategory;
import com.aiesec.model.event.EventVersion;

public class EventVersionMapper {

    public static EventVersionDTO toDTO(EventVersion version) {
        return EventVersionDTO.builder()
                .id(version.getId())
                .versionName(version.getVersionName())
                .eventDate(version.getEventDate())
                .description(version.getDescription())
                .isActive(version.getIsActive())
                .categoryId(version.getEventCategory() != null ? version.getEventCategory().getId() : null)
                .categoryName(version.getEventCategory() != null ? version.getEventCategory().getCategoryName() : null)
                .createdAt(version.getCreatedAt())
                .updatedAt(version.getUpdatedAt())
                .build();
    }

    public static EventVersion toEntity(EventVersionDTO dto, EventCategory category) {
        return EventVersion.builder()
                .id(dto.getId())
                .versionName(dto.getVersionName())
                .eventDate(dto.getEventDate())
                .description(dto.getDescription())
                .isActive(dto.getIsActive())
                .eventCategory(category)
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();
    }
}
