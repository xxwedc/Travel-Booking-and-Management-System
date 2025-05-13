package com.service.pojo;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.util.List;

@Data
public class Panel {

//    首页状态仪表类，数据库无这一实体

    @TableId(type = IdType.AUTO)
    String id;   //不需要id，但为了消除运行警告，选择添加

    Long scenicCount;
    Long userCount;
    Long orderCount;
    Long commentCount;
    List<Integer> SexList;
    List<Integer> AgeList;
}
