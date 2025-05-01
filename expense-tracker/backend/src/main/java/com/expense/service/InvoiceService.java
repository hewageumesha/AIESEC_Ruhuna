package com.expense.service;

import com.expense.model.Expense;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class InvoiceService {

    public byte[] generateInvoice(List<Expense> expenses) throws Exception {
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PDPage page = new PDPage();
            document.addPage(page);
            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
            contentStream.beginText();
            contentStream.newLineAtOffset(50, 700);
            contentStream.showText("Expense Tracker Invoice");
            contentStream.endText();

            int y = 650;
            for (Expense exp : expenses) {
                contentStream.beginText();
                contentStream.newLineAtOffset(50, y);
                contentStream.showText(exp.getDate() + " - " + exp.getCategory() + " - LKR" + exp.getAmount());
                contentStream.endText();
                y -= 20;
            }

            contentStream.close();
            document.save(out);
            return out.toByteArray();
        }
    }
}
