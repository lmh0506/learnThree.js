//自定义一个轨道类
Orbit = function(){
    Sim.Object.call(this);
}
Orbit.prototype = new Sim.Object();
Orbit.prototype.init = function(distance){//distance定义了轨道的弧度
    //创建一个空的几何体对象用于装载线的顶点数据
    var geometry = new THREE.Geometry();
    //创建圆周
    var i,len=60,twopi = 2*Math.PI;
    for(i = 0; i<Orbit.N_SEGMENTS;i++)//创建一个空的几何体对象，我们将会在其中填充线的各种数据，然后在x-z平面生成相应的圆周的矢量数据
    {
        var x = distance * Math.cos(i/Orbit.N_SEGMENTS * twopi);
        var z = distance * Math.sin(i/Orbit.N_SEGMENTS * twopi);
        var vertex = new THREE.Vertex(new THREE.Vector3(x,0,z));
        geometry.vertices.push(vertex);
    }

    material = new THREE.LineBasicMaterial({//LineBasicMaterial材质可以指定线条的厚度，颜色，透明度
        color:0xffffff,
        opacity:.5,
        linewidth:2
    });
    //创建线
    var line = new THREE.Line(geometry,material);//串联起了几何体和材质对象
    //把对象返回给框架
    this.setObject3D(line);
}
Orbit.N_SEGMENTS = 120;