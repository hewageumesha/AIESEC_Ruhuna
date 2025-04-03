package com.invoice.demo.service;

import com.invoice.demo.controller.InvoiceRequest;
import com.invoice.demo.model.Invoice;
import com.invoice.demo.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.io.font.constants.StandardFonts;

import java.io.*;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public ByteArrayOutputStream createInvoicePdf(InvoiceRequest request) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            PdfFont titleFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
            PdfFont textFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);

            document.add(new Paragraph("Invoice").setFont(titleFont).setFontSize(16));
            document.add(new Paragraph("Invoice No: " + request.getInvoiceNo()).setFont(textFont));
            document.add(new Paragraph("Date: " + request.getDate()).setFont(textFont));
            document.add(new Paragraph("Due Date: " + request.getDueDate()).setFont(textFont));
            document.add(new Paragraph("Description: " + request.getDescription()).setFont(textFont));
            document.add(new Paragraph("Project Fee: " + request.getProjectFee()).setFont(textFont));
            document.add(new Paragraph("Volunteer Name: " + request.getVolunteerName()).setFont(textFont));
            document.add(new Paragraph("AIESEC Entity: " + request.getAiesecEntity()).setFont(textFont));
            document.add(new Paragraph("Receiver's Signature: " + request.getReceiverSignature()).setFont(textFont));

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
