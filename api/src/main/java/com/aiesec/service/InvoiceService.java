package com.aiesec.service;

import com.aiesec.model.Expense;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class InvoiceService {

    // ✅ For generating invoice for a list of expenses
    public byte[] generateInvoice(List<Expense> expenses) throws Exception {
        try (
            PDDocument document = new PDDocument();
            ByteArrayOutputStream out = new ByteArrayOutputStream()
        ) {
            PDPage page = new PDPage();
            document.addPage(page);
            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
            contentStream.beginText();
            contentStream.newLineAtOffset(50, 700);
            contentStream.showText("All Expenses Invoice");
            contentStream.endText();

            contentStream.setFont(PDType1Font.HELVETICA, 12);
            int y = 660;

            for (Expense exp : expenses) {
                if (y < 100) {
                    contentStream.close();
                    page = new PDPage();
                    document.addPage(page);
                    contentStream = new PDPageContentStream(document, page);
                    contentStream.setFont(PDType1Font.HELVETICA, 12);
                    y = 700;
                }

                contentStream.beginText();
                contentStream.newLineAtOffset(50, y);
                contentStream.showText(String.format("Date: %s | Amount: LKR %.2f | Category: %s | Payment: %s",
                        exp.getDate(), exp.getAmount(), exp.getCategory(), exp.getPaymentMethod()));
                contentStream.endText();
                y -= 20;
            }

            contentStream.close();
            document.save(out);
            return out.toByteArray();
        }
    }

    // ✅ For generating invoice for one expense
    public byte[] generateInvoiceForExpense(Expense exp) throws Exception {
        try (
            PDDocument document = new PDDocument();
            ByteArrayOutputStream out = new ByteArrayOutputStream()
        ) {
            PDPage page = new PDPage();
            document.addPage(page);
            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
            contentStream.beginText();
            contentStream.newLineAtOffset(50, 700);
            contentStream.showText("Expense Invoice");
            contentStream.endText();

            contentStream.setFont(PDType1Font.HELVETICA, 12);
            int y = 660;

            contentStream.beginText(); contentStream.newLineAtOffset(50, y); contentStream.showText("Date: " + exp.getDate()); contentStream.endText(); y -= 20;
            contentStream.beginText(); contentStream.newLineAtOffset(50, y); contentStream.showText("Amount: LKR " + exp.getAmount()); contentStream.endText(); y -= 20;
            contentStream.beginText(); contentStream.newLineAtOffset(50, y); contentStream.showText("Description: " + exp.getDescription()); contentStream.endText(); y -= 20;
            contentStream.beginText(); contentStream.newLineAtOffset(50, y); contentStream.showText("Category: " + exp.getCategory()); contentStream.endText(); y -= 20;
            contentStream.beginText(); contentStream.newLineAtOffset(50, y); contentStream.showText("Payment Method: " + exp.getPaymentMethod()); contentStream.endText(); y -= 20;
            contentStream.beginText(); contentStream.newLineAtOffset(50, y); contentStream.showText("Role: " + exp.getRole()); contentStream.endText(); y -= 20;
            contentStream.beginText(); contentStream.newLineAtOffset(50, y); contentStream.showText("User ID: " + exp.getUserId()); contentStream.endText();

            contentStream.close();
            document.save(out);
            return out.toByteArray();
        }
    }
}
