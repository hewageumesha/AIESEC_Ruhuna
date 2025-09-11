package com.aiesec.mapper;

import com.aiesec.dto.EventCategoryDTO;

import com.aiesec.model.event.EventCategory;



import java.util.stream.Collectors;

public class EventCategoryMapper {

    public static EventCategoryDTO toDTO(EventCategory category) {
        return EventCategoryDTO.builder()
                .id(category.getId())
                .categoryName(category.getCategoryName())
                .isAnnual(category.getIsAnnual())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .eventVersions(category.getEventVersions() != null ?
                        category.getEventVersions().stream()
                                .map(EventVersionMapper::toDTO)
                                .collect(Collectors.toList()) : null)
                .build();
    }

    public static EventCategory toEntity(EventCategoryDTO dto) {
        return EventCategory.builder()
                .id(dto.getId())
                .categoryName(dto.getCategoryName())
                .isAnnual(dto.getIsAnnual())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();
    }
}