package com.aiesec.service.interfaces;

import com.aiesec.dto.MerchandiseDTO;

import java.util.List;

public interface MerchandiseService {
    MerchandiseDTO createMerchandise(MerchandiseDTO dto);
    List<MerchandiseDTO> getMerchandiseByEventId(Long eventId);


    void deleteByEventId(Long eventId);
}
