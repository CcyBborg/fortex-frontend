import { useEffect } from "react";
import { enableDragging, enableWallDrawer, drawRoom } from '../../controllers';
import axios from "axios";

function init({ onSelectRoom }) {
    let {
        myFloorplan,
        Floorplan,
        filesystem,
        ui,
        go,
        myOverview,
        FloorplanFilesystem,
        FILESYSTEM_UI_STATE,
        FloorplanUI,
        GUI_STATE,
        furniturePalette,
        FURNITURE_NODE_DATA_ARRAY,
        wallPartsPalette,
        DEFAULT_MODEL_DATA,
        WALLPARTS_NODE_DATA_ARRAY
    } = window;
    // Floorplan
    myFloorplan = new Floorplan("myFloorplanDiv");
    window.myFloorplan = myFloorplan;

    // 'FILESYSTEM_UI_STATE', 'GUI_STATE' defined in Floorplanner-Constants.js
    filesystem = new FloorplanFilesystem(myFloorplan, FILESYSTEM_UI_STATE);
    ui = new FloorplanUI(myFloorplan, "ui", "myFloorplan", GUI_STATE);


    // myOverview = $(go.Overview, "myOverviewDiv", { observed: myFloorplan, maxScale: 0.5 });

    // furniturePalette = $(go.Palette, "furniturePaletteDiv");
    // furniturePalette.nodeTemplateMap = myFloorplan.nodeTemplateMap;
    // furniturePalette.model = new go.GraphLinksModel(FURNITURE_NODE_DATA_ARRAY);
    // wallPartsPalette = $(go.Palette, "wallPartsPaletteDiv");
    // wallPartsPalette.nodeTemplateMap = myFloorplan.nodeTemplateMap;
    // wallPartsPalette.model = new go.GraphLinksModel(WALLPARTS_NODE_DATA_ARRAY);

    // enable hotkeys
    // var body = document.getElementById('body');
    // body.addEventListener("keydown", function (e) {
    //     var keynum = e.which;
    //     if (e.ctrlKey) {
    //         e.preventDefault();
    //         switch (keynum) {
    //             case 83: filesystem.saveFloorplan(); break; // ctrl + s
    //             case 79: filesystem.showOpenWindow(); break; // ctrl + o
    //             case 68: e.preventDefault(); filesystem.newFloorplan(); break; // ctrl + d
    //             case 82: filesystem.showRemoveWindow(); break; // ctrl + r
    //             case 49: ui.setBehavior('wallBuilding', myFloorplan); break; // ctrl + 1
    //             case 50: ui.setBehavior('dragging', myFloorplan); break; // ctrl + 2
    //             case 72: ui.hideShow('diagramHelpDiv'); break; // ctrl + h
    //             case 73: ui.hideShow('selectionInfoWindow'); break; // ctrl + i
    //             case 80: ui.hideShow('myPaletteWindow'); break; // ctrl + p
    //             case 69: ui.hideShow('myOverviewWindow'); break; // ctrl + e
    //             case 66: ui.hideShow('optionsWindow'); break; // ctrl + b
    //             case 71: ui.hideShow('statisticsWindow'); break; // ctrl + g
    //         }
    //     }
    // });

    // default model data stored in Floorplanner-Constants.js
    myFloorplan.floorplanFilesystem.loadFloorplanFromModel(DEFAULT_MODEL_DATA);
    ui.setBehavior("dragging");

    myFloorplan.addDiagramListener("ObjectSingleClicked",
        function (e) {
            onSelectRoom(e.subject.part);
        });
}

function calcAngle(A1x, A1y, A2x, A2y, B1x, B1y, B2x, B2y) {
    //find vector components
    var dAx = A2x - A1x;
    var dAy = A2y - A1y;
    var dBx = B2x - B1x;
    var dBy = B2y - B1y;
    var angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
    if (angle < 0) { angle = angle * -1; }
    var degree_angle = angle * (180 / Math.PI);

    return degree_angle
}

function Editor({ isScale, planImg, onScaleSectionDrawn, onSelectRoom }) {
    useEffect(() => {
        init({ onSelectRoom });
    }, []);

    useEffect(() => {
        if (isScale) {
            const {
                go,
                myFloorplan
            } = window;

            const $ = go.GraphObject.make;

            myFloorplan.add(
                $(go.Part,  // this Part is not bound to any model data
                    {
                        layerName: "Background", position: new go.Point(0, 0),
                        selectable: false, pickable: false
                    },
                    $(go.Picture, planImg)
                ));
            enableWallDrawer({
                isScale,
                onScaleSectionDrawn: sectionLength => {
                    enableDragging();
                    onScaleSectionDrawn(sectionLength);
                }
            });

        }
    }, [isScale]);

    return (
        <div id="myFloorplanDiv" style={{ height: '680px' }}></div>
    );
}

export default Editor;
