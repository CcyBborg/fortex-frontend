/*
* Copyright (C) 1998-2022 by Northwoods Software Corporation
* All Rights Reserved.
*
* Floorplanner Constants
*/

// The diagram model data for the default floorplanner
DEFAULT_MODEL_DATA = {
	"class": "go.GraphLinksModel",
	"modelData": { "units": "centimeters", "unitsAbbreviation": "cm", "unitsConversionFactor": 2, "gridSize": 5, "wallThickness": 3, "preferences": { "showWallGuidelines": true, "showWallLengths": false, "showWallAngles": true, "showOnlySmallWallAngles": true, "showGrid": true, "gridSnap": true } },
	"nodeDataArray": [
	],
	"linkDataArray": []
};

// UI Interaction state object for FlooplaUI
GUI_STATE = {
	menuButtons: {
		selectionInfoWindowButtonId: "selectionInfoWindowButton",
		palettesWindowButtonId: "myPaletteWindowButton",
		overviewWindowButtonId: "myOverviewWindowButton",
		optionsWindowButtonId: "optionsWindowButton",
		statisticsWindowButtonId: "statisticsWindowButton"
	},
	windows: {
		diagramHelpDiv: {
			id: "diagramHelpDiv"
		},
		selectionInfoWindow: {
			id: "selectionInfoWindow",
			textDivId: "selectionInfoTextDiv",
			handleId: "selectionInfoWindowHandle",
			colorPickerId: "colorPicker",
			heightLabelId: "heightLabel",
			heightInputId: "heightInput",
			widthInputId: "widthInput",
			nodeGroupInfoId: "nodeGroupInfo",
			nameInputId: "nameInput",
			notesTextareaId: "notesTextarea"
		},
		palettesWindow: {
			id: "myPaletteWindow",
			furnitureSearchInputId: "furnitureSearchBar",
			furniturePaletteId: "furniturePaletteDiv"
		},
		overviewWindow: {
			id: "myOverviewWindow"
		},
		optionsWindow: {
			id: "optionsWindow",
			gridSizeInputId: "gridSizeInput",
			unitsConversionFactorInputId: "unitsConversionFactorInput",
			unitsFormId: "unitsForm",
			unitsFormName: "units",
			checkboxes: {
				showGridCheckboxId: "showGridCheckbox",
				gridSnapCheckboxId: "gridSnapCheckbox",
				wallGuidelinesCheckboxId: "wallGuidelinesCheckbox",
				wallLengthsCheckboxId: "wallLengthsCheckbox",
				wallAnglesCheckboxId: "wallAnglesCheckbox",
				smallWallAnglesCheckboxId: "smallWallAnglesCheckbox"
			},
		},
		statisticsWindow: {
			id: "statisticsWindow",
			textDivId: "statisticsWindowTextDiv",
			numsTableId: "numsTable",
			totalsTableId: "totalsTable"
		}
	},
	scaleDisplayId: "scaleDisplay",
	setBehaviorClass: "setBehavior",
	wallThicknessInputId: "wallThicknessInput",
	wallThicknessBoxId: "wallThicknessBox",
	unitsBoxClass: "unitsBox",
	unitsInputClass: "unitsInput"
};

// Filesystem state object for FloorplanFilesystem
FILESYSTEM_UI_STATE = {
	openWindowId: "openDocument",
	removeWindowId: "removeDocument",
	currentFileId: "currentFile",
	filesToRemoveListId: "filesToRemove",
	filesToOpenListId: "filesToOpen"
};

// Node Data Array for Furniture Palette
FURNITURE_NODE_DATA_ARRAY = [
	{
		category: "MultiPurposeNode",
		key: "MultiPurposeNode",
		caption: "Multi Purpose Node",
		color: "#ffffff",
		stroke: '#000000',
		name: "Writable Node",
		type: "Writable Node",
		shape: "Rectangle",
		text: "Write here",
		width: 60,
		height: 60,
		notes: ""
	},
	{
		key: "roundTable",
		color: "#ffffff",
		stroke: '#000000',
		caption: "Round Table",
		type: "Round Table",
		shape: "Ellipse",
		width: 61,
		height: 61,
		notes: ""
	},
	{
		key: "armChair",
		color: "#ffffff",
		stroke: '#000000',
		caption: "Arm Chair",
		type: "Arm Chair",
		geo: "F1 M0 0 L40 0 40 40 0 40 0 0 M10 30 L10 10 M0 0 Q8 0 10 10 M0 40 Q20 15 40 40 M30 10 Q32 0 40 0 M30 10 L30 30",
		width: 45,
		height: 45,
		notes: ""
	},
	{
		key: "sofaMedium",
		color: "#ffffff",
		stroke: "#000000",
		caption: "Sofa",
		type: "Sofa",
		geo: "F1 M0 0 L80 0 80 40 0 40 0 0 M10 35 L10 10 M0 0 Q8 0 10 10 M0 40 Q40 15 80 40 M70 10 Q72 0 80 0 M70 10 L70 35",
		height: 45,
		width: 90,
		notes: ""
	},
	{
		key: "sink",
		color: "#ffffff",
		stroke: '#000000',
		caption: "Sink",
		type: "Sink",
		geo: "F1 M0 0 L40 0 40 40 0 40 0 0z M5 7.5 L18.5 7.5 M 21.5 7.5 L35 7.5 35 35 5 35 5 7.5 M 15 21.25 A 5 5 180 1 0 15 21.24 M23 3.75 A 3 3 180 1 1 23 3.74 M21.5 6.25 L 21.5 12.5 18.5 12.5 18.5 6.25 M15 3.75 A 1 1 180 1 1 15 3.74 M 10 4.25 L 10 3.25 13 3.25 M 13 4.25 L 10 4.25 M27 3.75 A 1 1 180 1 1 27 3.74 M 26.85 3.25 L 30 3.25 30 4.25 M 26.85 4.25 L 30 4.25",
		width: 27,
		height: 27,
		notes: ""
	},
	{
		key: "doubleSink",
		color: "#ffffff",
		stroke: '#000000',
		caption: "Double Sink",
		type: "Double Sink",
		geo: "F1 M0 0 L75 0 75 40 0 40 0 0 M5 7.5 L35 7.5 35 35 5 35 5 7.5 M44 7.5 L70 7.5 70 35 40 35 40 9 M15 21.25 A5 5 180 1 0 15 21.24 M50 21.25 A 5 5 180 1 0 50 21.24 M40.5 3.75 A3 3 180 1 1 40.5 3.74 M40.5 3.75 L50.5 13.75 47.5 16.5 37.5 6.75 M32.5 3.75 A 1 1 180 1 1 32.5 3.74 M 27.5 4.25 L 27.5 3.25 30.5 3.25 M 30.5 4.25 L 27.5 4.25 M44.5 3.75 A 1 1 180 1 1 44.5 3.74 M 44.35 3.25 L 47.5 3.25 47.5 4.25 M 44.35 4.25 L 47.5 4.25",
		height: 27,
		width: 52,
		notes: ""
	},
	{
		key: "toilet",
		color: "#ffffff",
		stroke: '#000000',
		caption: "Toilet",
		type: "Toilet",
		geo: "F1 M0 0 L25 0 25 10 0 10 0 0 M20 10 L20 15 5 15 5 10 20 10 M5 15 Q0 15 0 25 Q0 40 12.5 40 Q25 40 25 25 Q25 15 20 15",
		width: 25,
		height: 35,
		notes: ""
	},
	{
		key: "shower",
		color: "#ffffff",
		stroke: '#000000',
		caption: "Shower/Tub",
		type: "Shower/Tub",
		geo: "F1 M0 0 L40 0 40 60 0 60 0 0 M35 15 L35 55 5 55 5 15 Q5 5 20 5 Q35 5 35 15 M22.5 20 A2.5 2.5 180 1 1 22.5 19.99",
		width: 45,
		height: 75,
		notes: ""
	},
	{
		key: "bed",
		color: "#ffffff",
		stroke: '#000000',
		caption: "Bed",
		type: "Bed",
		geo: "F1 M0 0 L40 0 40 60 0 60 0 0 M 7.5 2.5 L32.5 2.5 32.5 17.5 7.5 17.5 7.5 2.5 M0 20 L40 20 M0 25 L40 25",
		width: 76.2,
		height: 101.6,
		notes: ""
	},
	{
		key: "staircase",
		color: "#ffffff",
		stroke: '#000000',
		caption: "Staircase",
		type: "Staircase",
		geo: "F1 M0 0 L 0 100 250 100 250 0 0 0 M25 100 L 25 0 M 50 100 L 50 0 M 75 100 L 75 0 M 100 100 L 100 0 M 125 100 L 125 0 M 150 100 L 150 0 M 175 100 L 175 0 M 200 100 L 200 0 M 225 100 L 225 0",
		width: 125,
		height: 50,
		notes: ""
	},
	{
		key: "stove",
		color: "#ffffff",
		stroke: '#000000',
		caption: "Stove",
		type: "Stove",
		geo: "F1 M 0 0 L 0 100 100 100 100 0 0 0 M 30 15 A 15 15 180 1 0 30.01 15 M 70 15 A 15 15 180 1 0 70.01 15"
			+ "M 30 55 A 15 15 180 1 0 30.01 55 M 70 55 A 15 15 180 1 0 70.01 55",
		width: 75,
		height: 75,
		notes: ""
	},
	{
		key: "diningTable",
		color: "#ffffff",
		stroke: '#000000',
		caption: "Dining Table",
		type: "Dining Table",
		geo: "F1 M 0 0 L 0 100 200 100 200 0 0 0 M 25 0 L 25 -10 75 -10 75 0 M 125 0 L 125 -10 175 -10 175 0 M 200 25 L 210 25 210 75 200 75 M 125 100 L 125 110 L 175 110 L 175 100 M 25 100 L 25 110 75 110 75 100 M 0 75 -10 75 -10 25 0 25",
		width: 125,
		height: 62.5,
		notes: ""
	}
];

// Node Data Array for Wall Parts Palette
WALLPARTS_NODE_DATA_ARRAY = [
	{
		category: "PaletteWallNode",
		key: "wall",
		caption: "Wall",
		type: "Wall",
		color: "#000000",
		shape: "Rectangle",
		height: 10,
		length: 60,
		notes: "",
	},
	{
		category: "WindowNode",
		key: "window",
		color: "white",
		caption: "Window",
		type: "Window",
		shape: "Rectangle",
		height: 10,
		length: 60,
		notes: ""
	},
	{
		key: "door",
		category: "DoorNode",
		color: "rgba(0, 0, 0, 0)",
		caption: "Door",
		type: "Door",
		length: 40,
		doorOpeningHeight: 5,
		swing: "left",
		notes: ""
	}
];