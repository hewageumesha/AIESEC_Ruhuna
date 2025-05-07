package com.aiesec.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/uploads")
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/profile-photo")
    public String uploadProfilePhoto(@RequestParam("file") MultipartFile file) {
        String fileName = System.currentTimeMillis() + file.getOriginalFilename();
        try {
            file.transferTo(new File(uploadDir + fileName));
            return "Profile photo uploaded successfully: " + fileName;
        } catch (IOException e) {
            return "Error uploading file: " + e.getMessage();
        }
    }
}

