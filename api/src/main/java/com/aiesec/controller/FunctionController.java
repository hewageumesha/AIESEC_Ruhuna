package com.aiesec.controller;

import com.aiesec.dto.FunctionDTO;
import com.aiesec.service.FunctionService;
import com.aiesec.model.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*") // Allow requests from all origins (CORS configuration)
@RestController // Marks this class as a REST controller
@RequestMapping("/api/functions") // Base path for all function-related endpoints
public class FunctionController {

    @Autowired
    private FunctionService functionService;  // Inject FunctionService to handle business logic

    /**
     * Endpoint to add a new function
     * URL: POST /api/functions/add
     * Request Body: JSON representation of Function
     * Response: Created Function object
     */
    @PostMapping("/add")
    public FunctionDTO addFunction(@RequestBody FunctionDTO dto) {
        return functionService.addFunction(dto);
    }

    /**
     * Endpoint to retrieve all functions
     * URL: GET /api/functions/
     * Response: List of all functions
     */
    @GetMapping("/")
    public List<FunctionDTO> getAllFunctions() {
        return functionService.getAllFunctions();
    }

    /**
     * Endpoint to retrieve a function by its ID
     * URL: GET /api/functsion/{id}
     * Path Variable: id - ID of the function to retrieve
     * Response: Function object with the given ID
     */
    @GetMapping("/{id}")
    public FunctionDTO getFunctionById(@PathVariable Long id) {
        return functionService.getFunctionById(id);
    }

    /**
     * Endpoint to delete a function by its ID
     * URL: DELETE /api/functions/delete/{id}
     * Path Variable: id - ID of the function to delete
     * Response: Success message
     */
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

