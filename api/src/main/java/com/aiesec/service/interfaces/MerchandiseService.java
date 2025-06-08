package com.aiesec.service.interfaces;

import com.aiesec.dto.MerchandiseDTO;

public interface MerchandiseService {
    MerchandiseDTO createMerchandise(MerchandiseDTO dto);
    MerchandiseDTO getMerchandiseByEventId(Long eventId);
    MerchandiseDTO updateMerchandise(Long id, MerchandiseDTO dto);
}
