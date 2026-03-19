package com.example.hotelreservation.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageService {

    // Folder where images will be saved (relative to project root)
    private static final String UPLOAD_DIR = "src/main/resources/static/roomImages/";
    private static final String URL_PREFIX = "/roomImages/";

    public String saveImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // Create directory if not exists
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = UUID.randomUUID().toString() + extension;

        // Save file
        Path path = Paths.get(UPLOAD_DIR + filename);
        Files.write(path, file.getBytes());

        // Return public URL
        return URL_PREFIX + filename;
    }
}