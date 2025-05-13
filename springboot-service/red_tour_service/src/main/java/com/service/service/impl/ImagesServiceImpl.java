package com.service.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.service.mapper.ImagesMapper;
import com.service.pojo.Images;
import com.service.pojo.Result;
import com.service.service.ImagesService;
import com.service.utils.ImgConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service
public class ImagesServiceImpl implements ImagesService {

    @Autowired
    ImagesMapper imagesMapper;
    @Autowired
    private ImgConfiguration imgConfig;



    //    图片服务器地址，可在线访问图片
    private String pathServe = "http://localhost:8888/news/";


    //    返回的数据不带id，用作前端轮播图
    @Override
    public Result getImgList(Long id) {
        //使用LambdaQueryWrapper  根据other_id字段来进行查询
        LambdaQueryWrapper<Images> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Images::getOtherId, id);
        List<Images> imagesData = imagesMapper.selectList(queryWrapper);

        if (!imagesData.isEmpty()) {
//            把路径封装好再传输给前端
            List<String> pathData = new ArrayList<>();
            for (Images image : imagesData) {
                pathData.add(image.getPath());
            }
            return new Result(200, "查询成功", pathData);
        }
        return new Result(500, "查询失败，无内容", imagesData);
    }


    //    返回的数据带id
    @Override
    public Result getImgData(Long id) {
        //使用LambdaQueryWrapper  根据other_id字段来进行查询
        LambdaQueryWrapper<Images> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Images::getOtherId, id);

        List<Images> imagesData = imagesMapper.selectList(queryWrapper);

        if (!imagesData.isEmpty()) {
            return new Result(200, "查询成功", imagesData);
        }
        return new Result(500, "查询失败，无内容");
    }


    @Override
    public Result uploadImage(MultipartFile[] files) {
        if (files[0].isEmpty()) {
            return new Result(500, "未选择图片", null);
        }

        List<String> uploadedPaths = new ArrayList<>();
        try {
            // 使用配置文件中的路径
            String uploadDir = imgConfig.getUploadDir();
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
//                    生成随机名字并拼接后缀名
                    String randomFileName = UUID.randomUUID() + getFileExtension(file.getOriginalFilename());
                    File dest = new File(uploadDir + randomFileName);
//                    文件流处理
                    FileCopyUtils.copy(file.getBytes(), dest);
                    // 返回文件路径并存储到 List<String> uploadedPaths，只保留拼接后的部分
                    uploadedPaths.add(pathServe + randomFileName);
                }
            }
            return new Result(200, "上传成功", uploadedPaths);
        } catch (IOException e) {
            uploadedPaths.add(e.getMessage());
            return new Result(400, "上传出现错误", uploadedPaths);
        }
    }

    @Override
    public Result insertImage(Images images) {
        int ret = imagesMapper.insert(images);
        if (ret > 0) {
            return new Result(200, "插入成功");
        }
        return new Result(500, "插入失败");


    }

    @Override
    public Result deleteImagesById(Long id) {
        Images image = imagesMapper.selectById(id);
        if (image == null) {
            return new Result(500, "删除本地文件失败，未找到对应图片路径信息");
        }
        String path = image.getPath();
        int ret = imagesMapper.deleteById(id);
        if (ret > 0) {
            imgConfig.deleteImgFile(path);
            return new Result(200, "删除成功");
        }
        return new Result(500, "删除失败");
    }

    @Override
    public Boolean deleteImgFilesByOtherId(Long otherId){
        //使用LambdaQueryWrapper  根据other_id字段来进行查询
        LambdaQueryWrapper<Images> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Images::getOtherId, otherId);
        List<Images> imagesData = imagesMapper.selectList(queryWrapper);
        for(Images image : imagesData){
            imgConfig.deleteImgFile(image.getPath());
        }
        return true;
    }


    //文件名后缀获取
    private String getFileExtension(String fileName) {
        if (fileName == null) {
            return "";
        }
//        把文件名最后一个.的位置存到dotIndex
        int dotIndex = fileName.lastIndexOf('.');

        if (dotIndex > 0 && dotIndex < fileName.length() - 1) {
//            返回文件后缀名
            return fileName.substring(dotIndex);
        }
        return "";
    }
}

