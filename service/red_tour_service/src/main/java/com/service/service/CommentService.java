package com.service.service;

import com.service.pojo.Comment;
import com.service.pojo.PageItem;
import com.service.pojo.Result;

public interface CommentService {
    Result getCommentByOtherId(Comment comment);

    //    分页查询
    PageItem<Comment> getCommentByPage(String pageNum, String pageSize, Comment query);

    Result deleteCommentById(Comment comment);

    Result addComment(Comment comment);
}
