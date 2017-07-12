Stars = function(){
    Sim.Object.call(this);
}
Stars.prototype = new Sim.Object();
Stars.prototype.init = function(minDistance){
    //创建用于容纳粒子系统的群组
    var starsGroup = new THREE.Object3D();
    var i;
    var starsGeometry = new THREE.Geometry();//先创建一个用于装载粒子系统的群组 用于装载我们生成的粒子的顶点坐标

    //创建随机的粒子位置坐标
    for(i=0;i<Stars.NVERTICES;i++)//生成随机点 确保这些点与太阳之间的最小距离大于冥王星与太阳之间的距离  避免这些背景‘演员’抢了‘主角’的戏份
    {
        var vector = new THREE.Vector3(
                (Math.random()*2-1)*minDistance,
                (Math.random()*2-1)*minDistance,
                (Math.random()*2-1)*minDistance
            );
        if(vector.length()<minDistance)
        {
            vector = vector.setLength(minDistance);
        }
        starsGeometry.vertices.push(new THREE.Vertex(vector));

    }
    //创建恒星的尺寸和颜色取值范围
    var starsMaterials = [];
    for(i=0;i<Stars.NMATERIALS;i++)
    {
        starsMaterials.push(
            new THREE.ParticleBasicMaterial({//THREE.ParticleBasicMaterial 这个对象用于对于定义粒子系统的点的尺寸和颜色 我们为恒星的颜色（灰阶）和尺寸定义
                color:0x101010*(i+1),
                size:i%2+1,
                sizeAttenuation:false//在相机移动时不必重新缩放每个粒子
            }));
    }
    //创建诺干个粒子系统，以圆形围绕方式散布开来，覆盖整个天空
    for(i=0;i<Stars.NPARTICLESSYSTEMS;i++)
    {
        var stars = new THREE.ParticleSystem(starsGeometry,starsMaterials[i%Stars.NMATERIALS]);
        stars.rotation.y = i/(Math.PI*2);
        starsGroup.add(stars);
    }
    //把对象反馈给框架
    this.setObject3D(starsGroup);
}
Stars.NVERTICES = 667;
Stars.NMATERIALS = 8;
Stars.NPARTICLESSYSTEMS = 24;
