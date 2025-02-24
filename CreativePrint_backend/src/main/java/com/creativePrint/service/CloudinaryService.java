package com.creativePrint.service;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {

    String uploadFile(MultipartFile file, String folder) throws Exception;

    void deleteFile(String publicId) throws Exception;
 
}
