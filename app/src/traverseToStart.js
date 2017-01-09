
'use strict';

(function () {

    /**data */
    let firstChild = ["B2"];
    let graph = [
        [
            new Element("A1", ["B1", "B2"]),
            new Element("A2", ["B1"]),
            new Element("A3", ["B2"])
        ],
        [
            new Element("B1", ["C1", "C2", "C3", "C4"]),
            new Element("B2", ["C1", "C3"])
        ],
        [
            new Element("C1"),
            new Element("C2"),
            new Element("C3"),
            new Element("C4")
        ]
    ];

    //traverseToStart
    let relations = (function traverseToStart(firstChild, graph) {

        //getParents
        function getParents(child, graph) {

            let results = [];

            for (let i = 0; i < graph.length; i++) {

                let graphGroup = graph[i];

                graphGroup.forEach(element => {
                    if (element.children.indexOf(child.name) !== -1) {
                        results.push(element);
                    }
                });
            }

            return results;
        }
        //linkToParents
        function link(child, parents) {

            let relations = [];

            parents.forEach(parent => {
                let relation = {
                    start: parent.name,
                    end: child.name
                }

                relations.push(relation);
            });

            return relations;
        }
        //traverseParents
        function traverseParents(children, graph, relations = []) {

            if (children.length === 0) {

                return relations;
            }
            else {

                let element = children[0];
                let parents = getParents(element, graph);

                if (parents.length !== 0) {

                    let newRelations = relations.slice();
                    newRelations = newRelations.concat(link(element, parents));

                    let newChildren = [];

                    newChildren = children.concat(parents);
                    newChildren.splice(0, 1);

                    return traverseParents(newChildren, graph, newRelations);
                }
                else {
                    let newChildren = children.slice();
                    newChildren.splice(0, 1);

                    return traverseParents(newChildren, graph, relations);
                }

            }
        }

        return traverseParents(firstChild, graph);

    })(firstChild, graph)

    return relations;

})()

