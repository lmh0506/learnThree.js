Planet = function(){
    Sim.Object.call(this);
}
Planet.prototype = new Sim.Object();
Planet.prototype.init = function(param){
    param = param || {};
    //创建一个轨道组来模拟轨道
    var planetOrbitGroup = new THREE.Object3D();
    //把组返回给框架
    this.setObject3D(planetOrbitGroup);
    //创建一个组包含Planet和云网格
    var planetGroup = new THREE.Object3D();
    var distance = param.distance || 0;
    var distquared = distance * distance;
    planetGroup.position.set(Math.sqrt(distquared/2),0,-Math.sqrt(distquared/2));
    planetOrbitGroup.add(planetGroup);

    this.planetGroup = planetGroup;
    var size = param.size || 1;
    this.planetGroup.scale.set(size,size,size);

    var map = param.map;
    this.createGlobe(map);

    this.animateOrbit = param.animateOrbit;
    this.period = param.period;
    this.revolutionSpeed = param.revolutionSpeed?param.revolutionSpeed:Planet.REVOLUTION_Y;

}
Planet.prototype.createGlobe = function(map){
    //创建带纹理的星球
    var geometry = new THREE.SphereGeometry(1,32,32);
    var texture = THREE.ImageUtils.loadTexture(map);
    var material = new THREE.MeshPhongMaterial({map:texture,ambient:0x333333});
    var globeMesh = new THREE.Mesh(geometry,material);

    this.planetGroup.add(globeMesh);

    this.globeMesh = globeMesh;
}
Planet.prototype.update = function(){
    if(this.animateOrbit)
    {
        this.object3D.rotation.y += this.revolutionSpeed / this.period;
    }
    Sim.Object.prototype.update.call(this);
}
Planet.REVOLUTION_Y = 0.003;