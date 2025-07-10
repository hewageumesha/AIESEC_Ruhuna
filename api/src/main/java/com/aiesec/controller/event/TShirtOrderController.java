package com.aiesec.controller.event;



import com.aiesec.dto.TshirtOrderDTO; 
import com.aiesec.service.interfaces.TShirtOrderService; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tshirt-orders")
public class TShirtOrderController {

    @Autowired
    private final TShirtOrderService tShirtOrderService;


    public TShirtOrderController(TShirtOrderService tShirtOrderService) {
        this.tShirtOrderService = tShirtOrderService;
    }

    // Create a new T-shirt order
    @PostMapping
    public ResponseEntity<TshirtOrderDTO> createTShirtOrder(@RequestBody TshirtOrderDTO tShirtOrderDTO) {
        TshirtOrderDTO createdTShirtOrder = tShirtOrderService.createTShirtOrder(tShirtOrderDTO);
        return new ResponseEntity<>(createdTShirtOrder, HttpStatus.CREATED);
    }

    // Update an existing T-shirt order
    @PutMapping("/{id}")
    public ResponseEntity<TshirtOrderDTO> updateTShirtOrder(
            @PathVariable("id") Long orderId,
            @RequestBody TshirtOrderDTO tShirtOrderDTO) {
        TshirtOrderDTO updatedTShirtOrder = tShirtOrderService.updateTShirtOrder(orderId, tShirtOrderDTO);
        return new ResponseEntity<>(updatedTShirtOrder, HttpStatus.OK);
    }

    // Delete a T-shirt order by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTShirtOrder(@PathVariable("id") Long orderId) {
        tShirtOrderService.deleteTShirtOrder(orderId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Get a single T-shirt order by ID
    @GetMapping("/{id}")
    public ResponseEntity<TshirtOrderDTO> getTShirtOrderById(@PathVariable("id") Long orderId) {
        TshirtOrderDTO tShirtOrderDTO = tShirtOrderService.getTShirtOrderById(orderId);
        return new ResponseEntity<>(tShirtOrderDTO, HttpStatus.OK);
    }

    // Get all T-shirt orders
    @GetMapping
    public ResponseEntity<List<TshirtOrderDTO>> getAllTShirtOrders() {
        List<TshirtOrderDTO> tShirtOrders = tShirtOrderService.getAllTShirtOrders();
        return new ResponseEntity<>(tShirtOrders, HttpStatus.OK);
    }
}
