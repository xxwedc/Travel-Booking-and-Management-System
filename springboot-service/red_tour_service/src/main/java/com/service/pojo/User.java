package com.service.pojo;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class User {
    @JsonFormat(shape = JsonFormat.Shape.STRING)
        @TableId(type = IdType.AUTO)
    String id;
    String account;
    String password;
    String username;
    Integer sex;
    Integer age;
    String phone;
    String address;
    String joinedTime;
    Integer role;

}
