package com.service.controller;

import com.service.pojo.News;
import com.service.pojo.PageItem;
import com.service.pojo.Result;
import com.service.service.ImagesService;
import com.service.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin  // 解决跨域问题
public class NewsController {
    @Autowired
    NewsService newsService;
    @Autowired
    ImagesService imagesService;

    @GetMapping("/news/getNews")
    public Result getNews(){
        return newsService.getNews();
    }

    @PostMapping("/news/getNewsByPage/{currentPage}/size/{pageSize}")
    public PageItem<News> queryByPage(@PathVariable("currentPage") String current, @PathVariable("pageSize") String size, @RequestBody News news) {
        return newsService.getNewsByPage(current,size,news);
    }


    @PostMapping("/news/getNewById")
    public Result getNewsById(@RequestBody News news){
        Long id = Long.valueOf(news.getId());
        return newsService.getNewsById(id);
    }
    @PutMapping("/news/updateNews")
    public Result updateNews(@RequestBody News news){
        return newsService.updateNewsById(news);
    }
    @PostMapping("/news/addNews")
    public Result addNews(@RequestBody News news){
        return newsService.addNews(news);
    }

    @DeleteMapping("/news/deleteNews")
    public Result deleteNewsById(@RequestBody News news){
        Long id = Long.valueOf(news.getId());
        return newsService.deleteNewsById(id);
    }

}
