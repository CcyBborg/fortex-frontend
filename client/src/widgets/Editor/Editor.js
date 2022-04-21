import { useEffect } from "react";
import { enableDragging, enableWallDrawer, hideWalls } from '../../controllers';

function init() {
    let {
        myFloorplan,
        Floorplan,
        filesystem,
        ui,
        FloorplanFilesystem,
        FILESYSTEM_UI_STATE,
        FloorplanUI,
        GUI_STATE,
        DEFAULT_MODEL_DATA
    } = window;
    // Floorplan
    myFloorplan = new Floorplan("myFloorplanDiv");
    window.myFloorplan = myFloorplan;

    // 'FILESYSTEM_UI_STATE', 'GUI_STATE' defined in Floorplanner-Constants.js
    filesystem = new FloorplanFilesystem(myFloorplan, FILESYSTEM_UI_STATE);
    ui = new FloorplanUI(myFloorplan, "ui", "myFloorplan", GUI_STATE);

    // default model data stored in Floorplanner-Constants.js
    myFloorplan.floorplanFilesystem.loadFloorplanFromModel(DEFAULT_MODEL_DATA);
    ui.setBehavior("dragging");
}

function Editor({ isScale, planImg, onScaleSectionDrawn, onSelectRoom, selectedRoomId }) {
    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        const { myFloorplan } = window;
        myFloorplan.addDiagramListener("ObjectSingleClicked",
            function (e) {
                onSelectRoom(e.subject.part);
            });

        myFloorplan.addDiagramListener("BackgroundSingleClicked",
            function () {
                onSelectRoom(null);
            });
    }, [onSelectRoom]);

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

    useEffect(() => {
        hideWalls(selectedRoomId);
    }, [selectedRoomId]);

    return (
        <div id="myFloorplanDiv" style={{ height: '680px' }}></div>
    );
}

export default Editor;
