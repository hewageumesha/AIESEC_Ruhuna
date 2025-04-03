package com.example.EventManagement.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/upload")
public class ImageUploadController {

    private static String UPLOAD_DIR = "uploads/";

    @PostMapping("/event-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file selected");
        }

        try {
            // Create directory if it doesn't exist
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Save the file locally
            Path path = Paths.get(UPLOAD_DIR + file.getOriginalFilename());
            Files.write(path, file.getBytes());

            // Return the path or URL of the uploaded file
            return ResponseEntity.ok("/uploads/" + file.getOriginalFilename());

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload image");
        }
    }
}