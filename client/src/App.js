import { useCallback, useEffect, useMemo, useState } from 'react';
import uniqid from 'uniqid';
import randomColor from 'randomcolor';
import { Layout, Space, Popover, Input, Button } from 'antd';
import { enableWallDrawer, deleteWalls, enableDragging, getPerimeter, drawPerimeter, setRoomForWalls, getPayload } from './controllers';
import { CheckOutlined, InfoCircleTwoTone, EditOutlined } from '@ant-design/icons';
import Editor from './widgets/Editor/Editor';
import SelectPlan from './widgets/SelectPlan/SelectPlan';
import PageHeader from './widgets/PageHeader/PageHeader';
import config from './config/admin';
import 'antd/dist/antd.css';
import './App.css';
import axios from 'axios';

const { Content, Footer } = Layout;

function App() {
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

  const [plan, setPlan] = useState(null);
  const [edit, setEdit] = useState(false);
  const [isSelectingRoom, setIsSelectingRoom] = useState(false);
  const [sectionLength, setSectionLength] = useState(null);
  const [sectionScale, setSectionScale] = useState(null);

  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [rooms, setRooms] = useState({});

  const selectedRoom = useMemo(() => rooms[selectedRoomId], [selectedRoomId, rooms]);

  const [isPreview, setIsPreview] = useState(
    Boolean(urlParams.get('isPreview'))
  );

  useEffect(() => {
    const planId = urlParams.get('levelId');
    if (planId) {
      axios.get(`https://fortexgroup.ru/api/response/blockLevels/get/?key=o4tthMmBtggBgXQD95m2&levelId=${planId}`).then(res => {
        const parsedRes = JSON.parse(res.data.data);
        setPlan(parsedRes.plan);
      });
    }
  }, []);

  useEffect(() => {
    if (plan) {
      axios.get(`https://fortexgroup.ru/api/response/blockLevels/get/?key=o4tthMmBtggBgXQD95m2&levelId=${plan.id}`).then(res => {
        const parsedRes = JSON.parse(res.data.data);
  
        if (parsedRes) {
          setSectionLength(Number(parsedRes.sectionLength));
          setSectionScale(Number(parsedRes.sectionScale));
          setEdit(true);
          window.myFloorplan.model = window.go.Model.fromJson(parsedRes.model);
  
          window.myFloorplan.nodes.each(function (node) {
            if (node.category === "WallGroup") window.myFloorplan.updateWall(node);
          });

          setRooms(parsedRes.rooms);

          enableDragging();

          setPlan(parsedRes.plan);
        }
      });
    }
  }, [plan?.id]);

  const handleChangeRoom = useCallback(attrs => {
    setRooms({
      ...rooms,
      [selectedRoomId]: {
        ...rooms[selectedRoomId],
        ...attrs
      }
    })
  }, [selectedRoomId, rooms]);

  const startSelection = useCallback(() => {
    setIsSelectingRoom(true);
    enableWallDrawer({
      isSelection: true,
      onSelected: walls => {
        setIsSelectingRoom(false);
        enableDragging();
        const perimeter = getPerimeter(walls);
        const id = uniqid();
        drawPerimeter(perimeter, { fill: randomColor(), opacity: .3, roomId: id, isArea: true });

        const newRoom = {
          title: 'Название помещения',
          perimeter,
          layoutParams: config.layout_settings_templates.default
        };
        setRoomForWalls(walls, id);
        setRooms({
          ...rooms,
          [id]: newRoom
        });

        setSelectedRoomId(id);
      }
    });
  }, [rooms]);

  const startBlockSelection = useCallback(() => {
    enableWallDrawer({
      isSelection: true,
      onSelected: walls => {
        const { myFloorplan } = window;
        enableDragging();
        const perimeter = getPerimeter(walls);

        drawPerimeter(perimeter, {
          fill: 'red',
          opacity: .3,
          roomId: selectedRoomId,
          isBlock: true,
          perimeter
        });

        for (let i = 0; i < walls.size; i++) {
          const w = walls.get(i);
          myFloorplan.remove(w);
        }
      }
    });
  }, [selectedRoom]);

  const handleSelectRoom = useCallback(area => {
    if (area) {
      for (const rId of Object.keys(rooms)) {
        if (rId === area.roomId || rId === area.data?.roomId) {
          return setSelectedRoomId(rId);
        }
      }
    } else {
      setSelectedRoomId(null);
    }
  }, [rooms]);

  const savePlan = useCallback(() => {
    axios.post(
      `https://fortexgroup.ru/api/response/blockLevels/save/?key=o4tthMmBtggBgXQD95m2&levelId=${plan.id}`,
      {
        plan,
        sectionLength,
        sectionScale,
        rooms,
        model: getPayload()
      }
    );
  }, [plan, rooms]);

  useEffect(() => {
    if (edit) {
      const timerId = setInterval(savePlan, 10000);

      return (() => clearInterval(timerId));
    }
  }, [edit, savePlan]);

  return (
    <Layout className='layout'>
      {isPreview && (
        <Button onClick={() => setIsPreview(false)} style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          zIndex: 9999
        }} icon={<EditOutlined />} type='primary'>Редактировать</Button>
      )}
      {(edit && !isPreview) && (
        <PageHeader
          setIsSelectingRoom={setIsSelectingRoom}
          isSelectingRoom={isSelectingRoom}
          startSelection={startSelection}
          plan={plan}
          setIsPreview={() => setIsPreview(true)}
          selectedRoom={selectedRoom}
          selectedRoomId={selectedRoomId}
          sectionScale={sectionScale}
          onChangeRoom={handleChangeRoom}
          setSelectedRoom={setSelectedRoomId}
          startBlockSelection={startBlockSelection}
          layoutTemplates={config.layout_settings_templates}
          sectionLength={sectionLength} />
      )}
      <Content style={{ padding: isPreview ? '0' : '50px' }}>
        {!edit && (
          <Space direction='horizontal' style={{ width: '100%', justifyContent: 'center', marginBottom: '25px' }}>
            <h2 className='center'>{plan ? (
              'Укажите масштаб'
            ) : ('Выберите план')}</h2>
          </Space>
        )}
        <Popover placement='topRight' visible={(plan && !edit) || isSelectingRoom} content={(
          isSelectingRoom ? (
            <Space style={{ marginRight: '10px' }}>
              <InfoCircleTwoTone />
              Выделите периметр нового помещения
            </Space>
          ) : (
            sectionLength ? (
              <Input.Group style={{ width: '100%', position: 'relative' }} compact>
                <Input style={{ width: '280px' }} placeholder='Укажите длину отрезка в метрах' value={sectionScale} type='number' onChange={e => setSectionScale(e.target.value)} />
                <Button type='primary' onClick={() => {
                  setEdit(true);
                  deleteWalls();
                }}>
                  <CheckOutlined />
                </Button>
              </Input.Group>
            ) : (
              <Space style={{ marginRight: '10px' }}>
                <InfoCircleTwoTone />
                Проведите отрезок на плане
              </Space>
            )
          )
        )}>
          <div className='site-layout-content'>
            {plan ? (
              <Editor
                isScale={plan && !sectionLength}
                onScaleSectionDrawn={sectionLength => setSectionLength(sectionLength)}
                plan={plan}
                onSelectRoom={handleSelectRoom}
                selectedRoomId={selectedRoomId}
                isPreview={isPreview} />
            ) : (
              <SelectPlan onSelectPlan={plan => setPlan(plan)} />
            )}
          </div>
        </Popover>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Fortex Consulting Group ©2018 Created by FCG</Footer>
    </Layout >
  );
}

export default App;
