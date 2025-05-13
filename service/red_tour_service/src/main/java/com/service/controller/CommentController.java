package com.service.controller;


import com.service.pojo.Comment;
import com.service.pojo.PageItem;
import com.service.pojo.Result;
import com.service.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin   // 解决跨域问题
public class CommentController {
    @Autowired
    CommentService commentService;

    @PostMapping("/comment/getComment")
    public Object getCommentByNewsId(@RequestBody Comment comment) {
        return commentService.getCommentByOtherId(comment);
    }

    @PostMapping("/comment/getCommentByPages/{currentPage}/size/{pageSize}")
    public PageItem<Comment> queryByPage(@PathVariable("currentPage") String current, @PathVariable("pageSize") String size, @RequestBody Comment comment) {
        return commentService.getCommentByPage(current,size,comment);
    }
    @DeleteMapping("/comment/deleteCommentById")
    public Result deleteCommentById(@RequestBody Comment comment) {
        return commentService.deleteCommentById(comment);
    }

    @PostMapping("/comment/addComment")
    public Result addComment(@RequestBody Comment comment){
        return commentService.addComment(comment);
    }
}
