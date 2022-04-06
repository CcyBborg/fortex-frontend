import { useState } from 'react';
import { Button, PageHeader, Tooltip, Divider, Modal, Form, Radio, Input } from 'antd';
import { deleteWalls, enableDragging, getLayout } from '../../controllers';
import { SaveOutlined, PlusOutlined, CloseOutlined, DeleteOutlined, PlayCircleOutlined, ClearOutlined, ExportOutlined, RadiusUprightOutlined, SettingOutlined } from '@ant-design/icons';

function PageHeaderContainer({
    startSelection,
    selectedRoom,
    plan,
    isSelectingRoom,
    setIsSelectingRoom,
    startBlockSelection,
    setSelectedRoom,
    sectionScale,
    sectionLength
}) {
    // Layout params
    const [isLayoutParams, setIsLayoutParams] = useState(false);

    const [isLayoutLoading, setIsLayoutLoading] = useState(false);

    const [deskWidth, setDeskWidth] = useState(.8);
    const [deskDepth, setDeskDepth] = useState(.4);
    const [deskClearance, setDeskClearance] = useState(.4);
    const [layoutType, setLayoutType] = useState('combined');
    const [layoutDirection, setLayoutDirection] = useState('to-wall');

    return (
        <>
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
                    <Divider key='divider-1' type="vertical" />,
                    <Button
                        key='delete'
                        icon={<DeleteOutlined />}
                        style={{ marginLeft: 0 }}
                        danger
                        onClick={() => {
                            const { myFloorplan } = window;
                            const { walls, area } = selectedRoom;

                            setSelectedRoom(null);

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
                    <Divider key='divider-2' type="vertical" />,
                    <Button
                        key='layout'
                        type='primary'
                        icon={<PlayCircleOutlined />}
                        loading={isLayoutLoading}
                        onClick={() => {
                            if (!isLayoutLoading) {
                                const scale = sectionLength / sectionScale;

                                setIsLayoutLoading(true);

                                const { myFloorplan } = window;

                                for (const l of selectedRoom.layout) {
                                    myFloorplan.remove(l.desk);
                                    myFloorplan.remove(l.clearance);
                                }

                                if (selectedRoom.layout.length) {
                                    selectedRoom.layout = [];
                                }
                                
                                getLayout(selectedRoom, {
                                    deskWidth: deskWidth * scale,
                                    deskDepth: deskDepth * scale,
                                    deskClearance: deskClearance * scale,
                                    layoutType,
                                    layoutDirection,
                                    callback: () => {
                                        setIsLayoutLoading(false);
                                    }
                                });
                            }
                        }}>
                        Авторассадка
                    </Button>,
                    (Boolean(selectedRoom.layout?.length) && (
                        <Tooltip key='clear-layout' placement='bottom' title='Очистить рассадку' onClick={
                            () => {
                                const { myFloorplan } = window;
                                for (const l of selectedRoom.layout) {
                                    myFloorplan.remove(l.desk);
                                    myFloorplan.remove(l.clearance);
                                }

                                selectedRoom.layout = [];
                                setSelectedRoom(null);
                                setTimeout(() => setSelectedRoom(selectedRoom), 1);
                            }
                        }>
                            <Button icon={<ClearOutlined />} />
                        </Tooltip>
                    ))
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
        </>
    );
}

export default PageHeaderContainer;
