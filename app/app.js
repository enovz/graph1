
'use strict';

const graphModule = (function () {

    //in memmory
    function Element(name, children = []) {
        this.name = name;
        this.children = children.slice();
        this.hasChildren = this.hasChildren();
    }
    Element.prototype.hasChildren = function () {

        return this.children.length !== 0 ? true : false;
    }
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

    //Raphael paper
    let $paper = $('#graph');

    //view
    let view = {

        init: function bootrapGraph(graph) {

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

            let result = [];

            for (let i = 0; i < graphElements.length; i++) {

                let elementsGroup = graphElements[i];
                let row = ((i + 1) * 100);

                for (let j = 0; j < elementsGroup.length; j++) {

                    let col = ((j + 1) * 90);

                    let el = new Element(graphElements[i][j], col, row);

                    graph.push(el);
                }
            }

            return result;

        },
        createLink: function connect(points) {
            
            let A = points.a;
            let B = points.b;

            //draw line between points on $paper
        }

    };

    //utils
    let utils = {

        findByName: function findByName(input, graph) {

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
    }

    //methods
    let methods = {

        refresh: function graphRelations(relatinos) {

            //first clear all;

            relations.forEach(relation => {
                view.createLink(relation);
            });
        },
        parseInput: function parseInput(input, graph) {

            let result = [];
            let firstElement = utils.findByName(input, graph);
            result.push(firstElement);

            return result;
        },
        traverseToEnd: function traverseToEnd(firstParent, graph) {
            //getChildren
            function getChildren(parent) {

                let result = [];

                if (parent.hasChildren) {

                    parent.children.forEach(child => {
                        result.push(utils.findByName(child, graph));
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
        },
        traverseToStart: function traverseToStart(firstChild, graph) {
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
        }
    }

    //controller
    let controller = {

        getRelations: function (input, graph) {

            let relations = [];
            let parsed = methods.parseInput(input, graph);

            relations = relations.concat(methods.traverseToEnd(parsed, graph));
            relations = relations.concat(methods.traverseToStart(parsed, graph));

            return relations;
        }
    };

    //eventHandlers
    let eventHandlers = {
        clickOnElement: function (input) {

            console.log(input);
            let relations = controller.getRelations(input, graph);

            return methods.refresh(relations);
        }
    }

    //bind events
    $('.graph-element').click(function () {
        eventHandlers.clickOnElement(this.id);
    });

    //api
    let api = {

        getRelations: controller.getRelations
    }

    return api;

})();