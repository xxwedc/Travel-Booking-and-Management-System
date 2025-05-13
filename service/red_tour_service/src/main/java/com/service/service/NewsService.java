package com.service.service;

import com.service.pojo.News;
import com.service.pojo.PageItem;
import com.service.pojo.Result;


public interface NewsService {
    Result getNews();
    PageItem<News> getNewsByPage(String pageNum, String pageSize, News query);
    Result getNewsById(Long id);
    Result updateNewsById(News news);
    Result addNews(News news);

    Result deleteNewsById(Long id);

}
