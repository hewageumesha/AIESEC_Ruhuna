package com.aiesec.model.event;


import com.aiesec.enums.TshirtSize;
import com.aiesec.model.User; 
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tshirt_order")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TShirtOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @ManyToOne
    @JoinColumn(name = "Merchandise_ID", nullable = false)
    private Merchandise merchandise;

    @Column(name = "Quantity", nullable = false)
    private int quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "Size")
    private TshirtSize size;

    @ManyToOne
    @JoinColumn
    private User user;

    @ManyToOne
    @JoinColumn(name = "Guest_ID")
    private GuestEventRegistration guest_event_id;


}

