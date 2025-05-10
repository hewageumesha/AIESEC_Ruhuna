package com.aiesec.aiesec.pdfgenerator;

import com.aiesec.aiesec.model.Invoice;
import org.springframework.stereotype.Component;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component
public class PdfGenerator {

    public byte[] generateInvoicePdf(Invoice invoice) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("Invoice: " + invoice.getInvoiceNumber()).setBold());
        document.add(new Paragraph("Customer: " + invoice.getCustomerName()));
        document.add(new Paragraph("Email: " + invoice.getCustomerEmail()));
        document.add(new Paragraph("Description: " + invoice.getDescription()));
        document.add(new Paragraph("Amount: " + invoice.getAmount() + " " + invoice.getCurrency()));
        document.add(new Paragraph("Tax: " + invoice.getTax() + "%"));
        document.add(new Paragraph("Discount: " + invoice.getDiscount() + "%"));
        document.add(new Paragraph("Issue Date: " + invoice.getIssueDate()));
        document.add(new Paragraph("Due Date: " + invoice.getDueDate()));
        document.add(new Paragraph("Status: " + invoice.getStatus()));

        document.close();
        return baos.toByteArray();
    }
}
