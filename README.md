﻿# Car-eye-streamingGBS-Server


# 功能一览
## 负载均衡

![](https://gitee.com/careye_open_source_platform_group/car-eye-streaming-gbs-view/raw/main/View.png)

##  设备管理

平台管理国标设备，可以手工或者excel导入设备数据。

##  设备监控


平台可以实时监控设备视频，支持对讲和报警查询，支持发送命令到设备
控制云台，调整参数等
![](https://gitee.com/careye_open_source_platform_group/car-eye-streaming-gbs-view/raw/main/monitor.png)   


##  视频回放和下载
StreamingGBS 具有回放视频和下载视频到本地的功能，视频流在云平台完成录制后通过服务器下载到本地。   


![](https://gitee.com/careye_open_source_platform_group/car-eye-streaming-gbs-view/raw/main/replay.png) 

## 平台录像

StreamingGBS 具有平台录像功能，用户可以定制录像计划，将视频录制到云上，并根据需要进行回放

## 平台级联     

StreamingGBS 本身可以作为下级平台运行，也可以作为上级平台运行。当做为最下级平台运行，他对应设备管理，作为
级联层平台他可以用来管理所有下级平台的设备。上级平台可以配置多个。



StreamingGBS 视频服务器主要的功能：

1. 遵照GB28181协议实现。      
2. 支持active-MQ 通信，提供API给各种客户端访问    
3. 支持视频预览，对讲，设备控制等。    
4. 提供丰富的流媒体协议格式输出，既可以直接输出ws-flv转发到RTMP流媒体服务器    
5. 提供ws-flv，http-flv，RTMP，HLS等各种视频输出格式      
  
# 联系我们

car-eye 开源官方网址：www.car-eye.cn    
car-eye 车辆管理平台网址：www.liveoss.com  
car-eye GB28181管理平台网址 ：www.streaming-vip.com:10088     
car-eye 技术官方邮箱: support@car-eye.cn  
car-eye 车辆管理平台技术交流QQ群: 590411159   
car-eye 视频服务和管理平台QQ群：713522732   
![](https://gitee.com/careye_open_source_platform_group/car-eye-jtt1078-media-server/raw/master/QQ/QQ.jpg)     
CopyRight©  car-eye 开源团队 2018-2020
