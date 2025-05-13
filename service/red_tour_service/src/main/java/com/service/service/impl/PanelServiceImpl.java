package com.service.service.impl;

import com.service.mapper.*;
import com.service.pojo.Panel;
import com.service.pojo.Result;
import com.service.pojo.User;
import com.service.service.PanelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PanelServiceImpl implements PanelService {

    @Autowired
    PanelMapper panelMapper;
    @Autowired
    UserMapper userMapper;
    @Autowired
    CommentMapper commentMapper;
    @Autowired
    ScenicMapper scenicMapper;
    @Autowired
    OrderInfoMapper orderInfoMapper;



    @Override
    public Result getPanel() {
        Long userCount =userMapper.selectCount(null);
        Long commentCount = commentMapper.selectCount(null);
        Long scenicCount = scenicMapper.selectCount(null);
        Long orderCount = orderInfoMapper.selectCount(null);

//        获取用户表里的年龄字段封装为数组
        List<Integer> ageList=new ArrayList<Integer>();
        for (User user : userMapper.selectList(null)) {
            ageList.add(user.getAge());
        }

//        获取sex字段封装为数组
        List<Integer> sexList=new ArrayList<Integer>();
        for (User user : userMapper.selectList(null)) {
            sexList.add(user.getSex());
        }

        Panel panelData = new Panel();
        panelData.setUserCount(userCount);
        panelData.setCommentCount(commentCount);
        panelData.setScenicCount(scenicCount);
        panelData.setOrderCount(orderCount);
        panelData.setAgeList(ageList);
        panelData.setSexList(sexList);

        return new Result(200, "查询成功", panelData);
    }
}
