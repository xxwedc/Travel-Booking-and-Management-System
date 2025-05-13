package com.service.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.service.pojo.PageItem;
import com.service.pojo.Result;
import com.service.pojo.Scenic;

public interface ScenicService {
    Result getAllScenic();
    Result getScenicById(Long id);

    //查询所有需要预约的景点
    Result getOrderScenic();
    //    分页查询
    PageItem<Scenic> getScenicByPage(String pageNum, String pageSize, Scenic query);

    Result addScenic(Scenic scenic);

    Result updateScenic(Scenic scenic);

    Result deleteScenic(Long id);


}
