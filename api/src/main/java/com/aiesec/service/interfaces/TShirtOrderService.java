package com.aiesec.service.interfaces;



import com.aiesec.dto.TshirtOrderDTO;

import java.util.List;

public interface TShirtOrderService {
    TshirtOrderDTO createTShirtOrder(TshirtOrderDTO tShirtOrderDTO);
    TshirtOrderDTO updateTShirtOrder(Long orderId, TshirtOrderDTO tShirtOrderDTO);
    void deleteTShirtOrder(Long orderId);
    TshirtOrderDTO getTShirtOrderById(Long orderId);
    List<TshirtOrderDTO> getAllTShirtOrders();
    List<TshirtOrderDTO> getOrdersByMerchandiseId(Long merchandiseId);

}
