package com.service.controller;

import com.service.pojo.PageItem;
import com.service.pojo.Result;
import com.service.pojo.User;
import com.service.service.UserService;
import com.service.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin   // 解决跨域问题
public class UserController {
    @Autowired
    UserService userService;

    @PostMapping("/user/login")
    public Result loginCheck(@RequestBody  User user){
        return userService.login(user);
    }

    @PostMapping("/user/loginByRole")
    public Result loginByRole(@RequestBody  User user){
        return userService.loginByRole(user);
    }


    @PostMapping("/user/register")
    public Result register(@RequestBody User user){
        return userService.register(user);
    }

    @PostMapping("/api/user/getUserInfoById")
    public Result selectUserById(@RequestHeader("Authorization") String token){
        return userService.getUserInfoById(token);
    }

    @PostMapping("/api/updateUserInfo")
    public Result updateUserInfo(@RequestBody User user){
        return userService.updateUserInfo(user);
    }

    @PostMapping("/user/getUserByPage/{currentPage}/size/{pageSize}")
    public PageItem<User> queryByPage(@PathVariable("currentPage") String current, @PathVariable("pageSize") String size, @RequestBody User user) {
        return userService.getUserByPage(current,size,user);
    }

    @PostMapping("/user/deleteUserById")
    public Result deleteUserById(@RequestBody User user) {
        return userService.deleteUserById(user);
    }

    @PostMapping("/user/checkPassword")
    public Result checkPassword(@RequestBody User query) {
        return userService.checkPassword(query);
    }





}
