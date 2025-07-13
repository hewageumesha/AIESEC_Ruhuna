package com.aiesec.controller.event;

import com.aiesec.dto.MerchandiseDTO;
import com.aiesec.service.interfaces.MerchandiseService;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merchandise")
public class MerchandiseController {

    private final MerchandiseService merchandiseService;
    @Autowired
    public MerchandiseController(MerchandiseService merchandiseService) {
        this.merchandiseService = merchandiseService;
    }

    @PostMapping
    public ResponseEntity<MerchandiseDTO> create(@RequestBody MerchandiseDTO dto) {
        return ResponseEntity.ok(merchandiseService.createMerchandise(dto));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<MerchandiseDTO> getByEventId(@PathVariable Long eventId) {
        try {
            MerchandiseDTO dto = merchandiseService.getMerchandiseByEventId(eventId);
            return ResponseEntity.ok(dto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }



    @PutMapping("/{id}")
    public ResponseEntity<MerchandiseDTO> update(@PathVariable Long id, @RequestBody MerchandiseDTO dto) {
        return ResponseEntity.ok(merchandiseService.updateMerchandise(id, dto));
    }
}