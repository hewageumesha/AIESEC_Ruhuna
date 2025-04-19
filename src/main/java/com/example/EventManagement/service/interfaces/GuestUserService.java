package com.example.EventManagement.service.interfaces;

import com.example.EventManagement.dto.GuestUserDTO;

import java.util.List;

public interface GuestUserService {
    GuestUserDTO createGuestUser(GuestUserDTO guestUserDTO);

    GuestUserDTO updateGuestUser(Long guestId, GuestUserDTO guestUserDTO);

    void deleteGuestUser(Long guestId);

    GuestUserDTO getGuestUserById(Long guestId);

    List<GuestUserDTO> getAllGuestUsers();
}
