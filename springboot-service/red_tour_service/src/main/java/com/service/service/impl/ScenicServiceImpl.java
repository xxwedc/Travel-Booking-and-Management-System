package com.service.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.service.mapper.ScenicMapper;
import com.service.pojo.PageItem;
import com.service.pojo.Result;
import com.service.pojo.Scenic;
import com.service.service.ScenicService;
import com.service.utils.ImgConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class ScenicServiceImpl implements ScenicService {

    @Autowired
    ScenicMapper scenicMapper;

    @Autowired
    private ImgConfiguration imgConfig;



    @Override
    public Result getAllScenic() {
        List<Scenic> scenicData = scenicMapper.selectList(null);
        if(scenicData!=null) {
            return  new Result(200,"查询成功",scenicData);
        }else{
            return new Result(500,"查询失败");
        }

    }

    @Override
    public Result getScenicById(Long id) {
        Scenic data =scenicMapper.selectById(id);
        if(data!=null){
            return  new Result(200,"查询成功",data);
        }else{
            return new Result(500,"查询失败");
        }
    }

    @Override
    public Result getOrderScenic() {
        LambdaQueryWrapper<Scenic> lqw = new LambdaQueryWrapper<>();
        // 设置查询条件，查询需要预约的景点，sqlData中Capacity为1则是需要预约的景点
        lqw.eq(Scenic::getCapacity, 1);
        List<Scenic> scenicData = scenicMapper.selectList(lqw);
        if(scenicData!=null) {
            return  new Result(200,"查询成功",scenicData);
        }else{
            return new Result(500,"查询失败");
        }
    }


//    分页查询。参数为（每页条数，全部条数）
    @Override
    public PageItem<Scenic> getScenicByPage(String pageNum, String pageSize, Scenic query) {

        int num = Integer.parseInt(pageNum);
        int size = Integer.parseInt(pageSize);
        Page<Scenic> page = new Page<>(num, size);

        LambdaQueryWrapper<Scenic> lqw = new LambdaQueryWrapper<>();
        lqw.like(query.getName() != null && query.getName() != "", Scenic::getName, query.getName());

        IPage<Scenic> scenicList = scenicMapper.selectPage(page,lqw);

        return  new PageItem<>(scenicList.getRecords(), scenicList.getTotal());
    }

    @Override
    public Result addScenic(Scenic scenic) {
        try{
            int ret= scenicMapper.insert(scenic);
            if (ret>0){
                // 此时 news 对象中的主键属性应该已经被 MyBatis 自动设置为新插入记录的主键值
                Scenic insertedScenic = scenicMapper.selectById(scenic.getId());
                return new Result(200, "插入成功", insertedScenic);
            }
            return new Result(500, "插入失败");
        }catch (Exception e){
            return new Result(500, "异常错误", e.getMessage());
        }
    }

    @Override
    public Result updateScenic(Scenic scenic) {
        System.out.println("--------------------------------");
        System.out.println("Update数据"+scenic);
        try {
            Scenic data= scenicMapper.selectById(scenic.getId());
            if(data!=null){
                scenicMapper.updateById(scenic);
                return new Result(200, "修改成功");
            }
            return new Result(500, "修改失败");

        }catch (Exception e){
            return new Result(500, "异常错误", e.getMessage());
        }
    }

    @Override
    public Result deleteScenic(Long id) {
        Scenic scenic = scenicMapper.selectById(id);
        if (scenic==null){
            return new Result(500, "数据不存在，删除失败");
        }
        try {
            String imgPath =scenic.getImg();
            //删除本地文件
            if(imgPath!=null &&!imgPath.isEmpty()){
                imgConfig.deleteImgFile(imgPath);
            }
            //删除images表里对应的本地文件
            imgConfig.deleteImgByOtherId(id);

            int ret=scenicMapper.deleteById(id);
            if (ret>0){
                return new Result(200, "删除成功");
            }
            return new Result(500, "删除失败");
        }catch (Exception e){
            return new Result(500, "异常错误", e.getMessage());
        }
    }


}
