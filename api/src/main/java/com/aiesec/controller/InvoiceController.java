package com.aiesec.controller;

import com.aiesec.model.Expense;
import com.aiesec.repository.ExpenseRepository;
import com.aiesec.service.InvoiceService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/download/category/{category}")
public ResponseEntity<byte[]> downloadInvoiceByCategory(@PathVariable String category) {
    List<Expense> expensesByCategory = expenseRepository.findByCategoryIgnoreCase(category);
    if (expensesByCategory.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
    
    try {
        byte[] invoicePdf = invoiceService.generateInvoice(expensesByCategory);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice_" + category + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(invoicePdf);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError().build();
    }
}


    // ✅ NEW: Method to download a specific expense invoice
    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadInvoiceById(@PathVariable Long id) {
        Optional<Expense> expenseOpt = expenseRepository.findById(id);
        if (expenseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            byte[] invoicePdf = invoiceService.generateInvoiceForExpense(expenseOpt.get());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice_" + id + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(invoicePdf);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
