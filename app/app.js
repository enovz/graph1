
'use strict';

const graphModule = (function () {

    //requested from service
    let graph = (function () {

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

        return graph.slice();
    })()
    //end request


    //global to Module
    let $graph = $('#graph');
    let paper = Raphael('graph', '100%', '100%');
    let graphElements = [];

    //view
    let view = {

        init: function bootstrapGraph() {

            function Element(name, col, row, radius = 30) {

                //element circle
                let circle = paper.circle(col, row, radius);
                circle.node.id = name;
                circle.attr({
                    stroke: 'gray',
                    'stroke-width': 7,
                    'stroke-opacity': '0.5',
                    fill: '#61B329',
                    cursor: 'pointer',
                    class: 'graph-element'
                });

                //element text
                var text = paper.text(col, row, name);
                text.node.id = name;
                text.attr({
                    'font-size': 16,
                    'font-family': 'Arial, Helvetica, sans-serif',
                    cursor: 'pointer',
                    fill: 'white',
                    class: 'graph-element'
                });

                return {
                    id: name,
                    x: circle.attr('cx'),
                    y: circle.attr('cy')
                };
            }

            for (let i = 0; i < graph.length; i++) {

                let elementsGroup = graph[i];
                let row = ((i + 1) * 100);

                for (let j = 0; j < elementsGroup.length; j++) {

                    let col = ((j + 1) * 100);

                    let element = new Element(graph[i][j].name, col, row);
                    graphElements.push(element);
                }
            }

        },
        drawLine: function connect(points) {

            if ($graph.find('#' + points.start) && $graph.find('#' + points.end)) {

                let start = graphElements.filter(element => {
                    return element.id === points.start
                })[0];

                let end = graphElements.filter(element => {
                    return element.id === points.end;
                })[0];


                let line = paper.path(["M", start.x, start.y, "L", end.x, end.y]);
                line.attr({
                    stroke: 'gray',
                    'stroke-width': 4,
                    'stroke-opacity': '0.5'
                });
            }
        },
        refresh: function graphRelations(relations) {

            paper.clear();

            relations.forEach(relation => {
                view.drawLine(relation);
            });

            init();
        },

    };

    //methods
    let methods = {

        findByName: function findByName(input) {

            for (let i = 0; i < graph.length; i++) {

                let graphGroup = graph[i];

                let result = graphGroup.filter(element => {
                    return element.name === input;
                })

                if (result.length !== 0) {
                    return result[0];
                }
            }

        },
        parseInput: function parseInput(input) {

            let result = [];
            let firstElement = methods.findByName(input);
            result.push(firstElement);

            return result;
        },
        traverseToEnd: function traverseToEnd(firstParent) {
            //getChildren
            function getChildren(parent) {

                let result = [];

                if (parent.hasChildren) {

                    parent.children.forEach(child => {
                        result.push(methods.findByName(child));
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
            function traverseChildren(parents, relations = []) {

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

                        return traverseChildren(newParents, newRelations);
                    }
                    else {
                        let newParents = parents.slice();
                        newParents.splice(0, 1);

                        return traverseChildren(newParents, relations);
                    }

                }

            }

            return traverseChildren(firstParent);
        },
        traverseToStart: function traverseToStart(firstChild) {
            //getParents
            function getParents(child) {

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
            function traverseParents(children, relations = []) {

                if (children.length === 0) {

                    return relations;
                }
                else {

                    let element = children[0];
                    let parents = getParents(element);

                    if (parents.length !== 0) {

                        let newRelations = relations.slice();
                        newRelations = newRelations.concat(link(element, parents));

                        let newChildren = [];

                        newChildren = children.concat(parents);
                        newChildren.splice(0, 1);

                        return traverseParents(newChildren, newRelations);
                    }
                    else {
                        let newChildren = children.slice();
                        newChildren.splice(0, 1);

                        return traverseParents(newChildren, relations);
                    }

                }
            }

            return traverseParents(firstChild);
        }
    }

    //controller
    let controller = {

        getRelations: function (input) {

            let relations = [];
            let parsed = methods.parseInput(input);

            relations = relations.concat(methods.traverseToEnd(parsed));
            relations = relations.concat(methods.traverseToStart(parsed));

            return relations;
        }
    };

    //eventHandlers
    let eventHandlers = {
        clickOnElement: function (input) {

            let relations = controller.getRelations(input);

            return view.refresh(relations);
        }
    }

    //bind events
    let events = {
        getInput: function () {
            $graph.find('.graph-element').click(function () {
                eventHandlers.clickOnElement(this.id);
            })
        }
    }

    //initalize app
    function init() {

        view.init();
        events.getInput();
    }
    //close app
    function close() {

        $graph.off(events.getInput);
        paper.clear();
    }

    //api
    let api = {

        start: init,
        stop: close,
        findByName: methods.findByName,
        getRelations: controller.getRelations,
        clikcOnElement: eventHandlers.clickOnElement
    }

    return api;

})();