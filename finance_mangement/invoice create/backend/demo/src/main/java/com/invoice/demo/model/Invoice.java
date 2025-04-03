package com.invoice.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "invoices")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String invoiceNo;
    private String date;
    private String dueDate;
    private String description;
    private String projectFee;
    private String volunteerName;
    private String aiesecEntity;
    private String receiverSignature;
    private String filePath;
}
