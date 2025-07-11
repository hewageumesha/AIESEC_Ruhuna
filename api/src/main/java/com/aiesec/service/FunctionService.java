package com.aiesec.service;

import com.aiesec.dto.FunctionDTO;
import com.aiesec.model.Function;
import com.aiesec.repository.FunctionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FunctionService {

    @Autowired
    private FunctionRepo functionRepository;

    public FunctionDTO addFunction(FunctionDTO dto) {
        Function function = new Function();
        function.setName(dto.getName());
        Function saved = functionRepository.save(function);
        return new FunctionDTO(saved.getId(), saved.getName());
    }

    public List<FunctionDTO> getAllFunctions() {
        return functionRepository.findAll()
                .stream()
                .map(f -> new FunctionDTO(f.getId(), f.getName()))
                .collect(Collectors.toList());
    }

    public FunctionDTO getFunctionById(Long id) {
        Function function = functionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Function not found with id: " + id));
        return new FunctionDTO(function.getId(), function.getName());
    }

    public void deleteFunction(Long id) {
        if (functionRepository.existsById(id)) {
            functionRepository.deleteById(id);
        } else {
            throw new RuntimeException("Function not found with id: " + id);
        }
    }
    
    public FunctionDTO updateFunction(Long id, FunctionDTO dto) {
        Optional<Function> optional = functionRepository.findById(id);
        if (optional.isPresent()) {
            Function function = optional.get();
            function.setName(dto.getName());
            Function updated = functionRepository.save(function);
            return new FunctionDTO(updated.getId(), updated.getName());
        } else {
            throw new RuntimeException("Function not found with id: " + id);
        }
    }
}
