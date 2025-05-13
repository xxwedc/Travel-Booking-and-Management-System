package com.service.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.service.pojo.News;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NewsMapper extends BaseMapper<News> {

//    用于设置前端传输过来的news 对象中的主键属性为新插入记录的主键值
//    可以通过news.getId()获取到新插入数据的id
    int insert(News news);
}
