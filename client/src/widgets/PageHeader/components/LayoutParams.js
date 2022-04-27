import { useEffect, useState } from 'react';
import { Button, Modal, Form, Radio, Input, Select, Space, Divider, Typography } from 'antd';

const { Option } = Select;
const { Text } = Typography;

function LayoutParams({
    values,
    onChangeRoom,
    setIsLayoutParams,
    layoutTemplates
}) {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(values);
    }, [values, form]);

    const [layoutTemplate, setLayoutTemplate] = useState('default');

    return (
        <Modal title='Параметры авторассадки' visible={true} footer={[
            <Button form='layout-params-form' key='submit-params' type='primary' htmlType='submit'>Сохранить параметры</Button>
        ]} onCancel={() => setIsLayoutParams(false)}>
            <Space direction='vertical'>
                <Text strong>Вставить значения из шаблона</Text>

                <Input.Group compact>
                    <Select value={layoutTemplate} style={{ width: '260px' }} onChange={setLayoutTemplate}>
                        {Object.keys(layoutTemplates).map(k => (
                            <Option key={k} value={k}>{layoutTemplates[k].title}</Option>
                        ))}
                    </Select>
                    <Button type='dashed' onClick={() => {
                        const {
                            desk_width,
                            desk_depth,
                            desk_clearance,
                            layout_type,
                            layout_direction
                        } = layoutTemplates[layoutTemplate];

                        form.setFieldsValue({
                            desk_width,
                            desk_depth,
                            desk_clearance,
                            layout_type,
                            layout_direction
                        });
                    }}>Вставить</Button>
                </Input.Group>
            </Space>
            <Divider>Или задайте вручную</Divider>
            <Form
                name='layout-params-form'
                form={form}
                layout='horizontal'
                onFinish={newParams => {
                    onChangeRoom({ layoutParams: newParams });
                    setIsLayoutParams(false);
                }}
            >
                <Form.Item label='Вид рассадки' name='layout_type' rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio.Button value='combined'>Комбинированная</Radio.Button>
                        <Radio.Button value='walls'>По стенкам</Radio.Button>
                        <Radio.Button value='center'>По центру</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label='Ширина стола' name='desk_width' rules={[{ required: true }]}>
                    <Input placeholder='Значение в метрах' type='number' />
                </Form.Item>
                <Form.Item label='Глубина стола' name='desk_depth' rules={[{ required: true }]}>
                    <Input placeholder='Значение в метрах' type='number' />
                </Form.Item>
                <Form.Item label='Клиренс места' name='desk_clearance' rules={[{ required: true }]}>
                    <Input placeholder='Значение в метрах' type='number' />
                </Form.Item>
                <Form.Item label='Направление столов' name='layout_direction' rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio.Button value='to-wall'>К стенке</Radio.Button>
                        <Radio.Button value='to-center'>К центру</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default LayoutParams;
