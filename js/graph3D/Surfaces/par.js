Surfaces.prototype.par = (count = 40, R = 10) => {
    let points = [];
    let edges = [];
    let polygons = [];
    const size = 10;
    const delta = size / count;

    //Создание и заполнение точек
    const da = 2 * Math.PI / count;
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < 2 * Math.PI; j += da) {
            const x = R * Math.cos(j);
            const y = i - 10;
            const z = R * Math.sin(j);
            points.push(new Point(x, y, z));
        }
    }

    //Создание и заполнение граней
    for (let i = 0; i < points.length; i++) {
        if (i + 1 < points.length && (i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1))
        } else if ((i + 1) % count == 0) {
            edges.push(new Edge(i, i - (count - 1)))
        }
        if (i + count < points.length) {
            edges.push(new Edge(i, i + count));
        }
    }

    //Создание и заполнение полигонов 
    for (let i = 0; i < points.length; i++) {
        if (i + 1 + count < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]))
        } else if ((i + count) < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count]))
        }
    }

    return new Subject(points, edges, polygons);
}