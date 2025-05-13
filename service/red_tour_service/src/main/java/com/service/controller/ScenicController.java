package com.service.controller;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.service.pojo.PageItem;
import com.service.pojo.Result;
import com.service.pojo.Scenic;
import com.service.service.ScenicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin   // 解决跨域问题
public class ScenicController {
    @Autowired
    ScenicService scenicService;

    @GetMapping("/scenic/getAllScenic")
    public Result getAllScenic() {
        return scenicService.getAllScenic();
    }

//    获取需要预约的景点
    @GetMapping("/scenic/getOrderScenic")
    public Result getOrderScenic() {
        return scenicService.getOrderScenic();
    }



    @PostMapping("/scenic/getScenicById")
    public Result getScenicById(@RequestBody Scenic scenic) {
        Long id = Long.valueOf(scenic.getId());
        return scenicService.getScenicById(id);
    }

    @PostMapping("/scenic/getScenicByPage/{currentPage}/size/{pageSize}")
    public PageItem<Scenic> queryByPage(@PathVariable("currentPage") String current, @PathVariable("pageSize") String size, @RequestBody Scenic scenic) {
        return scenicService.getScenicByPage(current,size,scenic);
    }

    @PostMapping("/scenic/addScenic")
    public Result addScenic(@RequestBody Scenic scenic) {
        return scenicService.addScenic(scenic);
    }


    @PostMapping("/scenic/updateScenic")
    public Result updateScenic(@RequestBody Scenic scenic) {
        return scenicService.updateScenic(scenic);
    }
    @DeleteMapping("/scenic/deleteScenic")
    public Result deleteScenic(@RequestBody Scenic scenic) {
        Long id = Long.valueOf(scenic.getId());
        return scenicService.deleteScenic(id);
    }

}
