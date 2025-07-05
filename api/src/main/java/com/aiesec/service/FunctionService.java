package com.aiesec.service;

import com.aiesec.model.Function;
import com.aiesec.repository.FunctionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FunctionService {

    @Autowired
    private FunctionRepo functionRepository;

    public Function addFunction(Function function) {
        return functionRepository.save(function);
    }

    public List<Function> getAllFunctions() {
        return functionRepository.findAll();
    }

    public Function getFunctionById(Long id) {
        return functionRepository.findById(id).orElseThrow(() -> new RuntimeException("Function not found"));
    }

    public void deleteFunction(Long id) {
        Function function = functionRepository.findById(id).orElseThrow(() -> new RuntimeException("Function not found"));
        functionRepository.delete(function);
    }
}
