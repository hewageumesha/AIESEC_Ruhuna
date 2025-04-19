package com.example.EventManagement.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class TshirtOrderDTO {
    private Long orderId;
    private Long merchandiseId;
    private Integer quantity;
    private String size;
    private Long userId;
    private Long guestUserId;
}
