package com.aiesec.controller.event;

import com.aiesec.dto.MerchandiseDTO;

import com.aiesec.service.interfaces.MerchandiseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merchandise")
@CrossOrigin(origins = "*")
public class MerchandiseController {

    @Autowired
    private MerchandiseService merchandiseService;

    @PostMapping
    public MerchandiseDTO createMerchandise(@RequestBody MerchandiseDTO dto) {
        return merchandiseService.createMerchandise(dto);
    }

    @GetMapping("/event/{eventId}")
    public List<MerchandiseDTO> getMerchandiseByEventId(@PathVariable Long eventId) {
        return merchandiseService.getMerchandiseByEventId(eventId);
    }

    @DeleteMapping("/event/{eventId}")
    public void deleteMerchandiseByEventId(@PathVariable Long eventId) {
        merchandiseService.deleteByEventId(eventId);
    }


}
