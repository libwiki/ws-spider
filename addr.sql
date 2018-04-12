/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50553
Source Host           : 127.0.0.1:3306
Source Database       : addr

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2018-04-12 23:27:12
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for t_area
-- ----------------------------
DROP TABLE IF EXISTS `t_area`;
CREATE TABLE `t_area` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL COMMENT '区域、分类名称标签',
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for t_area_classify
-- ----------------------------
DROP TABLE IF EXISTS `t_area_classify`;
CREATE TABLE `t_area_classify` (
  `classify_id` int(11) DEFAULT '0' COMMENT '每一个区域的统计分类ID 来源表：classify',
  `area_id` int(11) DEFAULT '0' COMMENT '城市区域ID 来源表：area'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for t_city
-- ----------------------------
DROP TABLE IF EXISTS `t_city`;
CREATE TABLE `t_city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL COMMENT '城市名称',
  `prefix` varchar(1) DEFAULT NULL COMMENT '城市首字母 如A、B、C',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态',
  `href` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for t_classify
-- ----------------------------
DROP TABLE IF EXISTS `t_classify`;
CREATE TABLE `t_classify` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '区域分类名称',
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for t_hotel
-- ----------------------------
DROP TABLE IF EXISTS `t_hotel`;
CREATE TABLE `t_hotel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL COMMENT '酒店名称（地址采集来源：美团网酒店订购）',
  `href` varchar(200) DEFAULT NULL COMMENT '链接',
  `remark` varchar(300) DEFAULT NULL COMMENT '一个说明（通常可以辅助用户确定详细地址位置）',
  `status` tinyint(1) DEFAULT '1',
  `address` varchar(200) DEFAULT NULL COMMENT '详细的地址（该地址可转换为经纬度）',
  `l_and_l` varchar(255) DEFAULT NULL COMMENT '经纬度',
  `locations_id` int(11) DEFAULT '0' COMMENT '所属地址ID 来源表：locations（通常指该酒店所在更大一些的区域，比如某个广场、某条路）',
  `city_id` int(11) DEFAULT '0' COMMENT '所属城市ID 来源表：city',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for t_hotel_area
-- ----------------------------
DROP TABLE IF EXISTS `t_hotel_area`;
CREATE TABLE `t_hotel_area` (
  `hotel_id` int(11) DEFAULT NULL COMMENT '酒店ID 来源表：hotel',
  `area_id` int(11) DEFAULT NULL COMMENT '城市ID 来源表：area'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for t_locations
-- ----------------------------
DROP TABLE IF EXISTS `t_locations`;
CREATE TABLE `t_locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL COMMENT '地址（一个较大范围地址 例：某个广场、某条路段）',
  `status` tinyint(1) DEFAULT '1',
  `href` varchar(200) DEFAULT NULL COMMENT '链接地址',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for t_locations_area
-- ----------------------------
DROP TABLE IF EXISTS `t_locations_area`;
CREATE TABLE `t_locations_area` (
  `locations_id` int(11) DEFAULT '0' COMMENT '地区id 来源表：locations',
  `area_id` int(11) DEFAULT '0' COMMENT '城市区域ID 来源表：area'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
