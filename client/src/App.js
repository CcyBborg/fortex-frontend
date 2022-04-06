import { useCallback, useEffect, useState } from 'react';
import randomColor from 'randomcolor';
import { Layout, Space, Popover, Input, Button } from 'antd';
import { enableWallDrawer, deleteWalls, enableDragging, getPerimeter, drawPerimeter } from './controllers';
import { CheckOutlined, InfoCircleTwoTone } from '@ant-design/icons';
import Editor from './widgets/Editor/Editor';
import SelectPlan from './widgets/SelectPlan/SelectPlan';
import PageHeader from './widgets/PageHeader/PageHeader';
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
        window.rooms.push({ title: 'Название помещение', perimeter, area, blocks: [], layout: [] });
        setSelectedRoom(window.rooms[window.rooms.length - 1]);
        deleteWalls();
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
          setIsSelectingRoom={setIsSelectingRoom}
          isSelectingRoom={isSelectingRoom}
          startSelection={startSelection}
          plan={plan}
          selectedRoom={selectedRoom}
          sectionScale={sectionScale}
          setSelectedRoom={setSelectedRoom}
          startBlockSelection={startBlockSelection}
          sectionLength={sectionLength} />
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
                  for (const r of window.rooms) {
                    if (r.area === area) {
                      return setSelectedRoom(r);
                    } 
                  }

                  setSelectedRoom(null);
                }} />
            ) : (
              <SelectPlan listData={listData} onSelectPlan={plan => setPlan(plan)} />
            )}
          </div>
        </Popover>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Fortex Consulting Group ©2018 Created by FCG</Footer>
    </Layout >
  );
}

export default App;
