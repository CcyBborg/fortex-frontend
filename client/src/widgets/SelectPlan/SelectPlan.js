import { useCallback } from 'react';
import axios from 'axios';
import { Row, Col, List, Collapse, Typography } from 'antd';
import SearchForm from './components/SearchForm/SearchForm';

const { Panel } = Collapse;
const { Text } = Typography;

function SelectPlan({
    listData,
    onSelectPlan
}) {

    const handleSubmit = useCallback(async data => {
        console.log(data);
        console.log(await axios.get('https://fortexgroup.ru/api/response/blockLevels', {
            params: {
                ...data,
                key: 'o4tthMmBtggBgXQD95m2'
            },
            headers: {
                crossorigin: 'true'
            }
        }));
    }, []);

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
                    <SearchForm onSubmit={handleSubmit} />

                    <Collapse onChange={() => { }}>
                        {listData.map((item, i) => (
                            <Panel header={item.title} extra={(
                                <div style={{ textAlign: 'right' }}>
                                    <Text>{item.meta}</Text><br />
                                    <Text type='secondary'>{item.address}</Text>
                                </div>)} key={i}>
                                <List
                                    itemLayout="vertical"
                                    size="large"
                                    dataSource={item.levels}
                                    renderItem={(level, i) => (
                                        <List.Item
                                            key={i}
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
                </div>
            </Col>
        </Row>
    );
}

export default SelectPlan;
