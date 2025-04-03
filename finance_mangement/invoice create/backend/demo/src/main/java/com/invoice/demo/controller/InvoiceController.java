package com.invoice.demo.controller;

import com.invoice.demo.service.InvoiceService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateInvoice(@RequestBody InvoiceRequest request) {
        ByteArrayOutputStream pdf = invoiceService.createInvoicePdf(request);

       return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf.toByteArray());
    }
    
    @PostMapping("/save")
    public ResponseEntity<String> saveInvoice(@RequestBody InvoiceRequest request) {
        String filePath = invoiceService.saveInvoiceToFile(request);
        return ResponseEntity.ok("Invoice saved at: " + filePath);
    }

    @GetMapping("/download/{invoiceNo}")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable String invoiceNo) throws IOException {
        File file = new File("invoices/" + invoiceNo + ".pdf");

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        FileInputStream fileInputStream=new FileInputStream(file);
        byte[] pdfBytes = fileInputStream.readAllBytes();
        fileInputStream.close();
        

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + invoiceNo + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
