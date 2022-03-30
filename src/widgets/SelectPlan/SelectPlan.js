import { Row, Col, Form, Input, Button, Upload, Divider, List, Collapse, Typography } from 'antd';
import { BankOutlined, LayoutOutlined, InboxOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Text } = Typography;

function SelectPlan({
    listData,
    onSelectPlan
}) {
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
                    <Form name="horizontal_login" layout="inline" onFinish={() => { }}
                        style={{ justifyContent: 'center', position: 'sticky', top: '0', backgroundColor: '#fff', zIndex: 999, padding: '16px 0' }} size='large'>
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Здание' }]}
                        >
                            <Input prefix={<BankOutlined className="site-form-item-icon" />} placeholder="Здание" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Помещение' }]}
                        >
                            <Input
                                prefix={<LayoutOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Помещение"
                            />
                        </Form.Item>
                        <Form.Item shouldUpdate>
                            {() => (
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                >
                                    Найти
                                </Button>
                            )}
                        </Form.Item>
                    </Form>
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
