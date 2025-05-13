package com.service.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Images {
    @JsonFormat(shape = JsonFormat.Shape.STRING)
        @TableId(type = IdType.AUTO)
    String id;
    String otherId;
    String path;
}
