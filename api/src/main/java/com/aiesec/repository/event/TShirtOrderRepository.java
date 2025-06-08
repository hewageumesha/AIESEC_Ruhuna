package com.aiesec.repository.event;


import com.aiesec.model.event.TShirtOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TShirtOrderRepository extends JpaRepository<TShirtOrder, Long> {
    List<TShirtOrder> findByUser_UserId(Long userId);
    List<TShirtOrder> findByMerchandise_Id(Long merchandiseId);
}

