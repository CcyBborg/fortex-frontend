import axios from 'axios';
import uniqid from 'uniqid';

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

export function deleteWalls(roomId) {
    const {
        myFloorplan
    } = window;

    const it = myFloorplan.nodes.filter(n => n.category === 'WallGroup').iterator;
    while (it.next()) {
        if (it.value.roomId === roomId || !it.value.roomId)
        myFloorplan.remove(it.value);
    }
}

export function setRoomForWalls(walls, roomId) {
    for (let i = 0; i < walls.size; i++) {
        const w = walls.get(i);
        w.selectable = false;
        w.data.roomId = roomId;
    }
}

export function hideWalls(selectedRoom) {
    const {
        myFloorplan
    } = window;

    const it = myFloorplan.nodes.filter(n => n.category === 'WallGroup').iterator;
    while (it.next()) {
        if (it.value.data.roomId === selectedRoom) {
            it.value.opacity = 1;
        } else {
            it.value.opacity = .5;
        }
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

export function addDoor(point, roomId) {
    const {
        myFloorplan
    } = window;

    myFloorplan.model.addNodeData(
        {
            key: `${uniqid()}`,
            category: "DoorNode",
            color: "rgba(0, 0, 0, 0)",
            caption: "Door",
            type: "Door",
            length: 40,
            doorOpeningHeight: 5,
            swing: "left",
            loc: point.join(' '),
            notes: "",
            roomId
        }
    );
}

export function getLayout(room, selectedRoomId, { deskWidth, deskDepth, deskClearance, layoutType, layoutDirection, callback }) {
    const blocks = [];
    const blocksIt = window.myFloorplan.nodes.filter(n => n.data.isBlock && (n.data.roomId === selectedRoomId)).iterator;
    while (blocksIt.next()) {
        blocks.push(blocksIt.value.data);
    }

    const it = window.myFloorplan.nodes.filter(n => n.category === 'DoorNode').iterator;
    while (it.next()) {
        if (it.value.data.roomId === selectedRoomId) {
            const { actualBounds } = it.value;
            const bounds = [
                [actualBounds.x, actualBounds.y],
                [actualBounds.x, actualBounds.y + actualBounds.height],
                [actualBounds.x + actualBounds.width, actualBounds.y + actualBounds.height],
                [actualBounds.x + actualBounds.width, actualBounds.y],
                [actualBounds.x, actualBounds.y]
            ];

            blocks.push({ perimeter: bounds });
        }
    }

    axios.get('https://fortex-agency.herokuapp.com/', {
        params: {
            coords: JSON.stringify(room.perimeter),
            config: JSON.stringify({
                "desk_depth": deskDepth, "desk_width": deskWidth,
                "desk_clearance": deskClearance, "door_depth": 40,
                "layout_type": layoutType, "layout_direction": layoutDirection
            }),
            doors: JSON.stringify(blocks.map(b => b.perimeter))
        }
    }).then(res => {
        for (let i = 0; i < res.data.length; ++i) {
            const [desk, clearance] = res.data[i];

            drawPerimeter(desk, { fill: 'darksalmon', roomId: selectedRoomId, isLayout: true });
            drawPerimeter(clearance, { fill: 'salmon', opacity: .7, roomId: selectedRoomId, isLayout: true });
        }

        callback();
    });

}

export function drawPerimeter(perimeter, data) {
    const { myFloorplan } = window;
    const rest = perimeter.slice(1).map(p => `L${p[0]} ${p[1]}`).join(' ');

    myFloorplan.model.addNodeData({
        key: uniqid(),
        geometryString: `F M${perimeter[0][0]} ${perimeter[0][1]} ${rest}z`,
        category: 'perimeter',
        ...data
    });
}

export function setPreview(isPreview) {
    const it = window.myFloorplan.nodes.filter(n => n.data.isBlock || n.data.isArea || n.category === 'WallGroup').iterator;
    while (it.next()) {
        it.value.visible = !isPreview;
    }
}

export function getPayload() {
    return window.myFloorplan.model.toJson();
}

export function removeLayout(selectedRoomId) {
    const it = window.myFloorplan.nodes.filter(n => n.data.isLayout && n.data.roomId === selectedRoomId).iterator;
    while (it.next()) {
        window.myFloorplan.remove(it.value);
    }
}
