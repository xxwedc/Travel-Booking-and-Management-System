package com.service.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.service.mapper.CommentMapper;
import com.service.mapper.UserMapper;
import com.service.pojo.*;
import com.service.service.CommentService;
import com.service.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    CommentMapper commentMapper;
    @Autowired
    UserMapper userMapper;


    @Override
    public Result getCommentByOtherId(Comment comment) {
        // 获取前端传输的 id
        Long id = Long.valueOf(comment.getId());
        LambdaQueryWrapper<Comment> lqw = new LambdaQueryWrapper<>();
        // 设置查询条件，otherId 对应传输过来的 id
        lqw.eq(Comment::getOtherId, id);
        // 执行查询
        List<Comment> commentData = commentMapper.selectList(lqw);

        if (commentData!= null) {
            List<Comment> updatedComments = new ArrayList<>();
            for (Comment commentItem : commentData) {
                Comment updatedComment = addUserNameToComment(commentItem);
                updatedComments.add(updatedComment);
            }
            return new Result(200, "评论查询成功", updatedComments);
        } else {
            return new Result(500, "评论查询失败");
        }
    }

    @Override
    public PageItem<Comment> getCommentByPage(String pageNum, String pageSize, Comment query) {
        int num = Integer.parseInt(pageNum);
        int size = Integer.parseInt(pageSize);
        Page<Comment> page = new Page<>(num, size);

        LambdaQueryWrapper<Comment> lqw = new LambdaQueryWrapper<>();
        if (query.getContent()!= null &&!query.getContent().isEmpty()) {
            lqw.like(Comment::getContent, query.getContent());
        }

        Page<Comment> commentList = commentMapper.selectPage(page, lqw);

        // 遍历commentList，通过里面的userID获取用户名
        List<Comment> updatedComments = new ArrayList<>();
        for (Comment commentItem : commentList.getRecords()) {
            Comment updatedComment = addUserNameToComment(commentItem);
            updatedComments.add(updatedComment);
        }

        return new PageItem<Comment>(updatedComments, commentList.getTotal());
    }

    @Override
    public Result deleteCommentById(Comment comment) {
        int ret=Integer.parseInt(comment.getId()) ;
        if(ret>0){
            commentMapper.deleteById(ret);
            return new Result(200, "删除成功");
        }
        return new Result(500, "删除失败");

    }

    @Override
    public Result addComment(Comment comment) {
        System.out.println("comment数据为"+comment);
        String token=comment.getUserId();
        if (JwtUtils.verifyToken(token)) {
            String tokenId = JwtUtils.getAudience(token);
//            将根据token解析到的userId添加到comment
            comment.setUserId(tokenId);
            int ret = commentMapper.insert(comment);
            if (ret > 0) {
                return new Result(200, "评论成功");
            }

        }
        return new Result(500, "评论失败");
    }


    private Comment addUserNameToComment(Comment comment) {
        // 根据评论中的 userId 查询用户信息并设置用户名
        User user = userMapper.selectById(comment.getUserId());
        if (user!= null) {
            comment.setUserName(user.getUsername());
        } else {
            comment.setUserName("未知用户");
        }
        return comment;
    }
}
