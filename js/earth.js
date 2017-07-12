//自定义地球类
Earth = function(){
    Sim.Object.call(this);
}
Earth.prototype = new Sim.Object();

Earth.prototype.init = function(param){
  /*  //创建地球球体并添加纹理
    var earthmap = "images/earth_surface_2048.jpg";
    var geometry = new THREE.SphereGeometry(1,32,32);
    var texture = THREE.ImageUtils.loadTexture(earthmap);
    var material = new THREE.MeshPhongMaterial({map:texture});
    var mesh = new THREE.Mesh(geometry,material);

    //稍微倾斜一下
    mesh.rotation.z = Earth.TILT;
    //把对象传递给框架
    this.setObject3D(mesh);*/

    param = param || {};
    this.animateOrbit = param.animateOrbit || false;
    this.period = param.period;
    this.revolutionSpeed = param.revolutionSpeed?param.revolutionSpeed : Earth.ROTATION_Y;
    this.rotationSpeed = this.revolutionSpeed * 365 /2;
    this.cloudsRotationSpeed = this.rotationSpeed * Earth.CLOUDS_ROTATION_FACTOR;


    var earthOrbitGroup = new THREE.Object3D();

    this.setObject3D(earthOrbitGroup);
    //创建一个包含地球和云层的群组
    var earthGroup = new THREE.Object3D();

    var distance = param.distance || 0;
    var distquared = distance * distance;
    earthGroup.position.set(Math.sqrt(distquared/2),0,-Math.sqrt(distquared/2));
    earthOrbitGroup.add(earthGroup);
    this.earthGroup = earthGroup;
    var size = param.size || 1;
    this.earthGroup.scale.set(size,size,size);


    //添加地球对象和云层对象
    if(param.hires)
    {
        this.createShaderGloble();
        this.createClouds();
    }
    else
    {
        this.createLitGlobe();
    }

    //添加月球
    this.createMoon(size,distance,this.rotationSpeed/Moon.PERIOD);
    if(param.showOrbit)
    {
        this.createMoonOrbit(distance,size);
    }



}

Earth.prototype.update = function(){
    //让地球动起来
    //this.object3D.rotation.y += Earth.ROTATION_Y;
    if(this.animateOrbit)
    {
        this.object3D.rotation.y += this.revolutionSpeed;
    }
    if(this.animateRotation)
    {
        this.globeMesh.rotation.y += this.rotationSpeed;
        //让云层动起来
        if(this.cloudsMesh)
        {
            this.cloudsMesh.rotation.y += this.cloudsRotationSpeed;
        }
    }

    
    //this.cloudsMesh.rotation.y += Earth.CLOUDS_ROTATION_Y;

    Sim.Object.prototype.update.call(this);
}

Earth.prototype.createShaderGloble = function(){
    //创建多重纹理，包括一张用于高度图的法线贴图和一张高光贴图
    var surfaceMap = THREE.ImageUtils.loadTexture("images/earth_surface_2048.jpg");
    var normalMap = THREE.ImageUtils.loadTexture("images/earth_normal_2048.jpg");
    var specularMap = THREE.ImageUtils.loadTexture("images/earth_specular_2048.jpg");

    var shader = THREE.ShaderUtils.lib["normal"],
    uniforms = THREE.UniformsUtils.clone(shader.uniforms);//创建一个叫uniform的对象，并在其中填充了几个命名的属性，这些值将作为参数传递给着色器

    uniforms["tNormal"].texture = normalMap;
    uniforms["uNormalScale"].value = 0.85;

    uniforms["tDiffuse"].texture = surfaceMap;
    uniforms["tSpecular"].texture = specularMap;

    uniforms[ "enableAO" ].value = false;
    uniforms[ "enableDiffuse" ].value = true;//设置几个布尔值属性来告诉着色器在计算时也要使用颜色值和高光值
    uniforms[ "enableSpecular" ].value = true;

    uniforms[ "uDiffuseColor" ].value.setHex( 0xffffff );
    uniforms[ "uSpecularColor" ].value.setHex( 0x333333 );
    uniforms[ "uAmbientColor" ].value.setHex( 0x000000 );

    uniforms[ "uShininess" ].value = 15;

    var shaderMaterial = new THREE.ShaderMaterial({
        fragmentShader:shader.fragmentShader,//自定义片段着色器
        vertexShader:shader.vertexShader,//自定义定点着色器
        uniforms:uniforms,//自定义uniform变量
        lights:true//是否使用场景内灯光，默认关闭
    });

    var globeGeometry = new THREE.SphereGeometry(1,32,32);
    //为着色器计算切线
    globeGeometry.computeTangents();//计算切线 切线用于计算法线贴图值时必要的向量值，默认情况下three.js不会为几何体计算切线
    var globeMesh = new THREE.Mesh(globeGeometry,shaderMaterial);
    //倾斜地球
    globeMesh.rotation.z = Earth.TILT;
    //添加到群组中
    this.earthGroup.add(globeMesh);
    //保存之后就可以旋转了
    this.globeMesh = globeMesh;
}
Earth.prototype.createLitGlobe = function(){
    //创建地球纹理
    var earthmap = "images/earth_surface_2048.jpg";
    var geometry = new THREE.SphereGeometry(1,32,32);
    var texture = THREE.ImageUtils.loadTexture(earthmap);
    var material = new THREE.MeshPhongMaterial({map:texture});
    var globeMesh = new THREE.Mesh(geometry,material);

    globeMesh.rotation.z =Earth.TILT;

    this.earthGroup.add(globeMesh);

    this.globeMesh = globeMesh;
}
Earth.prototype.createClouds = function(){
    //创建云层
    var cloudsMap = THREE.ImageUtils.loadTexture("images/earth_clouds_1024.png");
    var cloudsMaterial = new THREE.MeshLambertMaterial({
        color:0xffffff,//材质颜色
        map:cloudsMap,//纹理贴图
        transparent:true//是否支持材质透明
    });

    var cloudsGeometry = new THREE.SphereGeometry(Earth.CLOUDS_SCALE,32,32),
    cloudsMesh = new THREE.Mesh(cloudsGeometry,cloudsMaterial);
    cloudsMesh.rotation.z = Earth.TILT;

    //添加到群组中
    this.earthGroup.add(cloudsMesh);

    //保存之后就可以旋转了
    this.cloudsMesh = cloudsMesh;
}

Earth.prototype.createMoon = function(size,distance,rotationSpeed){
    var moon = new Moon();
    moon.init({size:size,distance:distance,rotationSpeed:rotationSpeed});
    this.addChild(moon);
    var distquared = distance * distance;
    moon.setPosition(Math.sqrt(distquared/2),0,-Math.sqrt(distquared/2));
}
Earth.prototype.createMoonOrbit = function(distance,size){
    var moonOrbit = new Orbit();
    moonOrbit.init(Moon.DISTANCE_FROM_EARTH/Earth.RADIUS/size);
    this.addChild(moonOrbit);
    var distquared = distance * distance;
    moonOrbit.setPosition(Math.sqrt(distquared/2),0,-Math.sqrt(distquared/2));
}
Earth.ROTATION_Y = 0.003;
Earth.TILT = 0.41;
Earth.RADIUS = 6371;
Earth.CLOUDS_SCALE = 1.005;
Earth.CLOUDS_ROTATION_FACTOR = 0.95;

/*Sun = function(){
    Sim.Object.call(this);
}
Sun.prototype = new Sim.Object();

Sun.prototype.init = function(){
    //创建一个点光源照射地球，并放置于屏幕外部偏左一点的地方
    var light = new THREE.PointLight(0xffffff,2,100);
    light.position.set(-10,0,20);

    //把对象反馈给框架
    this.setObject3D(light);
}*/

Moon = function(){
    Sim.Object.call(this);
}

Moon.prototype = new Sim.Object();

Moon.prototype.init = function(param){
    param = param || {};
    
    this.rotationSpeed = param.rotationSpeed || Moon.ROTATION_SPEED;
    var size = param.size || 1;
    
    // Create a group to contain the Moon and orbit
    var moonGroup = new THREE.Object3D();
    var MOONMAP = "images/moon_1024.jpg";
    var geometry = new THREE.SphereGeometry(Moon.SIZE_IN_EARTHS*size,32,32);
    var texture = THREE.ImageUtils.loadTexture(MOONMAP);
    var material = new THREE.MeshPhongMaterial({
        map:texture,
        ambient:0x888888
    });
    var mesh = new THREE.Mesh(geometry,material);
    //转换成地球尺度的单位（把地球当做单位球体）
    var distance = Moon.DISTANCE_FROM_EARTH/Earth.RADIUS;
    mesh.position.set(Math.sqrt(distance/2),0,-Math.sqrt(distance/2));

    //旋转月球，让他的一个面始终朝向地球
    mesh.rotation.y = Math.PI;

    //创建一个群组来容纳地球和月球
    var moonGroup = new THREE.Object3D();
    moonGroup.add(mesh);

    //向黄道面倾斜
    //moonGroup.rotation.x = Moon.INCLINATION;

    //将对象传递给框架
    this.setObject3D(moonGroup);

    //保存月球网格
    //this.moonMesh = mesh;
}

Moon.prototype.update = function(){
    //月球轨道
    this.object3D.rotation.y += this.rotationSpeed;
    Sim.Object.prototype.update.call(this);
}

Moon.DISTANCE_FROM_EARTH = 356400;
Moon.PERIOD = 28;
Moon.ROTATION_SPEED = 0.003;;
Moon.EXAGGERATE_FACTOR = 1.2;
Moon.SIZE_IN_EARTHS = 1 / 3.7 * Moon.EXAGGERATE_FACTOR;