import { useEffect } from "react";
import { enableDragging, enableWallDrawer, hideWalls, setPreview } from '../../controllers';

function init() {
    let {
        myFloorplan,
        Floorplan,
        filesystem,
        ui,
        go,
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

    // template
    const $ = go.GraphObject.make;
    const perimeterTemplate = $(go.Node, {
        position: new go.Point(0, 0),
        selectable: false
    },
        $(
            go.Shape,
            {},
            new go.Binding('fill', 'fill'),
            new go.Binding('opacity', 'opacity'),
            new go.Binding('geometryString', 'geometryString')
        )
    );

    myFloorplan.nodeTemplateMap.add('perimeter', perimeterTemplate);
}

function Editor({
    isScale,
    plan,
    onScaleSectionDrawn,
    onSelectRoom,
    selectedRoomId,
    isPreview
}) {
    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        setPreview(isPreview);
    }, [isPreview, isScale]);

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
                $(go.Part,
                    {
                        layerName: 'Background', position: new go.Point(0, 0),
                        selectable: false, pickable: false
                    },
                    $(go.Picture, plan.img, { sourceCrossOrigin: () => 'anonymous' })
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
        <div id="myFloorplanDiv" style={{ height: isPreview ? '100vh' : 'calc(100vh - 140px)' }}></div>
    );
}

export default Editor;
