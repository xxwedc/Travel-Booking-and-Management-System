package com.service.controller;


import com.service.pojo.Images;
import com.service.pojo.Result;
import com.service.service.ImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin   // 解决跨域问题
public class ImagesController {
    @Autowired
    ImagesService imagesService;

    @PostMapping("/images/getImages")
    public Result getImgList(@RequestBody Images images){
        Long id = Long.valueOf(images.getId());
        return imagesService.getImgList(id);
    }
    @PostMapping("/images/getImgData")
    public Result getImgData(@RequestBody Images images){
        Long id = Long.valueOf(images.getId());
        return imagesService.getImgData(id);
    }

    @PostMapping("/api/images/uploadImages")
    public Result uploadImages(@RequestParam("files") MultipartFile[] files) {
        return imagesService.uploadImage(files);
    }

    @PostMapping("/api/images/insertImages")
    public Result deleteImages(@RequestBody Images images) {
        return imagesService.insertImage(images);
    }

    @PostMapping("/api/images/deleteImagesById")
    public Result deleteImagesById(@RequestBody Images images) {
        Long id = Long.valueOf(images.getId());
        return imagesService.deleteImagesById(id);
    }

}
