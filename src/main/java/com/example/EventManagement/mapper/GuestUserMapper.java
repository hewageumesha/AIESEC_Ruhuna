package com.example.EventManagement.mapper;

import com.example.EventManagement.dto.GuestUserDTO;
import com.example.EventManagement.entity.GuestUser;

public class GuestUserMapper {

    public static GuestUserDTO toDTO(GuestUser guestUser) {
        return GuestUserDTO.builder()
                .guestUserId(guestUser.getGuestUserId())
                .fullName(guestUser.getFullName())
                .email(guestUser.getEmail())
                .contactNumber(guestUser.getContactNumber())
                .build();
    }

    public static GuestUser toEntity(GuestUserDTO dto) {
        return GuestUser.builder()
                .guestUserId(dto.getGuestUserId())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .contactNumber(dto.getContactNumber())
                .build();
    }
}
