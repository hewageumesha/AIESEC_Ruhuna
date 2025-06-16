package com.aiesec.mapper;

import com.aiesec.dto.TshirtOrderDTO;
import com.aiesec.model.event.*;
import com.aiesec.model.User;

public class TShirtOrderMapper {

    public static TshirtOrderDTO toDTO(TShirtOrder order) {
        if (order == null) return null;

        return TshirtOrderDTO.builder()
                .orderId(order.getOrderId())
                .merchandiseId(order.getMerchandise() != null ? order.getMerchandise().getId() : null)
                .quantity(order.getQuantity())
                .size(order.getSize().name())
                .userId(order.getUser() != null ? order.getUser().getUserId() : null)
                //.guestUserId(order.getGuestUser() != null ? order.getGuestUser().getGuestUserId() : null)
                .build();
    }

    public static TShirtOrder toEntity(TshirtOrderDTO dto, Merchandise merchandise, User user, GuestUser guestUser) {
        if (dto == null) return null;

        return TShirtOrder.builder()
                .orderId(dto.getOrderId())
                .merchandise(merchandise)
                .quantity(dto.getQuantity())
                .size(Enum.valueOf(com.aiesec.enums.TshirtSize.class, dto.getSize()))
                .user(user)
                //.guestUser(guestUser)
                .build();
    }

    public static TShirtOrder toEntity(TshirtOrderDTO dto, Merchandise merchandise) {
        return TShirtOrderMapper.toEntity(dto, merchandise, null, null);
    }
}

