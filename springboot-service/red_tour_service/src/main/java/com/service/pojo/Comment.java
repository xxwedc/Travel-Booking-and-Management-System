package com.service.pojo;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comment {


    //根据userId查询用户昵称
    @TableField(exist = false)
    String UserName;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
         @TableId(type = IdType.AUTO)

    String id;
    String otherId;
    String userId;
    String content;
    @JsonFormat(pattern = "yyyy-MM-dd")
    Date time;
}
