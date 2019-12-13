/*
 Navicat MySQL Data Transfer

 Source Server         : my
 Source Server Type    : MySQL
 Source Server Version : 100315
 Source Host           : localhost:3306
 Source Schema         : guess_sport

 Target Server Type    : MySQL
 Target Server Version : 100315
 File Encoding         : 65001

 Date: 22/08/2019 10:33:26
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for banner
-- ----------------------------
DROP TABLE IF EXISTS `banner`;
CREATE TABLE `banner` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `create_time` int(11) NOT NULL DEFAULT unix_timestamp(current_timestamp()) COMMENT '创建日期',
  `update_time` int(11) NOT NULL DEFAULT unix_timestamp(current_timestamp()) COMMENT '类型名称',
  `img_url` varchar(50) DEFAULT NULL COMMENT '图片地址',
  `addr_url` varchar(50) DEFAULT NULL COMMENT '点击banner跳转您地址',
  `status` int(1) DEFAULT NULL COMMENT '0=启动 1=关闭',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of banner
-- ----------------------------
BEGIN;
INSERT INTO `banner` VALUES (1, 1566283541, 1566283541, '15662860286089bf3eafc1dca323c6c8cf745292412b0.jpg', 'www.baidu.com', 0);
COMMIT;

-- ----------------------------
-- Table structure for games
-- ----------------------------
DROP TABLE IF EXISTS `games`;
CREATE TABLE `games` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '名称',
  `status` int(1) NOT NULL COMMENT '状态 0=启动 1=关闭',
  `img_url` varchar(50) DEFAULT NULL COMMENT '图标',
  `create_time` int(11) NOT NULL DEFAULT unix_timestamp(current_timestamp()) COMMENT '创建时间',
  `update_time` int(11) NOT NULL DEFAULT unix_timestamp(current_timestamp()),
  `games_types_id` int(10) unsigned DEFAULT NULL,
  `games_level_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `match_types_id` (`games_types_id`),
  KEY `match_level_id` (`games_level_id`),
  CONSTRAINT `games_ibfk_1` FOREIGN KEY (`games_types_id`) REFERENCES `games_types` (`id`),
  CONSTRAINT `games_ibfk_2` FOREIGN KEY (`games_level_id`) REFERENCES `games_level` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of games
-- ----------------------------
BEGIN;
INSERT INTO `games` VALUES (8, '美洲赛', 0, '1566287673396banner-left@2x.png', 1566218717, 1566218717, 3, 7);
COMMIT;

-- ----------------------------
-- Table structure for games_level
-- ----------------------------
DROP TABLE IF EXISTS `games_level`;
CREATE TABLE `games_level` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '名称',
  `create_time` int(11) NOT NULL DEFAULT unix_timestamp(current_timestamp()) COMMENT '创建时间',
  `update_time` int(11) NOT NULL DEFAULT unix_timestamp(current_timestamp()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of games_level
-- ----------------------------
BEGIN;
INSERT INTO `games_level` VALUES (7, '每日赛事', 1566210669, 1566210669);
INSERT INTO `games_level` VALUES (8, '顶级赛事', 1566210680, 1566210680);
INSERT INTO `games_level` VALUES (9, '其他赛事', 1566210688, 1566210688);
COMMIT;

-- ----------------------------
-- Table structure for games_point
-- ----------------------------
DROP TABLE IF EXISTS `games_point`;
CREATE TABLE `games_point` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `create_time` int(11) NOT NULL DEFAULT unix_timestamp(current_timestamp()) COMMENT '创建时间',
  `update_time` int(11) NOT NULL DEFAULT unix_timestamp(current_timestamp()),
  `master_count` char(18) DEFAULT '0' COMMENT '主场',
  `slave_count` char(18) DEFAULT '0' COMMENT '从场',
  `room_nums` int(30) DEFAULT 0 COMMENT '房间数',
  `status` int(1) NOT NULL COMMENT '状态 0=启动 1=关闭',
  `master_consult` char(5) DEFAULT NULL COMMENT '主赔率(参考值)',
  `slave_consult` char(5) DEFAULT NULL COMMENT '从赔率(参考值)',
  `games_id` int(10) unsigned DEFAULT NULL,
  `commission` int(2) DEFAULT NULL COMMENT '佣金',
  PRIMARY KEY (`id`),
  KEY `match_id` (`games_id`),
  CONSTRAINT `games_point_ibfk_1` FOREIGN KEY (`games_id`) REFERENCES `games` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of games_point
-- ----------------------------
BEGIN;
INSERT INTO `games_point` VALUES (1, 1566270948, 1566270948, '阿拉特阿美尼亚', '班特列', 0, 0, '2.19', '2.19', 8, 1);
COMMIT;

-- ----------------------------
-- Table structure for games_room
-- ----------------------------
DROP TABLE IF EXISTS `games_room`;
CREATE TABLE `games_room` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `create_time` int(11) NOT NULL DEFAULT unix_timestamp(current_timestamp()) COMMENT '创建时间',
  `update_time` int(11) NOT NULL DEFAULT unix_timestamp(current_timestamp()),
  `created_by` varchar(50) DEFAULT NULL,
  `people` decimal(30,0) DEFAULT NULL COMMENT '人数',
  `rule` int(1) DEFAULT 0 COMMENT '0: 比队  1:赌大小',
  `games_id` int(10) unsigned DEFAULT NULL,
  `status` int(1) DEFAULT NULL COMMENT '状态 0=启动 1=关闭 2=冻结',
  PRIMARY KEY (`id`),
  KEY `match_id` (`games_id`),
  CONSTRAINT `games_room_ibfk_1` FOREIGN KEY (`games_id`) REFERENCES `games` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for games_types
-- ----------------------------
DROP TABLE IF EXISTS `games_types`;
CREATE TABLE `games_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `create_time` int(11) NOT NULL DEFAULT unix_timestamp(current_timestamp()) COMMENT '创建日期',
  `name` varchar(50) NOT NULL COMMENT '类型名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of games_types
-- ----------------------------
BEGIN;
INSERT INTO `games_types` VALUES (3, 1566210733, '篮球');
COMMIT;

-- ----------------------------
-- Table structure for web_admin
-- ----------------------------
DROP TABLE IF EXISTS `web_admin`;
CREATE TABLE `web_admin` (
  `uid` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pass` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(1) DEFAULT 0,
  `time` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accessToken` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expires` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientId` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of web_admin
-- ----------------------------
BEGIN;
INSERT INTO `web_admin` VALUES (1, 'admin', '202cb962ac59075b964b07152d234b70', 0, NULL, 'f74ce8ea1dd3155883aba7462662c4334cd49a67', '2019-08-20 22:00:29.291', 'eggClient');
COMMIT;

-- ----------------------------
-- Table structure for web_news
-- ----------------------------
DROP TABLE IF EXISTS `web_news`;
CREATE TABLE `web_news` (
  `nid` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `con` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `module` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `ord` int(11) DEFAULT NULL,
  `seotitle` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seokeyword` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seodesc` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uid` int(11) DEFAULT NULL,
  `langid` int(11) DEFAULT NULL,
  `time` int(50) DEFAULT NULL,
  `status` int(1) DEFAULT 1,
  `tags` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resource` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `num` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `creator` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `uploadfiles` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hotclick` int(11) DEFAULT 0,
  `salaryrange` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publishTime` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`nid`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of web_news
-- ----------------------------
BEGIN;
INSERT INTO `web_news` VALUES (61, 'sdf', '12ddd3', 'news1', 2, 1, '', '', '', 1, 1, 1495013232, 1, '测试标题一', '测试标题一', '0', 'admin', '[\"1495013182585Lighthouse.jpg\"]', NULL, 20, '', '', '1495013184');
COMMIT;

-- ----------------------------
-- Table structure for web_newsType
-- ----------------------------
DROP TABLE IF EXISTS `web_newsType`;
CREATE TABLE `web_newsType` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ord` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `uid` int(11) DEFAULT NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of web_newsType
-- ----------------------------
BEGIN;
INSERT INTO `web_newsType` VALUES (1, '加入我们', 'joinus', 1, 1, 1325472736, 1);
INSERT INTO `web_newsType` VALUES (2, '媒体资讯', 'news', 1, 1, 1325472736, 1);
COMMIT;

-- ----------------------------
-- Table structure for web_node
-- ----------------------------
DROP TABLE IF EXISTS `web_node`;
CREATE TABLE `web_node` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `template` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `template_name` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `time` int(10) NOT NULL,
  `cont` text CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_tempalte` (`template`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=209 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of web_node
-- ----------------------------
BEGIN;
INSERT INTO `web_node` VALUES (1, 'web_admin', '用户', 1, 1497597955, '%5B%7B%22Field%22%3A%20%22uid%22%2C%20%22Type%22%3A%20%22int(10)%22%2C%20%22Null%22%3A%20%22NO%22%2C%20%22Key%22%3A%20%22PRI%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22auto_increment%22%7D%2C%20%7B%22Field%22%3A%20%22name%22%2C%20%22Type%22%3A%20%22varchar(20)%22%2C%20%22Null%22%3A%20%22NO%22%2C%20%22Key%22%3A%20%22UNI%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22pass%22%2C%20%22Type%22%3A%20%22varchar(50)%22%2C%20%22Null%22%3A%20%22NO%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22status%22%2C%20%22Type%22%3A%20%22int(1)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20%220%22%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22time%22%2C%20%22Type%22%3A%20%22varchar(20)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22accessToken%22%2C%20%22Type%22%3A%20%22varchar(200)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22expires%22%2C%20%22Type%22%3A%20%22varchar(100)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22clientId%22%2C%20%22Type%22%3A%20%22varchar(20)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%20%5D');
INSERT INTO `web_node` VALUES (2, 'web_news', '资讯', 1, 1497597987, '%5B%7B%22Field%22%3A%20%22nid%22%2C%20%22Type%22%3A%20%22int(11)%22%2C%20%22Null%22%3A%20%22NO%22%2C%20%22Key%22%3A%20%22PRI%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22auto_increment%22%7D%2C%20%7B%22Field%22%3A%20%22title%22%2C%20%22Type%22%3A%20%22varchar(200)%22%2C%20%22Null%22%3A%20%22NO%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22con%22%2C%20%22Type%22%3A%20%22longtext%22%2C%20%22Null%22%3A%20%22NO%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22module%22%2C%20%22Type%22%3A%20%22varchar(50)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22type%22%2C%20%22Type%22%3A%20%22int(11)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22ord%22%2C%20%22Type%22%3A%20%22int(11)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22seotitle%22%2C%20%22Type%22%3A%20%22varchar(200)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22seokeyword%22%2C%20%22Type%22%3A%20%22varchar(200)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22seodesc%22%2C%20%22Type%22%3A%20%22varchar(500)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22uid%22%2C%20%22Type%22%3A%20%22int(11)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22langid%22%2C%20%22Type%22%3A%20%22int(11)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22time%22%2C%20%22Type%22%3A%20%22int(50)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22status%22%2C%20%22Type%22%3A%20%22int(1)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20%221%22%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22tags%22%2C%20%22Type%22%3A%20%22varchar(500)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22resource%22%2C%20%22Type%22%3A%20%22varchar(200)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20%22%22%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22num%22%2C%20%22Type%22%3A%20%22varchar(20)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20%220%22%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22creator%22%2C%20%22Type%22%3A%20%22varchar(200)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20%22%22%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22uploadfiles%22%2C%20%22Type%22%3A%20%22text%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22images%22%2C%20%22Type%22%3A%20%22text%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22hotclick%22%2C%20%22Type%22%3A%20%22int(11)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20%220%22%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22salaryrange%22%2C%20%22Type%22%3A%20%22varchar(200)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22location%22%2C%20%22Type%22%3A%20%22varchar(500)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22publishTime%22%2C%20%22Type%22%3A%20%22varchar(50)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%20%5D');
INSERT INTO `web_node` VALUES (3, 'web_newsType', '资讯类别', 1, 1497598042, '%5B%7B%22Field%22%3A%20%22tid%22%2C%20%22Type%22%3A%20%22int(11)%22%2C%20%22Null%22%3A%20%22NO%22%2C%20%22Key%22%3A%20%22PRI%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22auto_increment%22%7D%2C%20%7B%22Field%22%3A%20%22name%22%2C%20%22Type%22%3A%20%22varchar(100)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22link%22%2C%20%22Type%22%3A%20%22varchar(20)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22ord%22%2C%20%22Type%22%3A%20%22int(11)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22status%22%2C%20%22Type%22%3A%20%22int(11)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22time%22%2C%20%22Type%22%3A%20%22int(11)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%2C%20%7B%22Field%22%3A%20%22uid%22%2C%20%22Type%22%3A%20%22int(11)%22%2C%20%22Null%22%3A%20%22YES%22%2C%20%22Key%22%3A%20%22%22%2C%20%22Default%22%3A%20null%2C%20%22Extra%22%3A%20%22%22%7D%20%5D%20');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
