package com.service.utils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

// 声明这是一个Spring服务类，用于生成和保存二维码图片
@Service
public class qrCodeConfig {

    // 定义生成二维码时使用的字符集，这里使用UTF - 8
    private static final String CHARSET = "UTF-8";
    // 定义生成的二维码图片的宽度，单位为像素
    private static final int QR_CODE_WIDTH = 300;
    // 定义生成的二维码图片的高度，单位为像素
    private static final int QR_CODE_HEIGHT = 300;
    // 获取qrcode文件的路径
    private static final String SAVE_DIR = "D:\\hsupp\\nginx\\nginx-1.26.2\\image\\qrcode\\";



    /**
     * 将生成的二维码图片保存到临时文件中
     * @param text 要编码到二维码中的文本内容
     * @return 保存的临时文件的路径
     * @throws WriterException 如果在编码文本到二维码矩阵时发生错误
     * @throws IOException 如果在创建临时文件或写入二维码矩阵到文件时发生错误
     */
    public String saveQRCodeImageToTempFile(String text) throws WriterException, IOException {
        // 创建一个QRCodeWriter对象，用于将文本编码为二维码矩阵
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        // 创建一个Map对象，用于存储编码提示信息
        Map<EncodeHintType, Object> hintMap = new HashMap<>();
        // 设置编码时使用的字符集
        hintMap.put(EncodeHintType.CHARACTER_SET, CHARSET);
        // 将文本编码为二维码矩阵
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, QR_CODE_WIDTH, QR_CODE_HEIGHT, hintMap);
//        // 构建临时文件的完整路径，以 text 作为文件名，扩展名为 .png
//        Path tempFilePath = Paths.get(TEMP_DIR, text + ".png");
//        // 将二维码矩阵写入到临时文件中，图片格式为PNG
//        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", tempFilePath);

        // 构建保存文件的完整路径，以 text 作为文件名，扩展名为 .png
        Path savePath = Paths.get(SAVE_DIR, text + ".png");
        // 创建保存目录（如果不存在）
        Files.createDirectories(savePath.getParent());
        // 将二维码矩阵写入到指定文件中，图片格式为PNG
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", savePath);

        String filePath=savePath.toString();
        // 从文件路径中提取文件名
        String fileName = filePath.substring(filePath.lastIndexOf("\\") + 1);
        // 拼接 URL
        // 返回文件的路径
        return "http://localhost:8888/qrcode/" + fileName;
    }
}