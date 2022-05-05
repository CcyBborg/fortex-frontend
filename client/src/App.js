import { useCallback, useEffect, useMemo, useState } from 'react';
import uniqid from 'uniqid';
import randomColor from 'randomcolor';
import { Layout, Space, Popover, Input, Button } from 'antd';
import { enableWallDrawer, deleteWalls, enableDragging, getPerimeter, drawPerimeter, setRoomForWalls } from './controllers';
import { CheckOutlined, InfoCircleTwoTone, EditOutlined } from '@ant-design/icons';
import Editor from './widgets/Editor/Editor';
import SelectPlan from './widgets/SelectPlan/SelectPlan';
import PageHeader from './widgets/PageHeader/PageHeader';
import config from './config/admin';
import 'antd/dist/antd.css';
import './App.css';

const { Content, Footer } = Layout;

function App() {
  const [plan, setPlan] = useState(null);
  const [edit, setEdit] = useState(false);
  const [isSelectingRoom, setIsSelectingRoom] = useState(false);
  const [sectionLength, setSectionLength] = useState(null);
  const [sectionScale, setSectionScale] = useState(null);

  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [rooms, setRooms] = useState({});

  const selectedRoom = useMemo(() => rooms[selectedRoomId], [selectedRoomId, rooms]);

  const [isPreview, setIsPreview] = useState(
    Boolean(new URLSearchParams(window.location.search).get('isPreview'))
  );

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
        const area = drawPerimeter(perimeter, { fill: randomColor(), opacity: .3 }, id);
        area.isArea = true;

        const newRoom = {
          title: 'Название помещения',
          perimeter,
          area,
          blocks: [],
          layout: [],
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
        const node = drawPerimeter(perimeter, { fill: 'red', opacity: .3 }, selectedRoomId);
        node.isBlock = true;
        selectedRoom.blocks.push(
          {
            node,
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
                planImg={plan.img}
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
