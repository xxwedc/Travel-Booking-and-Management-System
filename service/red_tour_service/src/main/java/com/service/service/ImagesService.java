package com.service.service;

import com.service.pojo.Images;
import com.service.pojo.Result;
import org.springframework.web.multipart.MultipartFile;


public interface ImagesService {
    Result getImgList(Long id);
    Result getImgData(Long id);
    Result uploadImage(MultipartFile[] file);
    Result insertImage(Images images);
    Result deleteImagesById(Long id);
    Boolean deleteImgFilesByOtherId(Long otherId);
}
