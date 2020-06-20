window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.onload = function () {
    const WINDOW = {
        LEFT: -5,
        BOTTOM: -5,
        WIDTH: 10,
        HEIGHT: 10,
        P1: new Point(-10, 10, -30),
        P2: new Point(-10, -10, -30),
        P3: new Point(10, -10, -30),
        CENTER: new Point(0, 0, -3000),
        CAMERA: new Point(0, 0, -5000)
    }

    const ZOOM_OUT = 1.1;
    const ZOOM_IN = 0.9;
    const callbacks = {
        wheel: { wheel },
        move: { move },
        AllRotate: { AllRotate }
    }

    const sur = new Surfaces;
    const canvas = new Canvas({
        id: "canvas",
        WIDTH: 800,
        HEIGHT: 800,
        callbacks: callbacks,
        WINDOW
    });
    
    const graph3D = new Graph3D({ WINDOW });
    //Определение объектов в сцене
    const SCENE = [
        sur.hyperCyilinder()
        /*
        sur.scope(40, 6, new Point(0, 0, 0), '#ffff00' , { rotateOz: new Point(0,0,0)}),
        sur.scope(20, 3, new Point(-6, 0, -6), '#00ffff' , { rotateOz: new Point(-6,0,-6)}),
        sur.scope(20, 3, new Point(6, 0, -6), '#ff00ff'),
        sur.scope(20, 1, new Point(3, -5.5, -2), '#ff0000'),
        sur.scope(20, 1, new Point(-3, -5.5, -2), '#ff0000'),
        sur.scope(20, 1, new Point(0, -6, 0), '#ff0000')
        */

        //Солнечная система
        /*
       sur.sphera(30, 6, new Point, '#FFFF00' , {rotateOz: new Point} ) ,
       sur.sphera(10, 1, new Point(8,8,0), '#8B4513', {rotateOz: new Point}),
       sur.sphera(15, 1, new Point(0,-11,0), '#D2691E', {rotateOz: new Point}),
       sur.sphera(20, 1, new Point(-14,0,0), '#0000FF', {rotateOz: new Point}),
       sur.sphera(15, 1, new Point(0,20,0), '#FF0000', {rotateOz: new Point}),
       sur.sphera(23, 2, new Point(30,0,0), '#A0522D', {rotateOz: new Point}),   
       sur.sphera(40,2, new Point(-54, 0 , 0),'#CD853F', { rotateOz : new Point}), 
       sur.bublik(30, 8, new Point(-54, 0, 0),'#CD853F', { rotateOz : new Point}),
       sur.sphera(30,3.3, new Point(0, 72, 0),'#AFEEEE', { rotateOz : new Point}),
       sur.sphera(30,3.3 , new Point(80, 0, 0),'#00FFFF', { rotateOz : new Point}),
       */
    //   sur.sphera(30, 6, new Point, '#FFFF00' , /*{rotateOz: new Point} */),
       
    ];
    const LIGHT = new Light(-20, 2, -20, 2000);
    const ui = new UI({ callbacks: { move, printPoints, printEdges, printPolygons, printShadows } })

    let canPrint = {
        points: false,
        edges: false,
        polygons: false,
        shadows: false
    }
    function changeSphere(){
        let polygons = SCENE[0].polygons;
        let j = 0;
        for (let i = 0; i < polygons.length; i++){
            j+=1;
            if (j % 2 == 0){
                polygons[i].color = { r: 0, g: 0, b: 0};
            }
            if (j==19){
                j = 0;
            }
        } 
        j = 0;
        for (let i = 0; i < polygons.length; i++){
            j+=1;
            if (j==19){
                for (let k = 1; k <= 19; k++){
                    polygons[i+k].color = { r: 0, g: 0, b: 0};
                    k+=1;
                }
                i +=19;
                j = 0;
            }

        }
    };

    //зум
    function wheel(event) {
        const delta = (event.wheelDelta > 0) ? ZOOM_IN : ZOOM_OUT;
        graph3D.zoomMatrix(delta);
        SCENE.forEach(subject => {subject.points.forEach(point => graph3D.transform(point))
        if (subject.animation){
            for (let key in subject.animation){
                graph3D.transform(subject.animation[key]);
            }
        } 
    });
    }
    //CheckBoxes
    function printPoints(value) {
        canPrint.points = value;
    }

    function printEdges(value) {
        canPrint.edges = value;
    }

    function printPolygons(value) {
        canPrint.polygons = value;
    }

    
    function printShadows(value) {
        canPrint.shadows = value;
    }


    //движение
    function move(direction) {
        switch (direction) {
            case 'up': graph3D.rotateOxMatrix(Math.PI / 180); break;
            case 'down': graph3D.rotateOxMatrix(-Math.PI / 180); break;
            case 'left': graph3D.rotateOyMatrix(Math.PI / 180); break;
            case 'right': graph3D.rotateOyMatrix(-Math.PI / 180); break;
        }
        graph3D.transform(WINDOW.CAMERA);
        graph3D.transform(WINDOW.CENTER);
        graph3D.transform(WINDOW.P1);
        graph3D.transform(WINDOW.P2);
        graph3D.transform(WINDOW.P3);
    }

    //вращение
    function AllRotate(event) {
        if (canvas.canvas.isRotate) {
            if (event.movementY) {
                if (event.movementX) {// крутить вокруг OY
                    const alpha = - canvas.sx(event.movementX) / 10;
                    graph3D.rotateOxMatrix(alpha);
                    graph3D.transform(WINDOW.CAMERA);
                    graph3D.transform(WINDOW.CENTER);
                    graph3D.transform(WINDOW.P1);
                    graph3D.transform(WINDOW.P2);
                    graph3D.transform(WINDOW.P3);
                }
                if (event.movementY) {// крутить вокруг OX
                    const alpha = canvas.sy(event.movementY) / 10;
                    graph3D.rotateOyMatrix(alpha);
                    graph3D.transform(WINDOW.CAMERA);
                    graph3D.transform(WINDOW.CENTER);
                    graph3D.transform(WINDOW.P1);
                    graph3D.transform(WINDOW.P2);
                    graph3D.transform(WINDOW.P3);
                }
            }
        }
    }

    //Отрисовка полигонов
    function printAllPolygon() {
        if (canPrint.polygons) {
            const polygons = [];
            //предварительные рассчеты
            SCENE.forEach(subject => {
                // рассчет расстояния
                 //graph3D.calcCorner(subject, WINDOW.CAMERA);
                 graph3D.calcCenters(subject);
                 graph3D.calcDistance(subject, WINDOW.CAMERA, 'distance');
                 graph3D.calcDistance(subject, LIGHT, 'lumen');
            });
            //рассчет освещенности полигона и его проекции на экран
            SCENE.forEach(subject => {
                //рассчет координат
                for (let i = 0; i < subject.polygons.length; i++) {
                    if (subject.polygons[i].visible){
                        const polygon = subject.polygons[i];
                        const point1 = graph3D.getProection(subject.points[polygon.points[0]]);
                        const point2 = graph3D.getProection(subject.points[polygon.points[1]]);
                        const point3 = graph3D.getProection(subject.points[polygon.points[2]]);
                        const point4 = graph3D.getProection(subject.points[polygon.points[3]]);
                        //рассчет цветов и освещения
                        let { r, g, b } = polygon.color;
                        let {isShadow, dark} = graph3D.calcShadow(polygon, subject, SCENE, LIGHT);
                        if (canPrint.shadows == false){
                            isShadow = false;
                        }
                        const lumen = (isShadow) ? dark : graph3D.calcIllumination(polygon.lumen, LIGHT.lumen);
                        r = Math.round(r * lumen);
                        g = Math.round(g * lumen);
                        b = Math.round(b * lumen);
                        //заполнение полигона
                        polygons.push({
                            points: [point1, point2, point3, point4],
                            color: polygon.rgbToHex(r, g, b),
                            distance: polygon.distance
                        });
                    }
                   
                }
            });
             //отрисовка всех полигонов
            polygons.sort((a, b) => b.distance - a.distance);
            polygons.forEach(polygon => canvas.polygon(polygon.points, polygon.color));
        }
    }

    //Отрисовка объекта
    function printSubject(subject) {
        // print edges
        if(canPrint.edges){
            for (let i = 0; i < subject.edges.length; i++) {
                const edges = subject.edges[i];
                const point1 = subject.points[edges.p1];
                const point2 = subject.points[edges.p2];
                canvas.line(graph3D.getProection(point1).x, graph3D.getProection(point1).y, graph3D.getProection(point2).x, graph3D.getProection(point2).y);
            }
        }
        // print points
        if(canPrint.points){
            for (let i = 0; i < subject.points.length; i++) {
                const points = subject.points[i];
                canvas.point(graph3D.getProection(points).x, graph3D.getProection(points).y);
            }
        }
    }


    function animation() {
        // Закрутим фигуру!!!
        SCENE.forEach(subject => {
            if (subject.animation) {
                for (let key in subject.animation) {      
                    const { x, y, z } = subject.animation[key];
                    const xn = 0 - x;
                    const yn = 0  - y;
                    const zn = 0  - z;
                    const alpha = Math.PI / 180;
                    graph3D.animateMatrix(xn, yn, zn, key, -alpha, -xn, -yn, -zn);
                    subject.points.forEach(point => graph3D.transform(point));
                }
                
            }            
        });
    }

    setInterval(animation,10);


    let FPS = 0;
    let FPSout = 0;
    let timestamp = (new this.Date()).getTime();

    //Обновление отрисовки
    (function animloop() {
        FPS++;
        const currentTimestamp = (new Date()).getTime();
        if (currentTimestamp - timestamp >= 1000) {
            timestamp = currentTimestamp;
            FPSout = FPS;
            FPS = 0;
        }
        graph3D.calcPlaneEquation(); //получить и записать плоскость экрана
        graph3D.calcWindowVectors();
        render();//рисуем сцену
        requestAnimFrame(animloop); //зацикливаем отрисовку
        document.getElementById("fps").innerHTML = "FPS: " + FPSout;
    })();

    //Отрисовка изображения
    function render() {
        canvas.clear();

        printAllPolygon();
        SCENE.forEach(subject => printSubject(subject));
        canvas.text(-9, 9, FPSout);
        canvas.render();
    }
    changeSphere();
    render();
}; 