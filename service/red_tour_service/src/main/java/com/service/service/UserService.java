package com.service.service;

import com.service.pojo.PageItem;
import com.service.pojo.Result;
import com.service.pojo.User;

public interface UserService {
    Result login (User user);

    Result loginByRole (User user);
    Result register(User user);
    Result getUserInfoById(String token);
    Result updateUserInfo(User user);
    //    分页查询
    PageItem<User> getUserByPage(String pageNum, String pageSize, User query);

    Result deleteUserById(User user);

//    密码修改前验证
    Result checkPassword(User query);

}
