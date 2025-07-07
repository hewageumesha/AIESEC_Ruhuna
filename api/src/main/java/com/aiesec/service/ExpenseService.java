        package com.aiesec.service;

import com.aiesec.model.Expense;
import com.aiesec.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;


@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
    }
    
    
public Expense updateExpense(Long id, Expense updatedExpense) {
    return expenseRepository.findById(id).map(expense -> {
        expense.setDate(updatedExpense.getDate());
        expense.setAmount(updatedExpense.getAmount());
        expense.setCategory(updatedExpense.getCategory());
        expense.setDescription(updatedExpense.getDescription());
        expense.setPaymentMethod(updatedExpense.getPaymentMethod());
        expense.setRole(updatedExpense.getRole());
        expense.setUserId(updatedExpense.getUserId());
        return expenseRepository.save(expense);
    }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found with ID: " + id));
}

    public void deleteExpense(Long id) {
        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
        } else {
            throw new RuntimeException("Expense not found with ID: " + id);
        }
    }
}
