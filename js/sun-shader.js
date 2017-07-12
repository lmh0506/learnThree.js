//自定义太阳类
Sun = function(){
    Sim.Object.call(this);
}
Sun.prototype = new Sim.Object();
Sun.prototype.init = function(){
    //创建群组来容纳太阳网格和光
    var sunGroup = new THREE.Object3D();
    var SUNMAP = "images/lavatile.jpg";
    var NOISEMAP = "images/cloud.png";
    var uniforms = {
        time:{type:"f",value:1.0},//时间值 用于驱动动态纹理的动画效果
        texture1:{type:"t",value:0,texture:THREE.ImageUtils.loadTexture(NOISEMAP)},
        texture2:{type:"t",value:1,texture:THREE.ImageUtils.loadTexture(SUNMAP)}//纹理中的value变量是指纹理的唯一索引
    };
    uniforms.texture1.texture.wrapS = uniforms.texture1.texture.wrapT = THREE.Repeat;
    uniforms.texture2.texture.wrapS = uniforms.texture2.texture.wrapT = THREE.Repeat;//贴图的重复方式
    var material = new THREE.ShaderMaterial({
        uniforms:uniforms,
        vertexShader:document.getElementById('vertexShader').textContent,
        fragmentShader:document.getElementById('fragmentShader').textContent
    });

    //创建太阳网格
    var geometry = new THREE.SphereGeometry(Sun.SIZE_IN_EARTHS,64,64);
    sunMesh = new THREE.Mesh(geometry,material);
    //备份uniform变量，这样我们可以随时改变变量值
    this.uniforms = uniforms;
    //设置一个用于动画的计时器
    this.clock = new THREE.Clock();
    //创建一个照耀太阳系的点光源
    var light = new THREE.PointLight(0xffffff,1.2,100000);
    sunGroup.add(sunMesh);
    sunGroup.add(light);
    //把对象返回给框架
    this.setObject3D(sunGroup);
    
}
Sun.prototype.update = function(){
        var delta =this.clock.getDelta();
        this.uniforms.time.value += delta;
        Sim.Object.prototype.update.call(this);
        this.object3D.rotation.y -= 0.001;
}
    Sun.SIZE_IN_EARTHS = 100;