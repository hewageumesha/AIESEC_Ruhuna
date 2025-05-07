package com.aiesec.controller;

import com.aiesec.model.Function;
import com.aiesec.service.FunctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/functions")
public class FunctionController {

    @Autowired
    private FunctionService functionService;

    @PostMapping("/add")
    public Function addFunction(@RequestBody Function function) {
        return functionService.addFunction(function);
    }

    @GetMapping("/")
    public List<Function> getAllFunctions() {
        return functionService.getAllFunctions();
    }

    @GetMapping("/{id}")
    public Function getFunctionById(@PathVariable Long id) {
        return functionService.getFunctionById(id);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteFunction(@PathVariable Long id) {
        functionService.deleteFunction(id);
        return "Function deleted successfully";
    }
}

