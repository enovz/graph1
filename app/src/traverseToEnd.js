
'use strict';

(function () {

    /**data */
    let firstParent = ["B2"];
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

    //traverseToEnd
    let relations = (function traverseToEnd(firstParent, graph) {

        //findByName
        function findByName(input, graph) {

            for (let i = 0; i < graph.length; i++) {

                let graphGroup = graph[i];

                let result = graphGroup.filter(element => {
                    return element.name === input;
                })

                if (result.length !== 0) {
                    return result[0];
                }
            }

        }
        //getChildren
        function getChildren(parent) {

            let result = [];

            if (parent.hasChildren) {

                parent.children.forEach(child => {
                    result.push(findByName(child, graph));
                });

                return result;
            }
            else {
                return null;
            }
        }
        //linkToChildren
        function linkChildrenTo(parent) {

            let relations = [];

            if (parent.hasChildren) {

                parent.children.forEach(child => {
                    let relation = {
                        start: parent.name,
                        end: child
                    }

                    relations.push(relation);
                });

                return relations;
            }
            else {
                return null;
            }
        }
        //traverse children
        function traverseChildren(parents, graph, relations = []) {

            if (parents.length === 0) {

                return relations;
            }
            else {

                let element = parents[0];

                if (element.hasChildren) {

                    let newRelations = relations.slice();
                    newRelations = newRelations.concat(linkChildrenTo(element));

                    let children = getChildren(element);
                    let newParents = [];

                    newParents = parents.concat(children);
                    newParents.splice(0, 1);

                    return traverseChildren(newParents, graph, newRelations);
                }
                else {
                    let newParents = parents.slice();
                    newParents.splice(0, 1);

                    return traverseChildren(newParents, graph, relations);
                }

            }

        }

        return traverseChildren(firstParent, graph);

    })(firstParent, graph)

    return relations;

})()