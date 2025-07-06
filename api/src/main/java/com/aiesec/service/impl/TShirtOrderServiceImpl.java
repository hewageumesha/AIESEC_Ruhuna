package com.aiesec.service.impl;



import com.aiesec.dto.TshirtOrderDTO;
import com.aiesec.model.*;
import com.aiesec.mapper.TShirtOrderMapper;
import com.aiesec.model.event.GuestEventRegistration;
import com.aiesec.model.event.Merchandise;
import com.aiesec.model.event.TShirtOrder;
import com.aiesec.repository.UserRepository;
import com.aiesec.repository.event.*;
import com.aiesec.service.interfaces.TShirtOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TShirtOrderServiceImpl implements TShirtOrderService {

    @Autowired
    private TShirtOrderRepository tshirtOrderRepository;

    @Autowired
    private MerchandiseRepository merchandiseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GuestEventRegistrationRepository guestEventRegistrationRepository;


    @Override
    public TshirtOrderDTO createTShirtOrder(TshirtOrderDTO dto) {
        if (dto.getMerchandiseId() == null) {
            throw new IllegalArgumentException("Merchandise ID cannot be null");
        }

        Merchandise merchandise = merchandiseRepository.findById(dto.getMerchandiseId())
                .orElseThrow(() -> new IllegalArgumentException("Merchandise with ID " + dto.getMerchandiseId() + " not found"));

        User user = null;
        if (dto.getUserId() != null) {
            user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User with ID " + dto.getUserId() + " not found"));
        }

        GuestEventRegistration guestEventRegistration = null;
        if (dto.getGuestUserId() != null) {
            guestEventRegistration = guestEventRegistrationRepository.findById(dto.getGuestUserId())
                    .orElseThrow(() -> new IllegalArgumentException("GuestUser with ID " + dto.getGuestUserId() + " not found"));
        }

        TShirtOrder order = TShirtOrderMapper.toEntity(dto, merchandise, user, guestEventRegistration);
        return TShirtOrderMapper.toDTO(tshirtOrderRepository.save(order));
    }


    @Override
    public TshirtOrderDTO updateTShirtOrder(Long orderId, TshirtOrderDTO dto) {
        TShirtOrder existingOrder = tshirtOrderRepository.findById(orderId).orElseThrow();

        Merchandise merchandise = merchandiseRepository.findById(dto.getMerchandiseId()).orElseThrow();
        User user = dto.getUserId() != null ? userRepository.findById(dto.getUserId()).orElse(null) : null;
        GuestEventRegistration guest = dto.getGuestUserId() != null ? guestEventRegistrationRepository.findById(dto.getGuestUserId()).orElse(null) : null;

        existingOrder.setMerchandise(merchandise);
        existingOrder.setQuantity(dto.getQuantity());
        existingOrder.setSize(Enum.valueOf(com.aiesec.enums.TshirtSize.class, dto.getSize()));
        existingOrder.setUser(user);
        existingOrder.setGuest_event_id(guest);

        return TShirtOrderMapper.toDTO(tshirtOrderRepository.save(existingOrder));
    }

    @Override
    public void deleteTShirtOrder(Long orderId) {
        tshirtOrderRepository.deleteById(orderId);
    }

    @Override
    public TshirtOrderDTO getTShirtOrderById(Long orderId) {
        return tshirtOrderRepository.findById(orderId)
                .map(TShirtOrderMapper::toDTO)
                .orElseThrow();
    }

    @Override
    public List<TshirtOrderDTO> getAllTShirtOrders() {
        return tshirtOrderRepository.findAll().stream()
                .map(TShirtOrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TshirtOrderDTO> getOrdersByMerchandiseId(Long merchandiseId) {
        return tshirtOrderRepository.findByMerchandise_Id(merchandiseId)
                .stream()
                .map(TShirtOrderMapper::toDTO)
                .collect(Collectors.toList());
    }

}
