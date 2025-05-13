package com.service.utils;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.service.mapper.ImagesMapper;
import com.service.pojo.Images;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.net.URL;
import java.util.List;

@Component
public class ImgConfiguration {
    @Getter
    @Value("${image.upload.dir}")
    private String uploadDir;

    @Autowired
    private ImagesMapper imagesMapper;


//    删除本地文件。需要参数为图片在线链接 类似 http://localhost:8888/news/new5.png
//    提取文件名，再从本地删除

    public void deleteImgFile(String path) {
        try {
            URL url = new URL(path);
            String fileName = url.getFile().substring(url.getFile().lastIndexOf('/') + 1);
            File file = new File(uploadDir + File.separator + fileName);
            if (file.exists()) {
                if (file.delete()) {
                    System.out.println("成功删除本地文件：, "+file.getAbsolutePath());

                } else {
                    System.out.println("删除本地文件失败：, "+file.getAbsolutePath());
                }
            } else {
                System.out.println("本地文件不存在：, "+file.getAbsolutePath());
            }
        } catch (Exception e) {
            System.out.println("出错：, "+e.getMessage());
        }

    }

    public void deleteImgByOtherId(Long otherId){
        //使用LambdaQueryWrapper  根据other_id字段来进行查询
        LambdaQueryWrapper<Images> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Images::getOtherId, otherId);
        List<Images> imagesData = imagesMapper.selectList(queryWrapper);
//        执行循环删除
        for(Images image : imagesData){
            //删除sql记录
            imagesMapper.deleteById(image.getId());
//            删除本地文件
            deleteImgFile(image.getPath());
        }
    }


}
