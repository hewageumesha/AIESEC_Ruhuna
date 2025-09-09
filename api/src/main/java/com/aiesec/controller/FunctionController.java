package com.aiesec.controller;

import com.aiesec.dto.FunctionDTO;
import com.aiesec.service.FunctionService;
import com.aiesec.model.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController 
@RequestMapping("/api/functions")
public class FunctionController {

    @Autowired
    private FunctionService functionService;

    @PostMapping("/add")
    public FunctionDTO addFunction(@RequestBody FunctionDTO dto) {
        return functionService.addFunction(dto);
    }

    @GetMapping("/")
    public List<FunctionDTO> getAllFunctions() {
        return functionService.getAllFunctions();
    }

    @GetMapping("/{id}")
    public FunctionDTO getFunctionById(@PathVariable Long id) {
        return functionService.getFunctionById(id);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteFunction(@PathVariable Long id) {
        functionService.deleteFunction(id);
        return "Function deleted successfully with id: " + id;
    }

    @PutMapping("/update/{id}")
    public FunctionDTO updateFunction(@PathVariable Long id, @RequestBody FunctionDTO dto) {
        return functionService.updateFunction(id, dto);
    }

    @GetMapping("/all")
    public List<String> getFunctions() {
        List<Function> functions = functionService.getFunctions();
        return functions.stream()
                .map(Function::getName)
                .collect(Collectors.toList());
    }
}

