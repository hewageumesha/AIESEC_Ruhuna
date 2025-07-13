package com.aiesec.controller;

import com.aiesec.dto.FunctionDTO;
import com.aiesec.service.FunctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // Allows cross-origin requests from any source
@RestController // Marks this class as a REST controller that handles HTTP requests
@RequestMapping("/api/functions") // Base path for all endpoints related to functions
public class FunctionController {

    @Autowired
    private FunctionService functionService; // Inject the FunctionService to handle business logic

    /**
     * Endpoint to add a new function.
     * URL: POST /api/functions/add
     * Request Body: JSON representation of Function
     * Response: The created Function object
     */
    @PostMapping("/add")
    public FunctionDTO addFunction(@RequestBody FunctionDTO dto) {
        return functionService.addFunction(dto);
    }

     /**
     * Endpoint to retrieve all functions.
     * URL: GET /api/functions/
     * Response: List of all Function objects
     */
    @GetMapping("/")
    public List<FunctionDTO> getAllFunctions() {
        return functionService.getAllFunctions();
    }

     /**
     * Endpoint to retrieve a function by its ID.
     * URL: GET /api/functions/{id}
     * Path Variable: id - ID of the function
     * Response: The Function object with the given ID
     */
    @GetMapping("/{id}")
    public FunctionDTO getFunctionById(@PathVariable Long id) {
        return functionService.getFunctionById(id);
    }

     /**
     * Endpoint to delete a function by its ID.
     * URL: DELETE /api/functions/delete/{id}
     * Path Variable: id - ID of the function to be deleted
     * Response: A success message
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
}

