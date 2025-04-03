package com.invoice.demo.controller;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvoiceRequest {
    private String invoiceNo;
    private String date;
    private String dueDate;
    private String description;
    private String projectFee;
    private String volunteerName;
    private String aiesecEntity;
    private String receiverSignature;
}
