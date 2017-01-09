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
            new Element("C1", ["D1", "D2"]),
            new Element("C2"),
            new Element("C3", ["D1", "D2", "D3"]),
            new Element("C4", ["D1"])
        ],
        [
            new Element("D1", ["E1", "E2"]),
            new Element("D2", ["E1"]),
            new Element("D3", ["E3"])
        ],
        [
            new Element("E1"),
            new Element("E2"),
            new Element("E3")
        ],

    ];