class Canvas{
    constructor({id, WIDTH, HEIGHT, WINDOW, callbacks = {} }){
        if (id){
            this.canvas = document.getElementById(id);
        }
        else{
            this.canvas = document.createElement('canvas');
            document.querySelector('body').appendChild(this.canvas);
        }
        this.canvas.isRotate = false;
        const AllRotate =  callbacks.AllRotate.AllRotate instanceof Function ? callbacks.AllRotate.AllRotate : function(){};
        const wheel = callbacks.wheel.wheel instanceof Function ? callbacks.wheel.wheel : function(){};
        this.canvas.addEventListener('wheel', wheel);
        this.canvas.addEventListener('mousemove',AllRotate);
        this.canvas.addEventListener('mouseup', () =>{
            this.canvas.isRotate = false;
        })
        this.canvas.addEventListener('mousedown', ()=>{
            this.canvas.isRotate = true;
        })
        this.context = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;

        this.canvasV = document.createElement('canvas');
        this.contextV = this.canvas.getContext('2d');
        this.canvasV.width = WIDTH;
        this.canvasV.height = HEIGHT;


        this.WINDOW = WINDOW;
        this.PI2 = 2 * Math.PI;
    }

    xSPolygon(x){
        return x  / this.WINDOW.WIDTH * this.canvas.width + this.canvas.width /2;
    }

    ySPolygon(y){
        return this.canvas.height - y / this.WINDOW.HEIGHT * this.canvas.height - this.canvas.height /2 ;
    }


    xS(x){
        return (x - this.WINDOW.LEFT) / this.WINDOW.WIDTH * this.canvas.width;
    }

    yS(y){
        return this.canvas.height - (this.canvas.height * (y - this.WINDOW.BOTTOM ) / this.WINDOW.HEIGHT)
    }

    sx(x) {
        return x * this.WINDOW.WIDTH / this.canvas.width;
    }

    sy(y) {
        return -y * this.WINDOW.HEIGHT / this.canvas.height;
    }

    clear(){
        this.contextV.fillStyle = '#FFFFFF';
        this.contextV.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    //Отрисовка линии
    line(x1, y1, x2, y2, color = '#000000', width = 5) {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.lineWidth = width;
        this.contextV.moveTo(this.xS(x1), this.yS(y1));
        this.contextV.lineTo(this.xS(x2), this.yS(y2));
        this.contextV.stroke();
    }

    //Отрисовка точки
    point(x, y, color = '#f00', size = 2) {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.arc(this.xS(x), this.yS(y), size, 0, this.PI2);
        this.contextV.stroke();
    }
    
    //написание текста
    text(x, y, text, font = '15px bold Arial', color = '#000'){
        this.contextV.fillStyle = color;
        this.contextV.font = font;
        this.contextV.fillText(text, this.xS(x), this.yS(y));
    }

    //Отрисовка полигона
    polygon(points, color = '#000000'){
        this.contextV.fillStyle = color;
        this.contextV.fillStroke = color;
        this.contextV.beginPath();
        this.contextV.moveTo(this.xSPolygon(points[0].x), this.ySPolygon(points[0].y));
        for (let i = 1; i< points.length; i++){
            this.contextV.lineTo(this.xSPolygon(points[i].x), this.ySPolygon(points[i].y))
        };
        this.contextV.closePath();
        this.contextV.fill();

    }
    
    //Отрисовка всего изображения
    render(){
        this.context.drawImage(this.canvasV, 0, 0);
    }
}
