
'use strict';

(function () {

    let graphElements = [
        ["A1", "A2", "A3"],
        ["B1", "B2"],
        ["C1", "C2", "C3", "C4"]
    ];

    let graph = (function (graphElements) {

        let paper = Raphael("graph");

        function Element(name, col, row) {

            //circel element
            let el = paper.circle(col, row, 30);
            el.node.id = name;
            el.attr({
                stroke: 'gray',
                'stroke-width': 7,
                'stroke-opacity': '0.5',
                fill: '#61B329',
                cursor: 'pointer',
                class: 'graph-element'
            });

            //circle text
            var text = paper.text(col, row, name);
            text.node.id = name;
            text.attr({
                'font-size': 16,
                'font-family': 'Arial, Helvetica, sans-serif',
                cursor: 'pointer',
                fill: 'white',
                class: 'graph-element'
            })

            return {
                element: el,
                text: text,
            }

        }

        function bootstrap(graphElements) {

            let graph = [];

            for (let i = 0; i < graphElements.length; i++) {

                let elementsGroup = graphElements[i];
                let row = ((i + 1) * 100);

                for (let j = 0; j < elementsGroup.length; j++) {

                    let col = ((j + 1) * 90);

                    let el = new Element(graphElements[i][j], col, row);

                    graph.push(el);
                }
            }

            return graph;
        }

        return bootstrap(graphElements);

    })(graphElements)
    
    return graph;
    
})()

