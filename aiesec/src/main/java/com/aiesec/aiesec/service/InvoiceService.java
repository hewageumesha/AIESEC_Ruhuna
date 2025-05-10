package com.aiesec.aiesec.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.aiesec.aiesec.model.Invoice;  // <-- adjust path if needed
import com.aiesec.aiesec.repository.InvoiceRepository;  // <-- adjust path if needed

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    public Invoice saveInvoice(Invoice invoice) {
        if (invoice.getInvoiceNumber() == null) {
            invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (invoice.getStatus() == null) {
            invoice.setStatus("Pending");
        }
        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }

    public List<Invoice> filterByStatus(String status) {
        return invoiceRepository.findByStatus(status);
    }
}
