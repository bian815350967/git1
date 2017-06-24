$(function () {
    // 顶部购物车滑入滑出
    $(".topbar-cart").mouseenter(function () {
        $('.cart-menu').stop().slideDown();
    });
    $(".topbar-cart").mouseleave(function () {
        $('.cart-menu').stop().slideUp();
    });

    // 顶部搜索框显示隐藏
    $('.search-text').focus(function () {
        $(this).css("border", '1px solid red');
        $('.btn-search').css("border", '1px solid red');
        $('.hongmi').hide();
        $('.phone').slideDown();
    })
    $('.search-text').blur(function () {
        $(this).css("border", '1px solid #e0e0e0');
        $('.btn-search').css("border", '1px solid #e0e0e0');
        $('.hongmi').show();
        $('.phone').slideUp();
    })

    // 获取头部导航栏关键字
    $.ajax({
        url: 'http://127.0.0.1:9900/api/nav',
        success: function (data) {
            var jsArr = JSON.parse(data);

            // console.log(jsArr);
            var jsArr2 = template('itemNav', jsArr);
            $('.header-nav ul').html(jsArr2);

            $('.header-fowords .header-nav ul').on('mouseenter', 'li a', function () {
                var oType = $(this).attr('type');
                // console.log(oType);

                var _index = $(this).parent().index();
                // console.log(_index);
                if (!oType) {
                    $('.fowords-imgs ul').html('');
                    $('.fowords-imgs').stop().animate({
                        'height': '0px',
                        'opacity': '0'
                    })
                    return;
                }

                $.ajax({
                    url: 'http://127.0.0.1:9900/api/nav',
                    data: {
                        type: oType
                    },
                    success: function (data) {
                        // console.log(data);
                        $('.fowords-imgs').stop().animate({
                            'height': '230px',
                            'opacity': '1'
                        });

                        $('.fowords-imgs ul').html('');
                        var data1 = JSON.parse(data);
                        var data2 = template('itemNav-img', data1);
                        $('.fowords-imgs ul').html(data2);
                        // $('.fowords-imgs').on('mouseenter', function () {
                        //     $('.header-nav ul a').eq(_index).css('color', '#ff6700').siblings().css('color', '#333');
                        // })

                        // 顶部关键字移出，图片隐藏
                        $('.header-fowords').on('mouseleave', function () {
                            $('.fowords-imgs').stop().animate({
                                'height': '0px',
                                'opacity': '0'
                            });
                            $('.fowords-imgs ul').html('');
                            // $('.header-nav ul a').eq(_index).css('color', '#333');
                        })
                    }
                })
            });

        }
    })


    // 轮播图侧边栏选项卡
    $.ajax({
        url: 'http://127.0.0.1:9900/api/items',
        success: function (data) {
            var contentArr = JSON.parse(data);
            // console.log(contentArr);
            var contentArr2 = template('navMeun', contentArr);
            $('.container-nav-menu .top-side-left ul').html(contentArr2);

            // 选项卡右拉框
            $('.top-side-left li a').on('mouseenter', function () {
                $('.site-category-detail ul').html('');
                var _index = $(this).parent().index();
                // console.log(_index);

                var tp = $(this).attr('type');

                $.ajax({
                    url: 'http://127.0.0.1:9900/api/items',
                    data: {
                        type: tp
                    },
                    success: function (data) {
                        $('.site-category-detail').css('display', 'block');
                        var data1 = JSON.parse(data);
                        // console.log(data1);
                        var data2 = template('category-items', data1);
                        $('.site-category-detail ul').html(data2);

                        $('.site-category-detail').on('mouseenter', function () {
                            $(this).css('display', 'block');
                            $('.top-side-left li').eq(_index).css('backgroundColor', '#ff6700').siblings().css('backgroundColor', '');
                        });

                        $('.top-side-left').on('mouseleave', function () {
                            $('.site-category-detail').css('display', 'none');
                        });

                        $('.site-category-detail').on('mouseleave', function () {
                            $(this).css('display', 'none');
                            $('.top-side-left li').eq(_index).css('backgroundColor', '');
                        });
                        var len1 = $('.site-category-detail ul li').length;
                        if (len1 < 6) {
                            $('.site-category-detail ul').css('width', '280px');
                        }
                        if (len1 < 12 && len1 > 6) {
                            $('.site-category-detail ul').css('width', '560px');
                        }
                        if (len1 > 12) {
                            $('.site-category-detail ul').css('width', '800px');
                        }
                    }
                })
            });

        }
    })

    // 获取轮播图
    $.ajax({
        url: 'http://127.0.0.1:9900/api/lunbo',
        success: function (data) {
            var pasData = JSON.parse(data);
            // console.log(data);
            var pasData2 = template('lunbo', pasData);
            $('.container-nav-img ul').html(pasData2);

            //1.鼠标移入，显示左右箭头，清掉定时器
            var pic;
            var timer = null;
            $('.container-nav-img li').css('opacity', 0);
            $('.container-nav-img li').eq(0).css('opacity', 1);

            $('.container-nav-img').on('mouseenter', function () {
                $('.container-nav-img .jiantou span').show();
                clearInterval(timer);
            });
            // 2.鼠标离开，开启自动轮播，隐藏左右箭头
            $('.container-nav-img').on('mouseleave', function () {
                $('.container-nav-img .jiantou span').hide();
                timer = setInterval(function () {
                    setLight()
                }, 3000);
            });


            //4.点击右箭头，调用自动轮播
            $('.container-nav-img .slide-pre span').on('click', function () {
                setLight();
            });

            //5,点击左箭头，图片向左走，显示当前小圆点
            $('.container-nav-img .slide-next span').on('click', function () {
                if (pic >= 0) {
                    pic--;
                } else {
                    pic = $('.container-nav-img li').length - 1;
                }
                $('.container-nav-img li').eq(pic).stop().animate({
                    'opacity': 1
                }, 1000);
                $('.container-nav-img li').eq(pic + 1).stop().animate({
                    'opacity': 0
                }, 1000);
            });

            //6,开启自动轮播
            var timer = setInterval(function () {
                setLight();
            }, 3000)

            //自动轮播函数
            function setLight() {
                if (pic < $('.container-nav-img li').length - 1) {
                    pic++;
                } else {
                    pic = 0;
                }
                $('.container-nav-img li').eq(pic).stop().animate({
                    'opacity': 1
                }, 1000);
                $('.container-nav-img li').eq(pic - 1).stop().animate({
                    'opacity': 0
                }, 1000);
            }
        }
    })

    // 获取智能硬件信息
    $.ajax({
        url: 'http://127.0.0.1:9900/api/hardware',
        success: function (data) {
            var contentArrh = JSON.parse(data);
            // console.log(contentArrh);
            var contentArrImg = template('boxs-list', contentArrh);
            $('.boxs-right .box-list').html(contentArrImg);
        }
    })

    //搭配部分1
    $.ajax({
        url: 'http://127.0.0.1:9900/api/product',
        data: {
            toptitle: 'match'
        },
        success: function (data) {
            // console.log(data);
            var dataArr = template('goods-list', data);
            $('.goods-left ul').html(dataArr);


            var goodData = template('goods-right-item', data);
            $('.goods-right .goods-right-content').html(goodData);

            //    截取最后一个的字符串
            var str = $('.box2-right-ul li:last .goods-title').html().substr(0, 5) + '...';
            $('.box2-right-ul li:last .goods-title').html(str);

            // 判断是否有下拉框
            $('.goods-right-content li').on('mouseenter', function () {
                var rev = $('.goods-right-content li .review').attr('class');
            });
        }
    })

    // 2搭配区域关键字鼠标移入切换内容判断
    $('.around-container .box2-lis li').on('mouseenter', function () {
        // 获取对应key的值
        var keys = $(this).attr('key');
        console.log(keys);
        $(this).addClass('active').siblings().removeClass('active');

        $.ajax({
            url: 'http://127.0.0.1:9900/api/product',
            data: {
                key: keys
            },
            success: function (data) {
                console.log(data);
                var data2 = template('goods-right-slide', data);
                $('.around-container .goods-right .box2-right-ul').html(data2);
                // console.log(data2);
                //    截取最后一个的字符串
                var str = $('.box2-right-ul li:last .goods-title').html().substr(0, 5) + '...';
                $('.box2-right-ul li:last .goods-title').html(str);
            }

        })
    })

    //配件部分1
    $.ajax({
        url: 'http://127.0.0.1:9900/api/product',
        data: {
            toptitle: 'accessories'
        },
        success: function (data) {
            // console.log(data);
            var dataArr = template('goods-list', data);
            $('.peijian .goods-left ul').html(dataArr);


            var goodData = template('peijian-right-item', data);
            $('.peijian .goods-right .goods-right-content').html(goodData);

            //    截取最后一个的字符串
            var str = $('.peijian .goods-right-content li:last .goods-title').html().substr(0, 5) + '...';
            $('.peijian .goods-right-content li:last .goods-title').html(str);

            // 判断是否有下拉框
            $('.goods-right-content li').on('mouseenter', function () {
                var rev = $('.goods-right-content li .review').attr('class');
            });
        }
    })

    // 2配件区域关键字鼠标移入切换内容判断
    $('.peijian .box3-lis li').on('mouseenter', function () {
        // 获取对应key的值
        var keys = $(this).attr('key');
        console.log(keys);
        $(this).addClass('active').siblings().removeClass('active');

        $.ajax({
            url: 'http://127.0.0.1:9900/api/product',
            data: {
                key: keys
            },
            success: function (data) {
                console.log(data);
                var data2 = template('peijian-right-slide', data);
                $('.peijian .goods-right .goods-right-content').html(data2);
                // console.log(data2);
                //    截取最后一个的字符串
                var str = $('.peijian .goods-right-content li:last .goods-title').html().substr(0, 5) + '...';
                $('.peijian .goods-right-content li:last .goods-title').html(str);


            }
        })
    })

    //周边部分1
    $.ajax({
        url: 'http://127.0.0.1:9900/api/product',
        data: {
            toptitle: 'around'
        },
        success: function (data) {
            // console.log(data);
            var dataArr = template('goods-list', data);
            $('.box4-around .box4-left').html(dataArr);


            var goodData = template('box4-right-item', data);
            $('.box4-around .box4-right').html(goodData);

            //    截取最后一个的字符串
            var str = $('.goods-right-content li:last .goods-title').html().substr(0, 5) + '...';
            $('.goods-right-content li:last .goods-title').html(str);

            // 判断是否有下拉框
            $('.goods-right-content li').on('mouseenter', function () {
                var rev = $('.goods-right-content li .review').attr('class');
            });
        }
    })

    // 2周边区域关键字鼠标移入切换内容判断
    $('.box4-around .box4-lis li').on('mouseenter', function () {
        // 获取对应key的值
        var keys = $(this).attr('key');
        console.log(keys);
        $(this).addClass('active').siblings().removeClass('active');

        $.ajax({
            url: 'http://127.0.0.1:9900/api/product',
            data: {
                key: keys
            },
            success: function (data) {
                console.log(data);
                var data2 = template('box4-right-slide', data);
                $('.box4-around .box4-right').html(data2);
                // console.log(data2);
                //    截取最后一个的字符串
                var str = $('.goods-right-content li:last .goods-title').html().substr(0, 5) + '...';
                $('.goods-right-content li:last .goods-title').html(str);


            }
        })
    })

    // 为你推荐区域
    $.ajax({
        url: 'http://127.0.0.1:9900/api/recommend',
        success: function (data) {
            var jsArr = JSON.parse(data);
            // console.log(jsArr);
            var goodData = template('box5-item', jsArr);
            $('.box5-foryou .box5-ul').html(goodData);
            $('.control-left').addClass('disable');
        }
    })
    // 点击时，颜色判断和切换内容
    var index = 1;
    $('.control-left').on('click', function () {
        if ($(this).hasClass('disable')) {
            return;
        }
        index--;
        get();
    });
    $('.control-right').on('click', function () {
        if ($(this).hasClass('disable')) {
            return;
        }
        index++;
        get();
    })

    // 为你推荐切换事件
    function get() {
        $.ajax({
            url: 'http://127.0.0.1:9900/api/recommend',
            data: {
                page: index
            },
            success: function (data) {
                var data1 = JSON.parse(data);
                var data2 = template('box5-item', data1);
                $('.box5-foryou .box5-ul').html(data2);
            }
        });
        // 两端箭头颜色判断
        if (index == 1) {
            $('.control-left').addClass('disable');
        } else {
            $('.control-left').removeClass('disable');
        }

        if (index == 4) {
            $('.control-right').addClass('disable');
        } else {
            $('.control-right').removeClass('disable');
        }
    }

    // 热门产品区域
    $.ajax({
        url: 'http://127.0.0.1:9900/api/hotcomment',
        success: function (data) {
            var data1 = JSON.parse(data);
            // console.log(data1);
            var data2 = template('box6-item', data1);
            $('.hot-container .hot-content').html(data2);
        }
    })

    // 内容图书区域
    $.ajax({
        url: 'http://127.0.0.1:9900/api/content',
        success: function (data) {
            var data1 = JSON.parse(data);
            // console.log(data1);
            var data2 = template('box7-item1', data1);
            $('.box7-content1').html(data2);
        }
    })
    // 内容MIUI主题区域
    $.ajax({
        url: 'http://127.0.0.1:9900/api/content',
        success: function (data) {
            var data1 = JSON.parse(data);
            // console.log(data1);
            var data2 = template('box7-item2', data1);
            $('.box7-content2').html(data2);
        }
    })
    // 内容游戏区域
    $.ajax({
        url: 'http://127.0.0.1:9900/api/content',
        success: function (data) {
            var data1 = JSON.parse(data);
            // console.log(data1);
            var data2 = template('box7-item3', data1);
            $('.box7-content3').html(data2);
        }
    })
    // 内容应用区域
    $.ajax({
        url: 'http://127.0.0.1:9900/api/content',
        success: function (data) {
            var data1 = JSON.parse(data);
            console.log(data1);
            var data2 = template('box7-item4', data1);
            $('.box7-content4').html(data2);
        }
    })
    var conWidth = $('.content').width();
    console.log(conWidth);
    var pic1 = 0;
    var box1 = 0;
    arrow('conbox1');
    arrowClick('conbox1', pic1, box1);
    var pic2 = 0;
    var box2 = 0;
    arrow('conbox2');
    arrowClick('conbox2', pic2, box2);
    var pic3 = 0;
    var box3 = 0;
    arrow('conbox3');
    arrowClick('conbox3', pic3, box3);
    var pic4 = 0;
    var box4 = 0;
    arrow('conbox4');
    arrowClick('conbox4', pic4, box4);

    //    封装鼠标移入显示箭头事件
    function arrow(con) {
        $('.' + con + '').on('mouseenter', function () {
            $('.' + con + ' .jiantou').css('opacity', 1);
        });
        $('.' + con + '').on('mouseleave', function () {
            $('.' + con + ' .jiantou').css('opacity', 0);
        });
    }

    // 封装点击事件
    function arrowClick(con, pic, box) {
        // 右击事件
        $('.' + con + ' .slide-next').on('click', function () {
            if (pic >= 3) {
                return;
            }
            pic++;
            box++;
            var target = -pic * conWidth;

            $('.' + con + ' .dot-list li').removeClass('active');
            $('.' + con + ' .dot-list li').eq(box).addClass('active');
            $('.' + con + ' .sub-content').stop().animate({
                left: target
            });
        })

        // 左击事件
        $('.' + con + ' .slide-pre').on('click', function () {
            if (pic < 1) {
                return;
            }
            pic--;
            box--;
            var target = -pic * conWidth;
            $('.' + con + ' .dot-list li').removeClass('active');
            $('.' + con + ' .dot-list li').eq(box).addClass('active');
            $('.' + con + ' .sub-content').stop().animate({
                left: target
            });
        })
    }

    // 获取视频信息
    $.ajax({
        url: 'http://127.0.0.1:9900/api/video',
        success: function (data) {
            var contentArrh = JSON.parse(data);
            console.log(contentArrh);
            var contentArrImg = template('video-list', contentArrh);
            $('.video-content .video-wrap').html(contentArrImg);

            // 点击弹出视频，遮罩层
            $('.video-content .video-item').on('click', function () {
                var dizhi = $(this).attr('type');
                console.log(dizhi);

                var width = document.body.clientWidth;
                var height = document.body.clientHeight;
                console.log(height);
                $('.zhe').css({
                    'height': height,
                    'width': width
                })

                $('.zhe').css({
                    'opacity': 0.5,
                    'display': 'block'
                });

                $('.video-play').css({
                    animation: 'transShow 0.8s forwards'
                })

                var font = $(this).children('h3').html();
                $('.video-play .font h3').html(font);
            })
        }
    })

    // 视频播放
    $('.video-play .font .icon').on('click', function () {
        $('.video-play').css({
            animation: 'transHidden 1s forwards'
        })

        $('.zhe').css({
            'opacity': 0,
            'display': 'none'
        });
    })
})