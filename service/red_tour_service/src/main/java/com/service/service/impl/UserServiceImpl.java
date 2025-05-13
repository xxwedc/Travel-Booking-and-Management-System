package com.service.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.service.mapper.UserMapper;
import com.service.pojo.PageItem;
import com.service.pojo.Result;
import com.service.pojo.User;
import com.service.service.UserService;
import com.service.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserMapper userMapper;

    @Override
    public Result login(User user) {
        LambdaQueryWrapper<User> lqw = new LambdaQueryWrapper<>();
        // 设置查询条件
        lqw.eq(User::getAccount, user.getAccount());
        // 执行查询
        User userDb = userMapper.selectOne(lqw);
        if (userDb != null) {
            // 对密码进行判断
            if (user.getPassword().equals(userDb.getPassword())) {
                //创建一个令牌，携带用户的id,用户id为查询到的id。
                String Token = JwtUtils.createToken(userDb.getId());
//                获取管理员状态
                Integer role=userDb.getRole();
                if (role==1){
                    // 通过返回的状态码可以判断是否是管理员账号
                    return new Result(201,"登录成功",Token);
                }
                // 登录成功
                return new Result(200,"登录成功",Token);
            }else {
                return new Result(500,"密码错误");
            }
        }else{
            return new Result(500,"账号不存在");
        }
    }

    @Override
    public Result loginByRole(User user) {
        LambdaQueryWrapper<User> lqw = new LambdaQueryWrapper<>();
        // 设置查询条件
        lqw.eq(User::getAccount, user.getAccount());
        // 执行查询
        User userDb = userMapper.selectOne(lqw);
        if (userDb != null) {
//            对用户权限进行判断
            if (userDb.getRole()!=1) {
                return new Result(500,"对不起，您不是该系统管理员！");
            }
            // 对密码进行判断
            if (user.getPassword().equals(userDb.getPassword())) {
                //创建一个令牌，携带用户的id,用户id为查询到的id。
                String Token = JwtUtils.createToken(userDb.getId());
                // 登录成功
                return new Result(200,"登录成功",Token);
            }else {
                return new Result(500,"密码错误");
            }
        }else{
            return new Result(500,"账号不存在");
        }
    }

    @Override
    public Result register(User user) {
        // 注册前先检查账号是否已经注册
        LambdaQueryWrapper<User> lqw = new LambdaQueryWrapper<>();
        // 设置查询条件
        lqw.eq(User::getAccount, user.getAccount());
        // 执行查询
        User userDb = userMapper.selectOne(lqw);
        if (userDb != null) {
            return new Result(500,"该账号已存在");
        }
        int ret=userMapper.insert(user);
        if (ret>0) {
            return new Result(200, "Registration successful");
        } else {
            return new Result(500, "Registration failed");
        }


    }

    @Override
    public Result getUserInfoById(String token) {
        try {
            if (JwtUtils.verifyToken(token)) {
                String tokenId = JwtUtils.getAudience(token);
                if (tokenId!= null) {
                    Long id = Long.parseLong(tokenId);
                    User user = userMapper.selectById(id);
                    if (user!= null) {
                        return new Result(200, "查询成功", user);
                    } else {
                        return new Result(500, "查询失败");
                    }
                }
            }
            return new Result(400, "无效令牌");
        } catch (Exception e) {
            return new Result(500, "内部错误：" + e.getMessage());
        }
    }

    @Override
    public Result updateUserInfo(User user) {
        User man=userMapper.selectById(user.getId());
        if (man!= null) {
            userMapper.updateById(user);
            return new Result(200,"修改成功");
        }else{
            return new Result(500,"修改失败");
        }
    }

    @Override
    public PageItem<User> getUserByPage(String pageNum, String pageSize, User query) {
        int num = Integer.parseInt(pageNum);
        int size = Integer.parseInt(pageSize);
        Page<User> page = new Page<>(num, size);

        LambdaQueryWrapper<User> lqw = new LambdaQueryWrapper<>();
        lqw.like(query.getUsername() != null && query.getUsername() != "", User::getUsername, query.getUsername());
        lqw.like(query.getRole() != null , User::getRole, query.getRole());

        IPage<User> userList = userMapper.selectPage(page,lqw);

        return  new PageItem<User>(userList.getRecords(), userList.getTotal());
    }

    @Override
    public Result deleteUserById(User user) {
        String userId =user.getId();
        User man=userMapper.selectById(userId);
        if (man == null) {
            return new Result(505,"删除失败");
        }
        int ret=userMapper.deleteById(userId);
        if (ret>0) {
            return new Result(200, "删除成功");
        } else {
            return new Result(500, "删除失败");
        }

    }

    @Override
    public Result checkPassword(User query) {

        LambdaQueryWrapper<User> lqw = new LambdaQueryWrapper<>();
        lqw.like(query.getAccount() != null && query.getAccount() != "", User::getAccount, query.getAccount());
        lqw.like(query.getUsername() != null && query.getUsername() != "", User::getUsername, query.getUsername());
        lqw.like(query.getPhone() != null && query.getPhone() != "", User::getPhone, query.getPhone());

        User user = userMapper.selectOne(lqw);
        if (user==null){
            return new Result(500,"验证不通过");
        }
        String userid = user.getId();
        return new Result(200,"验证通过",userid);
    }

}
