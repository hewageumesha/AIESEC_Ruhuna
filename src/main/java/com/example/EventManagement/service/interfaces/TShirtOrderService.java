package com.example.EventManagement.service.interfaces;

import com.example.EventManagement.dto.TshirtOrderDTO;

import java.util.List;

public interface TShirtOrderService {
    TshirtOrderDTO createTShirtOrder(TshirtOrderDTO tShirtOrderDTO);
    TshirtOrderDTO updateTShirtOrder(Long orderId, TshirtOrderDTO tShirtOrderDTO);
    void deleteTShirtOrder(Long orderId);
    TshirtOrderDTO getTShirtOrderById(Long orderId);
    List<TshirtOrderDTO> getAllTShirtOrders();
}
