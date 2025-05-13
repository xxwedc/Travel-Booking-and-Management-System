package com.service.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.service.mapper.NewsMapper;
import com.service.mapper.UserMapper;
import com.service.pojo.*;
import com.service.service.NewsService;
import com.service.utils.ImgConfiguration;
import com.service.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NewsServiceImpl implements NewsService {

    @Autowired
    NewsMapper newsMapper;

    @Autowired
    UserMapper userMapper;


    @Autowired
    private ImgConfiguration imgConfig;


    @Override
    public Result getNews() {
        // 查询所有新闻数据
        List<News> newsList = newsMapper.selectList(null);
        if (newsList!= null) {
            // 创建一个新地列表来存储更新后的新闻数据
            List<News> updatedNewsList = new ArrayList<>();
            for (News news : newsList) {
                // 根据新闻中的用户 ID 查询用户信息
                User user = userMapper.selectById(news.getUserId());
                if (user!= null) {
                    // 将用户名字设置到新闻对象中
                    news.setUserName(user.getUsername());
                    // 将更新后的新闻添加到新列表中
                    updatedNewsList.add(news);
                }
            }
            // 返回查询成功的结果，包含更新后的新闻数据
            return new Result(200, "查询成功", updatedNewsList);
        }
        // 如果没有查询到新闻数据，返回查询失败的结果
        return new Result(500, "查询失败");
    }

    @Override
    public PageItem<News> getNewsByPage(String pageNum, String pageSize, News query) {
        int num = Integer.parseInt(pageNum);
        int size = Integer.parseInt(pageSize);
        Page<News> page = new Page<>(num, size);

        LambdaQueryWrapper<News> lqw = new LambdaQueryWrapper<>();
        lqw.like(query.getTitle() != null && query.getTitle() != "", News::getTitle, query.getTitle());

        IPage<News> NewsList = newsMapper.selectPage(page,lqw);

        return  new PageItem<>(NewsList.getRecords(), NewsList.getTotal());
    }

    @Override
    public Result getNewsById(Long id) {
        News news= newsMapper.selectById(id);
        if(news!=null){
            User user = userMapper.selectById(news.getUserId());
            if (user != null) {
                news.setUserName(user.getUsername());
            }
            return new Result(200, "查询成功", news);
        }
        return new Result(500, "查询失败");
    }

    @Override
    public Result updateNewsById(News news) {
        News knew= newsMapper.selectById(news.getId());
        if(knew!=null){
            newsMapper.updateById(news);
            return new Result(200, "修改成功");
        }
        return new Result(500, "修改失败");

    }

    @Override
    public Result addNews(News news) {
//        通过username来传输token获取id
        String token=news.getUserName();
        if(JwtUtils.verifyToken(token)){
            String userid =JwtUtils.getAudience(token);
            news.setUserId(userid);
        }
        try{
            int ret= newsMapper.insert(news);
            if (ret>0){
                // 此时 news 对象中的主键属性应该已经被 MyBatis 自动设置为新插入记录的主键值
                News insertedNews = newsMapper.selectById(news.getId());
                return new Result(200, "插入成功", insertedNews);
            }
            return new Result(500, "插入失败");
        }
        catch (Exception e){
            return new Result(500, "异常错误",e.getMessage());
        }

    }

    @Override
    public Result deleteNewsById(Long id) {
        News news = newsMapper.selectById(id);
        String imgPath =news.getImg();
        //删除本地文件
        if(imgPath!=null &&!imgPath.isEmpty()){
            imgConfig.deleteImgFile(imgPath);
        }
        imgConfig.deleteImgByOtherId(id);
        //删除images表里对应的本地文件,以及sql数据
        imgConfig.deleteImgByOtherId(id);

        int ret=newsMapper.deleteById(id);
        if (ret>0){
            return new Result(200, "删除成功");
        }
        return new Result(500, "删除失败");
    }
}
