import { useCallback, useEffect, useState } from 'react';
import randomColor from 'randomcolor';
import { Layout, Space, Popover, Input, Button, PageHeader, Tooltip, Divider, Modal, Form, Radio } from 'antd';
import { enableWallDrawer, deleteWalls, enableDragging, getPerimeter, drawPerimeter, getLayout } from './controllers';
import { CheckOutlined, InfoCircleTwoTone, SaveOutlined, PlusOutlined, CloseOutlined, DeleteOutlined, PlayCircleOutlined, ExportOutlined, RadiusUprightOutlined, SettingOutlined } from '@ant-design/icons';
import Editor from './widgets/Editor/Editor';
import SelectPlan from './widgets/SelectPlan/SelectPlan';
import 'antd/dist/antd.css';
import './App.css';

const { Content, Footer } = Layout;

const listData = [
  {
    title: 'Башня федерации',
    meta: '12 Этаж, 250 кв.м',
    address: 'Пресненская наб., 12, Москва, 123317',
    levels: [{
      title: "Заголовок помещения",
      img: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Sample_Floorplan.jpg'
    },
    {
      title: "Ну и тут текст",
      img: 'https://artisticvisions.com/wp-content/uploads/2018/08/HC-Floor-Plan-1.jpg'
    }
    ]
  },
  {
    title: 'Башня мордора',
    meta: '10 Этаж, 100 кв.м',
    address: 'Шелепихинский туп., 19А, Москва, 123290',
    levels: [{
      title: "Заголовок помещения",
      img: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Sample_Floorplan.jpg'
    },
    {
      title: "Ну и тут текст",
      img: 'https://artisticvisions.com/wp-content/uploads/2018/08/HC-Floor-Plan-1.jpg'
    }
    ]
  }
];

for (let i = 0; i < 20; ++i) {
  listData.push(listData[i % 2]);
}

function App() {
  const [plan, setPlan] = useState(null);
  const [edit, setEdit] = useState(false);
  const [isSelectingRoom, setIsSelectingRoom] = useState(false);
  const [sectionLength, setSectionLength] = useState(null);
  const [sectionScale, setSectionScale] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Layout params
  const [isLayoutParams, setIsLayoutParams] = useState(false);

  const [deskWidth, setDeskWidth] = useState(.8);
  const [deskDepth, setDeskDepth] = useState(.4);
  const [deskClearance, setDeskClearance] = useState(.4);
  const [layoutType, setLayoutType] = useState('combined');
  const [layoutDirection, setLayoutDirection] = useState('to-wall');


  useEffect(() => { window.rooms = [] }, []);

  const startSelection = useCallback(() => {
    setIsSelectingRoom(true);
    enableWallDrawer({
      isSelection: true,
      onSelected: walls => {
        setIsSelectingRoom(false);
        enableDragging();
        const perimeter = getPerimeter(walls);
        const area = drawPerimeter(perimeter, { fill: randomColor(), opacity: .3 });
        window.rooms.push({ title: 'Название помещение', walls, perimeter, area, blocks: [], layout: [] });
        setSelectedRoom(window.rooms[window.rooms.length - 1]);
      }
    });
  }, []);

  const startBlockSelection = useCallback(() => {
    enableWallDrawer({
      isSelection: true,
      onSelected: walls => {
        const { myFloorplan } = window;
        enableDragging();
        const perimeter = getPerimeter(walls);
        const node = drawPerimeter(perimeter, { fill: 'red', opacity: .3 });
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

  return (
    <Layout className='layout'>
      {edit && (
        <PageHeader
          ghost={false}
          title={isSelectingRoom ? 'Новое помещение' : (selectedRoom ? selectedRoom.title : plan.title)}
          subTitle={(isSelectingRoom || selectedRoom) ? null : plan.meta}
          extra={isSelectingRoom ? [
            <Button key='cancel' icon={<CloseOutlined />} onClick={() => {
              setIsSelectingRoom(false);
              deleteWalls();
              enableDragging();
            }}>Отменить</Button>
          ] : selectedRoom ? [
            <Tooltip key='layout-settings' placement='bottom' title='Параметры рассадки'>
              <Button
                icon={<SettingOutlined />}
                onClick={() => setIsLayoutParams(true)} />
            </Tooltip>,
            <Divider type="vertical" />,
            <Button
              key='delete'
              icon={<DeleteOutlined />}
              style={{ marginLeft: 0 }}
              danger
              onClick={() => {
                const { myFloorplan } = window;
                const { walls, area } = selectedRoom;

                setSelectedRoom(null);

                for (let i = 0; i < walls.size; i++) {
                  const w = walls.get(i);
                  myFloorplan.remove(w);
                }

                myFloorplan.remove(area);

                for (const l of selectedRoom.layout) {
                  myFloorplan.remove(l.desk);
                  myFloorplan.remove(l.clearance);
                }

                selectedRoom.blocks.forEach(b => {
                  myFloorplan.remove(b.node);
                  myFloorplan.remove(b.perimeter);
                });
              }}>
              Удалить помещение
            </Button>,
            <Button
              key='add-door'
              icon={<ExportOutlined />}
              onClick={startSelection}>
              Добавить дверь
            </Button>,
            <Button
              key='add-block'
              icon={<RadiusUprightOutlined />}
              onClick={startBlockSelection}>
              Выделить преграду
            </Button>,
            <Button
              key='layout'
              type='primary'
              icon={<PlayCircleOutlined />}
              onClick={() => {
                const scale = sectionLength / sectionScale;

                getLayout(selectedRoom, {
                  deskWidth: deskWidth * scale,
                  deskDepth: deskDepth * scale,
                  deskClearance: deskClearance * scale,
                  layoutType,
                  layoutDirection
                });
              }}>
              Авторассадка
            </Button>
          ] : [
            <Button
              key='add-room'
              icon={<PlusOutlined />}
              onClick={startSelection}>
              Выделить помещение
            </Button>,
            <Button key='save' icon={<SaveOutlined />} type='primary'>Сохранить</Button>
          ]
          }
          onBack={selectedRoom ? (() => setSelectedRoom(null)) : null}
        />
      )}
      <Content style={{ padding: '50px' }}>
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
                onSelectRoom={area => {
                  console.log('select room');
                  for (const r of window.rooms) {
                    if (r.area === area) {
                      setSelectedRoom(r);
                    }
                  }
                }} />
            ) : (
              <SelectPlan listData={listData} onSelectPlan={plan => setPlan(plan)} />
            )}
          </div>
        </Popover>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Fortex Consulting Group ©2018 Created by FCG</Footer>
      <Modal title="Параметры авторассадки" visible={isLayoutParams} footer={[
        <Button key='submit-params' type='primary' onClick={() => setIsLayoutParams(false)}>Сохранить параметры</Button>
      ]} onCancel={() => setIsLayoutParams(false)}>
        <Form
          layout='horizontal'
        >
          <Form.Item label="Вид рассадки" name="layout">
            <Radio.Group defaultValue='combined' value={layoutType} onChange={e => setLayoutType(e.target.value)}>
              <Radio.Button value="combined">Комбинированная</Radio.Button>
              <Radio.Button value="walls">По стенкам</Radio.Button>
              <Radio.Button value="center">По центру</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Ширина стола">
            <Input placeholder="Значение в метрах" value={deskWidth} type='number' onChange={e => setDeskWidth(e.target.value)} />
          </Form.Item>
          <Form.Item label="Глубина стола">
            <Input placeholder="Значение в метрах" value={deskDepth} type='number' onChange={e => setDeskDepth(e.target.value)} />
          </Form.Item>
          <Form.Item label="Клиренс места">
            <Input placeholder="Значение в метрах" value={deskClearance} type='number' onChange={e => setDeskClearance(e.target.value)} />
          </Form.Item>
          <Form.Item label="Направление столов" name="layoutDirection">
            <Radio.Group defaultValue='to-wall' value={layoutDirection} onChange={e => setLayoutDirection(e.target.value)}>
              <Radio.Button value="to-wall">К стенке</Radio.Button>
              <Radio.Button value="to-center">К центру</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </Layout >
  );
}

export default App;
