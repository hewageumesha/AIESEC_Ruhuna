package com.invoice.demo.service;

import com.invoice.demo.controller.InvoiceRequest;
import com.invoice.demo.model.Invoice;
import com.invoice.demo.repository.InvoiceRepository;
import org.springframework.stereotype.Service;
import java.io.*;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;


@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public ByteArrayOutputStream createInvoicePdf(InvoiceRequest request) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document();

        try {
            PdfWriter.getInstance(document, outputStream);
            document.open();
            document.addTitle("Invoice");

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
            Font textFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);

            document.add(new Paragraph("Invoice", titleFont));
            document.add(new Paragraph("Invoice No: " + request.getInvoiceNo(), textFont));
            document.add(new Paragraph("Date: " + request.getDate(), textFont));
            document.add(new Paragraph("Due Date: " + request.getDueDate(), textFont));
            document.add(new Paragraph("Description: " + request.getDescription(), textFont));
            document.add(new Paragraph("Project Fee: " + request.getProjectFee(), textFont));
            document.add(new Paragraph("Volunteer Name: " + request.getVolunteerName(), textFont));
            document.add(new Paragraph("AIESEC Entity: " + request.getAiesecEntity(), textFont));
            document.add(new Paragraph("Receiver's Signature: " + request.getReceiverSignature(), textFont));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return outputStream;
    }

    public String saveInvoiceToFile(InvoiceRequest request) {
        try {
            ByteArrayOutputStream pdfStream = createInvoicePdf(request);
            String filePath = "invoices/" + request.getInvoiceNo() + ".pdf";

            File directory = new File("invoices");
            if (!directory.exists()) {
                directory.mkdirs();
            }

            FileOutputStream fos = new FileOutputStream(filePath);
            fos.write(pdfStream.toByteArray());
            fos.close();

            Invoice invoice = new Invoice();
            invoice.setInvoiceNo(request.getInvoiceNo());
            invoice.setDate(request.getDate());
            invoice.setDueDate(request.getDueDate());
            invoice.setDescription(request.getDescription());
            invoice.setProjectFee(request.getProjectFee());
            invoice.setVolunteerName(request.getVolunteerName());
            invoice.setAiesecEntity(request.getAiesecEntity());
            invoice.setReceiverSignature(request.getReceiverSignature());
            invoice.setFilePath(filePath);

            invoiceRepository.save(invoice);

            return filePath;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
