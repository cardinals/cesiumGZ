define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/html',
    'dojo/topic',
    'jimu/BaseWidget',
],
    function (declare,
        lang,
        array,
        html,
        topic,
        BaseWidget
    ) {
        return declare([BaseWidget], {
            baseClass: 'jimu-widget-Sign',
            name: 'Sign',
            toggle: true,
            // entities唯一id
            num: 0,
            // num数组
            arr: [],
            // 文件名称
            fileName: '我的标记点',
            // 定位图标位置
            cartesian: '',
            // cartesian数组
            fileArr: [],
            // 保存实体对象
            updateadd: {},
            // 实体名称
            str: '',
            // 存放entities信息的数组
            arrDingWei: [],
            // 存放entities信息的每一个对象
            arrObj: {},
            // updateadd数组
            onClickEntity: [],
            // 请输入名称数组
            arrQsrbz: [],
            // 导入名称数组
            Dname: [],
            // 导入X坐标
            DzbX: '',
            // 导入Y坐标
            DzbY: '',
            // 导入的对象
            Dobj: [],
            // 导入的自定义attr数组
            shuzi: [],
            // 全局pick
            qJpick: {},
            localCartesian: [],
            localname: [],
            localarr: [],
            localqsrbz: [],
            flag: false,
            startup: function () {
                topic.subscribe("openSign", lang.hitch(this, this.onOpenSign));
                var fileNames = '我的标记点';
                var that = this;
                var scene = that.map.scene;
                var cartes = null;
                $('.addPic').click(function (event) {
                    // 监听鼠标移动
                    that.map.screenSpaceEventHandler.setInputAction(function (moveEvent) {
                        $('.danji').css({ 'display': 'block', 'left': moveEvent.startPosition.x + 10 + 'px', 'top': moveEvent.startPosition.y + 10 + 'px' });
                    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    // 监听鼠标点击
                    that.map.screenSpaceEventHandler.setInputAction(function (clickEvent) {
                        $('.sign-tian').hide();
                        that.toggle = true;

                        var pick = that.map.scene.pickPosition(clickEvent.position);
                        // 获取坐标
                        var ray = that.map.camera.getPickRay(clickEvent.position);
                        that.cartesian = scene.globe.pick(ray, scene);
                        // 绘制entity
                        that.fileArr.push(that.cartesian);

                        addPoint(that.cartesian, that.num += 1);
                        window.localStorage.setItem('BJD', JSON.stringify(that.fileArr));
                        window.localStorage.setItem('BJDarr', JSON.stringify(that.arr));

                        $('.sign-tian-hang-textarea').val('');
                        $('.sign-tian').show();

                        $('.sign-tian').css({ 'left': clickEvent.position.x - ($('.sign-tian').innerWidth()) / 2 + 'px', 'top': clickEvent.position.y - 300 + 'px' });
                        if (that.toggle && $('.sign-tian').css('display', 'block')) {
                            that.map.scene.postRender.addEventListener(moveDom);
                            that.toggle = false;
                        } else {
                            that.map.scene.postRender.removeEventListener(moveDom);
                            that.toggle = true;
                        }

                        $('.sign_im_text').val('');
                        $('.sign_im_text').attr('entityid', that.updateadd.id);
                        $('.sign-tian-hang-textarea').attr('entityid', that.updateadd.id);
                        if (that.cartesian) {
                            $('.danji').css('display', 'none');
                            that.map.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                        }

                        that.arrQsrbz.push($('.sign-tian-hang-textarea').val());
                        that.updateadd.label.text = $('.sign_im_text').val() ? $('.sign_im_text').val() : '我的标记';
                        $('.sign-content-my').hide();
                        $('.sign-content').append(`<div class = 'wdbj'><div class = 'dingWeiFei'><input class = 'wdbj-text' disabled value = ${$('.sign_im_text').val() ? $('.sign_im_text').val() : '我的标记'} entitydataid='${$('.sign_im_text').attr('entityid')}'></input></div><img class='wdbj-shanchu' src='../../images/shanchu.png'></img></div>`)

                        that.map.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                })

                // 导入文件
                $('#fileDKWJ').on('change', function (event) {
                    $('#qkbj').trigger('click');
                    that.arrQsrbz = [];
                    that.Dname = [];
                    var date = +new Date();
                    var file = this.files[0]; //获取文件
                    var reader = new FileReader();
                    var datas;
                    reader.readAsText(file, "UTF-8");
                    reader.onload = function () {
                        datas = JSON.parse(reader.result);
                        for (var i = 0; i < datas.length; i++) {
                            that.Dname.push(datas[i].name);
                            that.arrQsrbz.push(datas[i].describe);
                            that.Dzbx = datas[i].x;
                            that.Dzby = datas[i].y;
                            that.fileArr.push({ x: datas[i].x, y: datas[i].y, z: datas[i].z });
                            addPoint(that.fileArr[i], datas[i].shuzi + date);

                            window.localStorage.setItem('BJD', JSON.stringify(that.fileArr));
                            window.localStorage.setItem('BJDarr', JSON.stringify(that.arr));
                            window.localStorage.setItem('BJDname', JSON.stringify(that.Dname));
                            window.localStorage.setItem('BJDqsrbz', JSON.stringify(that.arrQsrbz));

                            that.updateadd.label.text = datas[i].name;
                            $('.sign-content-my').hide();
                            $('.sign-content').append(`<div class = 'wdbj'><div class = 'dingWeiFei'><input class = 'wdbj-text' disabled value = ${that.Dname[i]} entitydataid = ${datas[i].shuzi + date} ></input></div><img class='wdbj-shanchu' src='../../images/shanchu.png'></img></div>`)
                        }
                    };
                    event.target.value = null;
                })


                $('#fileDJWJ').change(function () {
                    var date = +new Date();
                    var file = this.files[0]; //获取文件
                    var reader = new FileReader();
                    var datas;
                    reader.readAsText(file, "UTF-8");
                    reader.onload = function () {
                        datas = JSON.parse(reader.result);
                        for (var i = 0; i < datas.length; i++) {
                            that.arrQsrbz.push(datas[i].describe);
                            that.Dname.push(datas[i].name);
                            that.Dzbx = datas[i].x;
                            that.Dzby = datas[i].y;
                            that.fileArr.push({ x: datas[i].x, y: datas[i].y, z: datas[i].z });
                            addPoint({ x: datas[i].x, y: datas[i].y, z: datas[i].z }, datas[i].shuzi + date);

                            window.localStorage.setItem('BJD', JSON.stringify(that.fileArr));
                            window.localStorage.setItem('BJDarr', JSON.stringify(that.arr));
                            window.localStorage.setItem('BJDname', JSON.stringify(that.Dname));
                            window.localStorage.setItem('BJDqsrbz', JSON.stringify(that.arrQsrbz));

                            that.updateadd.label.text = datas[i].name;
                            $('.sign-content-my').hide();
                            $('.sign-content').append(`<div class = 'wdbj'><div class = 'dingWeiFei'><input class = 'wdbj-text' disabled value = ${datas[i].name} entitydataid = ${datas[i].shuzi + date} ></input></div><img class='wdbj-shanchu' src='../../images/shanchu.png'></img></div>`)
                        }
                    };
                    that.DzbX = '';
                    that.DzbY = '';
                })

                function moveDom() {
                    if (that.cartesian) {
                        var ellipsoid = that.map.scene.globe.ellipsoid;
                        var cartographic = ellipsoid.cartesianToCartographic(that.cartesian);
                        var lat = Cesium.Math.toDegrees(cartographic.latitude);
                        var lng = Cesium.Math.toDegrees(cartographic.longitude);



                        var a = Cesium.Cartesian3.fromDegrees(lng, lat, 200);


                        var px_position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(that.map.scene, a);
                        $('.sign-tian').css({ 'left': px_position.x - ($('.sign-tian').innerWidth()) / 2 + 'px', 'top': px_position.y - 310 + 'px' });
                    }
                }

                // 创建点
                function addPoint(cartesian, id) {
                    that.updateadd = viewer.entities.add({
                        id: id,
                        position: cartesian,
                        billboard: { //图标
                            image: '../../images/dingwei.png',
                            width: 40,
                            height: 40,
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        },
                        label: {
                            text: that.str,
                            font: '8pt Source Han Sans CN',    //字体样式
                            fillColor: Cesium.Color.YELLOW,        //字体颜色
                            backgroundColor: Cesium.Color.AQUA,    //背景颜色
                            // showBackground: true,                //是否显示背景颜色
                            style: Cesium.LabelStyle.FILL,        //label样式
                            outlineWidth: 2,
                            verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,//水平位置
                            pixelOffset: new Cesium.Cartesian2(0, -30),          //偏移
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            disableDepthTestDistance: Number.POSITIVE_INFINITY
                        },

                    });
                    that.arr.push(id);
                    if (that.onClickEntity.indexOf(that.updateadd) == -1) {
                        that.onClickEntity.push(that.updateadd);
                    }
                };

                // 点击定位图标弹框出现并可移动定位图标
                var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
                handler.setInputAction(function (movement) {
                    var pick = that.map.scene.pick(movement.position);
                    if (pick && pick.id) {
                        if (pick.id.id) {
                            for (var i = that.arr.length - 1; i >= 0; i--) {
                                if (pick.id.id == $($('.wdbj')[i]).find('input').attr('entitydataid')) {
                                    var ray = that.map.camera.getPickRay(movement.position);
                                    that.cartesian = scene.globe.pick(ray, scene);
                                    that.map.scene.postRender.addEventListener(moveDom);
                                    $('.sign-tian-hang-textarea').val('');
                                    $('.sign-tian').show();
                                    $('.sign-tian').css({ 'left': movement.position.x - ($('.sign-tian').innerWidth()) / 2 + 'px', 'top': movement.position.y - 300 + 'px' });
                                    $('.sign_im_text').val($($('.wdbj')[i]).find('input').val()).attr('entityid', pick.id.id);
                                    $('.sign-tian-hang-textarea').val(that.arrQsrbz[i]);

                                    // var MoveEntity = (
                                        // function () {
                                            var leftDownFlag = false;
                                            var pointDraged = null;
                                            // var viewer;
                                            // var handler;
                                            // function ConstructMoveEntity(options) {
                                                // viewer = options.viewer;
                                                // handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
                                                // Init();
                                            // }
                                            // function Init() {
                                                // Select plane when mouse down  鼠标按下事件
                                                handler.setInputAction(function (movement) {
                                                    pointDraged = viewer.scene.pick(movement.position);//选取当前的entity 
                                                    leftDownFlag = true;
                                                    if (pointDraged) {
                                                        viewer.scene.screenSpaceCameraController.enableRotate = false;//锁定相机
                                                    }
                                                }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

                                                // Release plane on mouse up  鼠标松开事件
                                                handler.setInputAction(function () {
                                                    leftDownFlag = false;
                                                    pointDraged = null;
                                                    viewer.scene.screenSpaceCameraController.enableInputs = true;
                                                    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                                                    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
                                                    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
                                                }, Cesium.ScreenSpaceEventType.LEFT_UP);

                                                // Update plane on mouse move
                                                handler.setInputAction(function (movement) {
                                                    if (leftDownFlag === true && pointDraged != null) {
                                                        for (var j = 0; j < that.arr.length; j++) {

                                                            if (pointDraged.id.id == $($('.wdbj')[j]).find('input').attr('entitydataid')) {
                                                                let ray = viewer.camera.getPickRay(movement.endPosition);
                                                                let cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                                                                pointDraged.id.position = cartesian;
                                                                that.fileArr[j] = pointDraged.id.position._value;
                                                            }
                                                        }
                                                        $('.sign-tian').css('display', 'none');
                                                        window.localStorage.setItem('BJD', JSON.stringify(that.fileArr));
                                                    }
                                                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                                            // }
                                            // return ConstructMoveEntity;
                                        // })();
                                    // var moveTool = MoveEntity({ 'viewer': that.map });

                                }
                            }
                        }
                    }
                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


                // 清空实体entity
                $('#qkbj').click(function () {
                    for (var i = 0; i < that.arr.length; i++) {
                        that.map.entities.removeById(that.arr[i])
                    };
                    $('.wdbj').remove();
                    $('.sign-content-my').show();
                    that.fileArr = [];
                    that.arrDingWei = [];
                    that.arrObj = [];
                    that.arr = [];
                    that.onClickEntity = [];
                    that.num = 0;
                    that.updateadd = [];
                    that.arrQsrbz = [];
                    window.localStorage.removeItem("BJD");
                    window.localStorage.removeItem("BJDarr");
                    window.localStorage.removeItem("BJDname");
                    window.localStorage.removeItem("BJDqsrbz");
                })


                // 导出文件方法
                function saveShareContent(content, fileName) {
                    var downLink = document.createElement('a')
                    downLink.download = fileName
                    //字符内容转换为blod地址
                    var blob = new Blob([content])
                    downLink.href = URL.createObjectURL(blob)
                    // 链接插入到页面
                    document.body.appendChild(downLink)
                    downLink.click()
                    // 移除下载链接
                    document.body.removeChild(downLink)
                }
                // 导出文件
                $('#bcwj').click(function () {
                    var arrDingWei = [];
                    for (var j = 0; j < that.fileArr.length; j++) {
                        that.arrDingWei.push({
                            date: new Date(+new Date() + 8 * 3600 * 1400).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, ''),
                            name: $($('.wdbj')[j]).find('input').val() ? $($('.wdbj')[j]).find('input').val() : '我的标记',
                            describe: that.arrQsrbz[j],
                            x: that.fileArr[j].x,
                            y: that.fileArr[j].y,
                            z: that.fileArr[j].z,
                            shuzi: $($('.wdbj')[j]).find('input').attr('entitydataid')
                        });

                    }
                    that.arrDingWei.forEach((item, index) => {
                        arrDingWei.push(item);
                    })
                    saveShareContent(JSON.stringify(arrDingWei), that.fileName);
                })


                // 定位到实体
                $('.sign-content').on('click', '.dingWeiFei', function () {
                    if (that.arr.length > 0) {
                        for (var i = 0; i < that.arr.length; i++) {
                            if ($(this).find('.wdbj-text').attr('entitydataid') == that.arr[i]) {
                                var ellipsoid = that.map.scene.globe.ellipsoid;
                                var cartesian3 = new Cesium.Cartesian3(that.fileArr[i].x, that.fileArr[i].y, that.fileArr[i].z);
                                var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
                                var lat = Cesium.Math.toDegrees(cartographic.latitude);
                                var lng = Cesium.Math.toDegrees(cartographic.longitude);
                                that.map.camera.flyTo({
                                    destination: Cesium.Cartesian3.fromDegrees(lng, lat, 20000)
                                });
                            }
                        }
                    }
                })


                // 切换是否解锁图片
                $('#suo').click(function () {
                    if (this.toggle) {
                        $('#jiesuo').attr('src', '../..//images/suo.png')
                        $('.sign-tian-hang-input').attr('disabled', 'disabled');
                        $('.sign-tian-hang-textarea').attr('disabled', 'disabled');
                        this.toggle = false;
                    } else {
                        $('#jiesuo').attr('src', '../..//images/jiesuo.png')
                        $('.sign-tian-hang-input').removeAttr('disabled');
                        $('.sign-tian-hang-textarea').removeAttr('disabled');
                        this.toggle = true;
                    }



                })


                // 点击我的标记x关闭
                $('.sign-head-th-xx').click(function () {
                    $('.jimu-widget-Sign').hide();
                    that.onClose();
                })

                // 点击添加标记x关闭
                $('.sign-tian-xxx').click(function () {
                    $('.sign-tian').hide();
                })

                // 点击添加标记里的保存按钮关闭
                $('.jimu-widget-Sign').on('click', '.baocun', function () {
                    for (var i = 0; i < that.arr.length; i++) {
                        if ($('.wdbj').length > 0) {
                            if ($(this).parent().parent().find('.sign_im_text').attr('entityid') == $($('.wdbj')[i]).find('input').attr('entitydataid')) {
                                $($('.wdbj')[i]).find('input').val($(this).parent().parent().find('input.sign_im_text.sign-tian-hang-input').val() ? $(this).parent().parent().find('input.sign_im_text.sign-tian-hang-input').val() : "我的标记");
                                $('.sign-tian').hide();
                                that.onClickEntity[i].label.text = $($('.wdbj')[i]).find('input').val();
                                that.arrQsrbz[i] = $('.sign-tian-hang-textarea').val();
                                that.Dname[i] = $($('.wdbj-text')[i]).val();
                                window.localStorage.setItem('BJDname', JSON.stringify(that.Dname));
                                window.localStorage.setItem('BJDqsrbz', JSON.stringify(that.arrQsrbz));
                                return
                            }
                        }
                    }


                    $('.sign-tian').hide();
                    that.updateadd.label.text = $('.sign_im_text').val() ? $('.sign_im_text').val() : '我的标记';
                })

                // 点击添加标记里的删除按钮关闭
                $('.jimu-widget-Sign').on('click', '.shanchu', function () {
                    $('.sign-tian').hide();
                    that.map.entities.removeById($('.sign_im_text').attr('entityid'))
                    for (var i = 0; i < that.arr.length; i++) {
                        if ($('.sign_im_text').attr('entityid') == $($('.wdbj')[i]).find('input').attr('entitydataid')) {
                            $($('.wdbj')[i]).hide();
                        }
                    }
                })


                // 点击我的标记里的删除按钮关闭
                $('.sign-content').on('click', '.wdbj-shanchu', function () {
                    if ($(this)[0].className == 'wdbj-shanchu') {
                        $(this).parent().remove();
                        that.map.entities.removeById($(this).prev().find('input').attr('entitydataid'));
                        that.arrDingWei = [];
                    }
                    if ($('.wdbj-shanchu').length == 0) {
                        $('.sign-content-my').show();
                    }

                    for (var i = 0; i < that.arr.length; i++) {
                        if ($(this).prev().find('input').attr('entitydataid') == that.arr[i]) {
                            that.fileArr.splice(i, 1);
                            that.onClickEntity.splice(i, 1);
                            that.arrQsrbz.splice(i, 1);
                            that.Dname.splice(i, 1);
                            that.arr.splice(i, 1);
                        }
                    }
                    window.localStorage.setItem('BJD', JSON.stringify(that.fileArr));
                    window.localStorage.setItem('BJDarr', JSON.stringify(that.arr));
                    window.localStorage.setItem('BJDname', JSON.stringify(that.Dname));
                    window.localStorage.setItem('BJDqsrbz', JSON.stringify(that.arrQsrbz));
                })

            },

            onOpenSign: function (item) {
                if (item == this.name) {
                    this.flag = true;
                    this.onOpen();
                }
            },

            onOpen: function () {
                var that = this;
                if (that.flag == true && window.localStorage.getItem("BJD")) {
                    that.localarr = JSON.parse(window.localStorage.getItem("BJDarr"));
                    that.localname = JSON.parse(window.localStorage.getItem("BJDname"));
                    that.localqsrbz = JSON.parse(window.localStorage.getItem("BJDqsrbz"));
                    for (var i = 0; i < JSON.parse(window.localStorage.getItem("BJD")).length; i++) {
                        that.fileArr.push(JSON.parse(window.localStorage.getItem("BJD"))[i]);
                        addPoint(JSON.parse(window.localStorage.getItem("BJD"))[i], that.localarr[i]);
                       
                        $('.sign-tian-hang-textarea').val(that.localqsrbz[i]);
                        $('.sign_im_text').val(that.localname[i]);
                        $('.sign-content').append(`<div class = 'wdbj'><div class = 'dingWeiFei'><input class = 'wdbj-text' disabled value = ${that.localname[i]} entitydataid = ${that.localarr[i]} ></input></div><img class='wdbj-shanchu' src='../../images/shanchu.png'></img></div>`)
                        that.onClickEntity[i].label.text = that.localname[i];
                        that.Dname.push(JSON.parse(window.localStorage.getItem("BJDname"))[i]);
                        that.arrQsrbz.push(JSON.parse(window.localStorage.getItem('BJDqsrbz'))[i])
                    }
                    window.localStorage.setItem('BJD', JSON.stringify(that.fileArr));
                    window.localStorage.setItem('BJDarr', JSON.stringify(that.arr));
                    if ($('.wdbj').length > 0) {
                        $('.sign-content-my').hide();
                    }
                    function addPoint(cartesian, id) {
                        that.updateadd = that.map.entities.add({
                            id: id,
                            position: cartesian,
                            billboard: { //图标
                                image: '../../images/dingwei.png',
                                width: 40,
                                height: 40,
                                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                                disableDepthTestDistance: Number.POSITIVE_INFINITY
                            },
                            label: {
                                text: that.str,
                                font: '8pt Source Han Sans CN',    //字体样式
                                fillColor: Cesium.Color.YELLOW,        //字体颜色
                                backgroundColor: Cesium.Color.AQUA,    //背景颜色
                                // showBackground: true,                //是否显示背景颜色
                                style: Cesium.LabelStyle.FILL,        //label样式
                                outlineWidth: 2,
                                verticalOrigin: Cesium.VerticalOrigin.CENTER,//垂直位置
                                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,//水平位置
                                pixelOffset: new Cesium.Cartesian2(0, -30),          //偏移
                                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                                disableDepthTestDistance: Number.POSITIVE_INFINITY
                            },
    
                        });
                        that.arr.push(id);
                        if (that.onClickEntity.indexOf(that.updateadd) == -1) {
                            that.onClickEntity.push(that.updateadd);
                        }
                    };
                }
            },

            onClose: function () {
                //面板关闭的时候触发 （when this panel is closed trigger）
                this.flag = false;
            },

            onMinimize: function () {
                this.resize();
            },

            onMaximize: function () {
                this.resize();
            },

            resize: function () {
            },

            destroy: function () {
                //销毁的时候触发
                //todo
                //do something before this func
            }

        });
    });