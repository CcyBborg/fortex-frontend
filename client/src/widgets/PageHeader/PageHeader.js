import { useCallback, useState } from 'react';
import { Button, PageHeader, Tooltip, Divider, Typography } from 'antd';
import { deleteWalls, enableDragging, getLayout, addDoor } from '../../controllers';
import { SaveOutlined, PlusOutlined, CloseOutlined, DeleteOutlined, PlayCircleOutlined, ClearOutlined, ExportOutlined, RadiusUprightOutlined, SettingOutlined } from '@ant-design/icons';
import LayoutParams from './components/LayoutParams';

const { Paragraph } = Typography;

function PageHeaderContainer({
    startSelection,
    selectedRoom,
    selectedRoomId,
    plan,
    isSelectingRoom,
    setIsSelectingRoom,
    startBlockSelection,
    setSelectedRoom,
    sectionScale,
    sectionLength,
    onChangeRoom,
    layoutTemplates
}) {
    // Layout params
    const [isLayoutParams, setIsLayoutParams] = useState(false);
    const [isLayoutLoading, setIsLayoutLoading] = useState(false);
    const { layoutParams } = selectedRoom || {};

    const scale = sectionLength / sectionScale;
    const handleLayoutClick = useCallback(() => {
        if (!isLayoutLoading) {
            setIsLayoutLoading(true);

            const { myFloorplan } = window;

            for (const l of selectedRoom.layout) {
                myFloorplan.remove(l.desk);
                myFloorplan.remove(l.clearance);
            }

            if (selectedRoom.layout.length) {
                selectedRoom.layout = [];
            }

            getLayout(selectedRoom, selectedRoomId, {
                deskWidth: layoutParams.desk_width * scale,
                deskDepth: layoutParams.desk_depth * scale,
                deskClearance: layoutParams.desk_clearance * scale,
                layoutType: layoutParams.layout_type,
                layoutDirection: layoutParams.layout_direction,
                callback: () => {
                    setIsLayoutLoading(false);
                }
            });
        }
    }, [isLayoutLoading, layoutParams, scale, selectedRoom]);

    const handleDeleteRoom = useCallback(() => {
        const { myFloorplan } = window;

        setSelectedRoom(null);

        const it = myFloorplan.nodes.filter(n => n.roomId === selectedRoomId || n.data?.roomId === selectedRoomId).iterator;
        while (it.next()) {
            myFloorplan.remove(it.value);
        }
    }, [selectedRoom]);

    return (
        <>
            <PageHeader
                ghost={false}
                title={isSelectingRoom ? 'Новое помещение' : (selectedRoom ? (
                    <Paragraph style={{ margin: '0 10px' }} editable={{ onChange: value => onChangeRoom({ title: value }) }}>{selectedRoom.title}</Paragraph>
                ) : plan.title)}
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
                        onClick={handleDeleteRoom}>
                        Удалить помещение
                    </Button>,
                    <Button
                        key='add-door'
                        icon={<ExportOutlined />}
                        onClick={() => {
                            addDoor(selectedRoom.perimeter[0], selectedRoomId);
                        }}>
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
                        onClick={handleLayoutClick}>
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
                                setTimeout(() => setSelectedRoom(selectedRoomId), 1);
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
            {isLayoutParams && (
                <LayoutParams
                    values={layoutParams}
                    setIsLayoutParams={setIsLayoutParams}
                    layoutTemplates={layoutTemplates}
                    onChangeRoom={onChangeRoom} />
            )}
        </>
    );
}

export default PageHeaderContainer;
