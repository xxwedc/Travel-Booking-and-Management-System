package com.service.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.service.pojo.Comment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommentMapper extends BaseMapper<Comment> {
}
