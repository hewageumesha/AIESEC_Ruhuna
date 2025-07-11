package com.aiesec.controller.event;


import com.aiesec.dto.GuestUserDTO; 
import com.aiesec.service.interfaces.GuestUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guest-users")

public class GuestUserController {

    private final GuestUserService service;

    public GuestUserController(GuestUserService service) {
        this.service = service;
    }


    // Create a new guest user
    @PostMapping
    public ResponseEntity<GuestUserDTO> create(@RequestBody GuestUserDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createGuestUser(dto));
    }

    // Get a guest user by ID
    @GetMapping("/{id}")
    public ResponseEntity<GuestUserDTO> get(@PathVariable Long id) {
        GuestUserDTO guestUser = service.getGuestUserById(id);
        if (guestUser != null) {
            return ResponseEntity.ok(guestUser);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Return 404 if guest user not found
        }
    }

    // Update an existing guest user
    @PutMapping("/{id}")
    public ResponseEntity<GuestUserDTO> update(@PathVariable Long id, @RequestBody GuestUserDTO guestUserDTO) {
        GuestUserDTO updatedGuestUser = service.updateGuestUser(id, guestUserDTO);
        if (updatedGuestUser != null) {
            return ResponseEntity.ok(updatedGuestUser);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Return 404 if guest user not found
        }
    }

    // Delete a guest user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteGuestUser(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // Return 204 for successful deletion
    }

    // Get all guest users
    @GetMapping
    public ResponseEntity<List<GuestUserDTO>> getAll() {
        List<GuestUserDTO> guestUsers = service.getAllGuestUsers();
        return ResponseEntity.ok(guestUsers);
    }
}

