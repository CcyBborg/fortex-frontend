import axios from 'axios';

export function enableDragging() {
    const {
        myFloorplan
    } = window;

    const wallBuildingTool = myFloorplan.toolManager.mouseDownTools.elt(0);
    const wallReshapingTool = myFloorplan.toolManager.mouseDownTools.elt(3);

    wallBuildingTool.isEnabled = false;
    wallReshapingTool.isEnabled = true;
    myFloorplan.nodes.iterator.each(function (n) { n.clearAdornments(); })
    myFloorplan.clearSelection();
}

export function enableWallDrawer({ isScale, isSelection, onScaleSectionDrawn, onSelected }) {
    const {
        myFloorplan
    } = window;

    const wallBuildingTool = myFloorplan.toolManager.mouseDownTools.elt(0);
    const wallReshapingTool = myFloorplan.toolManager.mouseDownTools.elt(3);
    wallBuildingTool.isScale = isScale;
    wallBuildingTool.isSelection = isSelection;
    wallBuildingTool.onSelected = onSelected;
    wallBuildingTool.onScaleSectionDrawn = onScaleSectionDrawn;
    wallBuildingTool.isEnabled = true;
    wallReshapingTool.isEnabled = false;
}

export function deleteWalls() {
    const {
        myFloorplan
    } = window;

    const it = myFloorplan.nodes.filter(n => n.category === 'WallGroup').iterator;
    while (it.next()) {
        myFloorplan.remove(it.value);
    }
}

export function getPerimeter(walls) {
    const coordinates = [];

    for (let i = 0; i < walls.size; i++) {
        const w = walls.get(i);
        coordinates.push(
            [w.data.startpoint.x, w.data.startpoint.y],
        );
    }

    return coordinates;
}

export function getLayout(room, { deskWidth, deskDepth, deskClearance, layoutType, layoutDirection, callback }) {
    axios.get('https://fortex-agency.herokuapp.com/', {
        params: {
            coords: JSON.stringify(room.perimeter),
            config: JSON.stringify({
                "desk_depth": deskDepth, "desk_width": deskWidth,
                "desk_clearance": deskClearance, "door_depth": 40,
                "layout_type": layoutType, "layout_direction": layoutDirection
            }),
            doors: JSON.stringify(room.blocks?.length ? room.blocks.map(b => b.perimeter) : [])
        }
    }).then(res => {
        room.layout = [];

        for (let i = 0; i < res.data.length; ++i) {
            const [desk, clearance] = res.data[i];

            room.layout.push({
                desk: drawPerimeter(desk, { fill: 'darksalmon' }),
                clearance: drawPerimeter(clearance, { fill: 'salmon', opacity: .7 })
            });
        }

        callback();
    });
    
}

export function drawPerimeter(perimeter, { fill, opacity = 1 }) {
    const {
        myFloorplan,
        go
    } = window;
    const $ = go.GraphObject.make;

    const rest = perimeter.slice(1).map(p => `L${p[0]} ${p[1]}`).join(' ');

    const node = $(go.Node, {
        layerName: "Foreground", position: new go.Point(0, 0),
        selectable: false
    },
        $(go.Shape,
            {
                geometryString: `F M${perimeter[0][0]} ${perimeter[0][1]} ${rest}z`,
                fill, opacity
            })
    );

    myFloorplan.add(node);

    return node;
}
