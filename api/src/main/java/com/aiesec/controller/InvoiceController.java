package com.aiesec.controller;

import com.aiesec.service.InvoiceService;
import com.aiesec.model.Expense;
import com.aiesec.repository.ExpenseRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoice")
@CrossOrigin(origins = "http://localhost:5173")

public class InvoiceController {

    private final InvoiceService invoiceService;
    private final ExpenseRepository expenseRepository;

    public InvoiceController(InvoiceService invoiceService, ExpenseRepository expenseRepository) {
        this.invoiceService = invoiceService;
        this.expenseRepository = expenseRepository;
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadInvoice() throws Exception {
        List<Expense> expenses = expenseRepository.findAll();
        byte[] invoicePdf = invoiceService.generateInvoice(expenses);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice.pdf")
                .body(invoicePdf);
    }
}
