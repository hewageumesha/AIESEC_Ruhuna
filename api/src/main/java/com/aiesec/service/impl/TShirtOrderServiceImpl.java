package com.aiesec.service.impl;



import com.aiesec.dto.TshirtOrderDTO;
import com.aiesec.model.*;
import com.aiesec.mapper.TShirtOrderMapper;
import com.aiesec.model.event.GuestUser;
import com.aiesec.model.event.Merchandise;
import com.aiesec.model.event.TShirtOrder;
import com.aiesec.repository.UserRepository;
import com.aiesec.repository.event.*;
import com.aiesec.service.interfaces.TShirtOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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
    private GuestUserRepository guestUserRepository;

    @Override
    public TshirtOrderDTO createTShirtOrder(TshirtOrderDTO dto) {
        Merchandise merchandise = merchandiseRepository.findById(dto.getMerchandiseId()).orElseThrow();
        User user = dto.getUserId() != null ? userRepository.findById(dto.getUserId()).orElse(null) : null;
        GuestUser guest = dto.getGuestUserId() != null ? guestUserRepository.findById(dto.getGuestUserId()).orElse(null) : null;

        TShirtOrder order = TShirtOrderMapper.toEntity(dto, merchandise,user,null);
        return TShirtOrderMapper.toDTO(tshirtOrderRepository.save(order));
    }

    @Override
    public TshirtOrderDTO updateTShirtOrder(Long orderId, TshirtOrderDTO dto) {
        TShirtOrder existingOrder = tshirtOrderRepository.findById(orderId).orElseThrow();

        Merchandise merchandise = merchandiseRepository.findById(dto.getMerchandiseId()).orElseThrow();
        User user = dto.getUserId() != null ? userRepository.findById(dto.getUserId()).orElse(null) : null;
        GuestUser guest = dto.getGuestUserId() != null ? guestUserRepository.findById(dto.getGuestUserId()).orElse(null) : null;

        existingOrder.setMerchandise(merchandise);
        existingOrder.setQuantity(dto.getQuantity());
        existingOrder.setSize(Enum.valueOf(com.aiesec.enums.TshirtSize.class, dto.getSize()));
        existingOrder.setUser(user);
        existingOrder.setGuestUser(guest);

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
