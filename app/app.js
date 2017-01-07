
'use strict';

const graphModule = (function () {

    //in memmory
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
    function Element(name, children = []) {
        this.name = name;
        this.children = children.slice();
        this.hasChildren = this.hasChildren();
    };
    Element.prototype.hasChildren = function () {

        return this.children.length !== 0 ? true : false;
    };

    //view
    let view = {

        init: function(){
            
        }
    };

    //methods
    let methods = {
        /**
         * refresh method: 1. get graphRelations
         *                 2. call drawRelation function for each relation
        */
        helpers: {
            parseInput: function (input, graph) {

                let result = [];
                let firstElement = helpers.findByName(input, graph);
                result.push(firstElement);

                return result;
            },
            findByName: function (input, graph) {

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
        },
        traversal: {
            getChildren: function (parent) {

                let result = [];

                if (parent.hasChildren) {

                    parent.children.forEach(child => {
                        result.push(helpers.findByName(child, graph));
                    });

                    return result;
                }
                else {
                    return null;
                }
            },
            linkToChildren: function (parent) {

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
            },
            getParents: function (child, graph) {

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
            },
            linkToParents: function (child, parents) {

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
        },
        traverseChildren: function traverseChildren(parents, graph, relations = []) {

            if (parents.length === 0) {

                return relations;
            }
            else {

                let element = parents[0];

                if (element.hasChildren) {

                    let newRelations = relations.slice();
                    newRelations = newRelations.concat(traversal.linkToChildren(element));

                    let children = traversal.getChildren(element);
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

        },
        traverseParents: function traverseParents(children, graph, relations = []) {

            if (children.length === 0) {

                return relations;
            }
            else {

                let element = children[0];
                let parents = traversal.getParents(element, graph);

                if (parents.length !== 0) {

                    let newRelations = relations.slice();
                    newRelations = newRelations.concat(traversal.linkToParents(element, parents));

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
    };

    //controller
    let controller = {
        getRelations: function (input, graph) {

            let relations = [];
            let parsed = helpers.parseInput(input, graph);

            relations = relations.concat(methods.traverseChildren(parsed, graph));
            relations = relations.concat(methods.traverseParents(parsed, graph));

            return relations;
        }
    };

    //eventHandlers
    let eventHandlers = {
        clickOnElement: function () {

            /*input = jQerry get clikced element*/
            let relations = controller.getRelations(input, graph);

            return methods.refresh(relations);
        }
    }

    //api
    let api = {
        getRelations: controller.getRelations
    }

    return api;

})();