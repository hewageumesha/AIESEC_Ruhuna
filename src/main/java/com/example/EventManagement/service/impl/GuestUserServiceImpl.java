package com.example.EventManagement.service.impl;

import com.example.EventManagement.dto.GuestUserDTO;
import com.example.EventManagement.entity.GuestUser;
import com.example.EventManagement.repository.GuestUserRepository;
import com.example.EventManagement.service.interfaces.GuestUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class GuestUserServiceImpl implements GuestUserService {

    private final GuestUserRepository guestUserRepository;



    @Override
    public GuestUserDTO createGuestUser(GuestUserDTO dto) {
        GuestUser user = new GuestUser();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setContactNumber(dto.getContactNumber());
        return mapToDTO(guestUserRepository.save(user));
    }

    @Override
    public GuestUserDTO updateGuestUser(Long guestId, GuestUserDTO guestUserDTO) {
        GuestUser existingGuestUser = guestUserRepository.findById(guestId).orElse(null);
        if (existingGuestUser != null) {
            existingGuestUser.setFullName(guestUserDTO.getFullName());
            existingGuestUser.setEmail(guestUserDTO.getEmail());
            existingGuestUser.setContactNumber(guestUserDTO.getContactNumber());
            return mapToDTO(guestUserRepository.save(existingGuestUser));
        }
        return null; // or throw some exception if needed
    }

    @Override
    public void deleteGuestUser(Long guestId) {
        guestUserRepository.deleteById(guestId);
    }


    @Override
    public GuestUserDTO getGuestUserById(Long id) {
        return guestUserRepository.findById(id)
                .map(this::mapToDTO)
                .orElse(null);
    }

    @Override
    public List<GuestUserDTO> getAllGuestUsers() {
        List<GuestUser> guestUsers = guestUserRepository.findAll();
        return guestUsers.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }


    private GuestUserDTO mapToDTO(GuestUser guest) {
        GuestUserDTO dto = new GuestUserDTO();
        BeanUtils.copyProperties(guest, dto); // This copies the properties from GuestUser to GuestUserDTO
        return dto;
    }
}
