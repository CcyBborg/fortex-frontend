import { useCallback, useState } from 'react';
import axios from 'axios';
import { Row, Col, List, Collapse, Typography } from 'antd';
import SearchForm from './components/SearchForm/SearchForm';

const { Panel } = Collapse;
const { Text } = Typography;

function SelectPlan({
    onSelectPlan
}) {

    const handleSubmit = useCallback(data => {
        setIsLoading(true);

        axios.get('https://fortexgroup.ru/api/response/blockLevels/', {
            params: {
                ...data,
                key: 'o4tthMmBtggBgXQD95m2'
            }
        }).then(res => {
            setBlocks(res.data.list);
            setIsLoading(false);
        });
    }, []);

    const [isLoading, setIsLoading] = useState(false);
    const [blocks, setBlocks] = useState(null);

    return (
        <Row align="top" justify='center'>
            <Col span={12}>
                <div
                    id="scrollableDiv"
                    style={{
                        height: 680,
                        overflow: 'auto',
                        padding: '0 16px',
                        border: '1px solid rgba(140, 140, 140, 0.35)',
                        position: 'relative'
                    }}
                >
                    <SearchForm onSubmit={handleSubmit} isLoading={isLoading} />

                    {Boolean(blocks?.length) && (
                        <Collapse defaultActiveKey={blocks[0].id} onChange={() => { }}>
                            {blocks.map(item => (
                                <Panel
                                    header={item.title}
                                    extra={(
                                        <div style={{ textAlign: 'right' }}>
                                            <Text>{item.meta}</Text><br />
                                            <Text type='secondary'>{item.address}</Text>
                                        </div>)}
                                    key={item.id}>
                                    <List
                                        itemLayout="vertical"
                                        size="large"
                                        dataSource={item.levels}
                                        renderItem={level => (
                                            <List.Item
                                                key={level.id}
                                                className='planItem'
                                                onClick={() => {
                                                    onSelectPlan(level);
                                                }}
                                                extra={
                                                    <img
                                                        height={80}
                                                        alt="logo"
                                                        src={level.img}
                                                    />
                                                }
                                            >
                                                {level.title}
                                            </List.Item>
                                        )}
                                    />
                                </Panel>
                            ))}
                        </Collapse>
                    )}
                </div>
            </Col>
        </Row>
    );
}

export default SelectPlan;
