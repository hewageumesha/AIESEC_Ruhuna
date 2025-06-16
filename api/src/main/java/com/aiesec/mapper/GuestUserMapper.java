package com.aiesec.mapper;



import com.aiesec.dto.GuestUserDTO;
import com.aiesec.model.event.GuestUser;

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

