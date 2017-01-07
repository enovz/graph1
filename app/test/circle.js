
let graph = (function () {

    let paper = Raphael("graph");

    let circles = [];

    //vertical
    /*for (let i = 1; i < 5; i++) {

        let c = paper.circle(40, (i*40), 20);
        circles.push(c);
    }*/

    //horizontal
    for (let i = 1; i < 5; i++) {

        let c = paper.circle((i * 100), 40, 40);

        c.node.id = i;
        c.attr({
            fill: 'green',
            cursor: "pointer"
        });
        c.node.setAttribute("class", "graph-element");

        console.log(c.node);

        circles.push(c);
    }

    $('.graph-element').click(function () {
        alert(this.id);
    });


})()