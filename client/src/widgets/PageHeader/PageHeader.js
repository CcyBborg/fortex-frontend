import { useCallback, useState } from 'react';
import { Button, PageHeader, Tooltip, Divider, Typography } from 'antd';
import { deleteWalls, enableDragging, getLayout, addDoor, removeLayout, setPreview } from '../../controllers';
import { EyeOutlined, PlusOutlined, CloseOutlined, DeleteOutlined, PlayCircleOutlined, ClearOutlined, ExportOutlined, RadiusUprightOutlined, SettingOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import LayoutParams from './components/LayoutParams';
import config from '../../config';

const { Paragraph } = Typography;

function PageHeaderContainer({
    startSelection,
    selectedRoom,
    selectedRoomId,
    plan,
    isUser,
    isSelectingRoom,
    setIsSelectingRoom,
    startBlockSelection,
    setSelectedRoom,
    sectionScale,
    sectionLength,
    onChangeRoom,
    setIsPreview,
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

            removeLayout(selectedRoomId);

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

    const downloadActions = ([
        <Divider key='divider-download' type="vertical" />,
        <Button
            key='download-plan'
            icon={<CloudDownloadOutlined />}
            onClick={() => {
                setPreview(true);
                var imgBlob = window.myFloorplan.makeImageData({
                    scale: 1,
                    type: 'image/jpeg'
                });

                var a = document.createElement('a');
                a.href = imgBlob.toString();
                a.download = 'floorplan.png';
                a.click();

                setPreview(false);
            }}>
            Скачать
        </Button>,
    ]);

    const selectedRoomActions = (
        [
            ...(isUser && !config.user_actions.params ? [] : ([
                <Tooltip key='layout-settings' placement='bottom' title='Параметры рассадки'>
                    <Button
                        icon={<SettingOutlined />}
                        onClick={() => setIsLayoutParams(true)} />
                </Tooltip>,
                <Divider key='divider-1' type="vertical" />
            ])),
            ...(isUser && !config.user_actions.delete ? [] : ([
                <Button
                    key='delete'
                    icon={<DeleteOutlined />}
                    style={{ marginLeft: 0 }}
                    danger
                    onClick={handleDeleteRoom}>
                    Удалить помещение
                </Button>,
            ])),
            ...(isUser && !config.user_actions.doors ? [] : ([
                <Button
                    key='add-door'
                    icon={<ExportOutlined />}
                    onClick={() => {
                        addDoor(selectedRoom.perimeter[0], selectedRoomId);
                    }}>
                    Добавить дверь
                </Button>,
            ])),
            ...(isUser && !config.user_actions.blocks ? [] : ([
                <Button
                    key='add-block'
                    icon={<RadiusUprightOutlined />}
                    onClick={startBlockSelection}>
                    Выделить преграду
                </Button>,
            ])),
            <Divider key='divider-2' type="vertical" />,
            <Button
                key='layout'
                type='primary'
                icon={<PlayCircleOutlined />}
                loading={isLayoutLoading}
                onClick={handleLayoutClick}>
                Авторассадка
            </Button>,
            <Tooltip key='clear-layout' placement='bottom' title='Очистить рассадку' onClick={
                () => {
                    removeLayout(selectedRoomId);

                    setSelectedRoom(null);
                    setTimeout(() => setSelectedRoom(selectedRoomId), 1);
                }
            }>
                <Button icon={<ClearOutlined />} />
            </Tooltip>,
        ]
    );

    const homeActions = (
        [
            ...(isUser && !config.user_actions.outline ? [] : ([
                <Button
                    key='add-room'
                    icon={<PlusOutlined />}
                    onClick={startSelection}>
                    Выделить помещение
                </Button>,
                <Divider key='divider-2' type="vertical" />,
            ])),
            <Button key='preview' icon={<EyeOutlined />} onClick={setIsPreview}>Превью</Button>,
        ]
    );

    if (isUser) {
        selectedRoomActions.push(...downloadActions);
        homeActions.push(...downloadActions);
    }

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
                ] : selectedRoom ? selectedRoomActions : homeActions
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
