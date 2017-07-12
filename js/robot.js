var RobotApp = function(){
    Sim.App.call(this);
}
RobotApp.prototype = new Sim.App();

RobotApp.prototype.init = function(param){
    Sim.App.prototype.init.call(this,param);

    //创建一个点光源
    var light = new THREE.PointLight(0xffffff,1,20);
    light.position.set(0,0,10);
    /*var light = new THREE.DirectionalLight(0xffffff,1);
    light.position.set(0,0,1);*/
    this.scene.add(light);

    this.camera.position.set(0,.667,13);

    //创建机器人类并添加到框架中
    var robot = new Robot();
    robot.init();
    this.addObject(robot);

    this.root.rotation.y = Math.PI / 4;
    this.robot = robot;
    this.animating = false;
    this.robot.subscribe("complete",this,this.onAnimationCompelte);
}
RobotApp.prototype.update = function(){
    this,root.rotation.y += 0.01;
    Sim.App.prototype.update.call(this);
}
RobotApp.prototype.handleMouseUp = function(x,y){
    this.animating = !this,animating;
    this.robot.animate(this.animating);
}

var Robot = function(){
    Sim.Object.call(this);
}
Robot.prototype = new Sim.Object();
Robot.prototype.init = function(){
    //创建装载机器人的群组
    var bodygroup = new THREE.Object3D;
    //把对象反馈给框架
    this.setObject3D(bodygroup);

    var that = this;
    var url = '../models/robot_cartoon_02/robot_cartoon_02.dae';
    var loader = new Sim.ColladaLoader;//我们的Robot类使用了一个辅助对象Sim.ColladaLoader来载入COLLADA格式的模型
    loader.load(url,function(data){
        that.handleloaded(data);

    });
}
Robot.prototype.handleLoaded = function(data){//回调的handleLoaded()函数从data.sceen中提取数据，然后保存到本地变量model中，并把模型尺寸调整成以米为单位
    if(data)
    {
        var model = data.scene;
        //这个模型使用的单位是厘米，而我们工作的单位是米，所以要进行转换
        model.scale.set(.01,.01,.01);
        this.object3D.add(model);
        //遍历模型寻找带有名称的各个部分
        var that = this;
        THREE.SceneUtils.traverseHierarchy(model,function(n){that.traverseCallback(n);});//THREE.SceneUtils.traverseHierarchy允许我们遍历整个物体的层级以便找到哪些部分是我们需要的
        this.createAnimation();
    }
}
Robot.prototype.traverseCallback = function(n){
    //找到需要发生动画效果的各个部分
    switch(n.name)
    {
        case 'jambe_G':
            this.left_leg = n;break;
        case 'jambe_D':
            this.right_leg = n;break;
        case 'head_container':
            this.head = n;break;
        case 'clef':
            this.key = n;break;
            default:
            break;
    }
}