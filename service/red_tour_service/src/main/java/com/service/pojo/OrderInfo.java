package com.service.pojo;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class OrderInfo {
    //根据scenicId查询景区名称
    @TableField(exist = false)
    String scenicName;

    //根据userId查询用户名称
    @TableField(exist = false)
    String userName;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @TableId(type = IdType.AUTO)
    String id;
    String userId;
    String scenicId;
    String orderTime;
    String content;
    String phone;
    String time;


}
