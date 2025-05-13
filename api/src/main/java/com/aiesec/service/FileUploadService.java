package com.aiesec.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class FileUploadService {

//    @Autowired
//    private Storage storage;
//
//    @Value("${supabase.bucket}")
//    private String bucketName;
//
//    public String uploadProfilePhoto(MultipartFile file, String aiesecEmail) throws IOException {
//        String fileName = "profile_" + aiesecEmail + "_" + UUID.randomUUID() +
//                         getFileExtension(file.getOriginalFilename());
//
//        storage.from(bucketName)
//               .upload(fileName, file.getInputStream(), file.getContentType());
//
//        return storage.from(bucketName).getPublicUrl(fileName);
//    }
//
//    private String getFileExtension(String fileName) {
//        return fileName.substring(fileName.lastIndexOf("."));
//    }
}