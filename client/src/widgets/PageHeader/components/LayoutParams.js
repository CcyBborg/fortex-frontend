import { Button, Modal, Form, Radio, Input } from 'antd';
import { useEffect } from 'react';

function LayoutParams({ isLayoutParams, values, setLayoutParams, setIsLayoutParams }) {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(values);
    }, [values, form]);

    return (
        <Modal title="Параметры авторассадки" visible={isLayoutParams} footer={[
            <Button form='layout-params-form' key='submit-params' type='primary' htmlType='submit'>Сохранить параметры</Button>
        ]} onCancel={() => setIsLayoutParams(false)}>
            <Form
                name='layout-params-form'
                form={form}
                layout='horizontal'
                onFinish={newParams => {
                    setLayoutParams(newParams);
                    setIsLayoutParams(false);
                }}
            >
                <Form.Item label="Вид рассадки" name="layout_type" rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio.Button value="combined">Комбинированная</Radio.Button>
                        <Radio.Button value="walls">По стенкам</Radio.Button>
                        <Radio.Button value="center">По центру</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Ширина стола" name='desk_width' rules={[{ required: true }]}>
                    <Input placeholder="Значение в метрах" type='number' />
                </Form.Item>
                <Form.Item label="Глубина стола" name='desk_depth' rules={[{ required: true }]}>
                    <Input placeholder="Значение в метрах" type='number' />
                </Form.Item>
                <Form.Item label="Клиренс места" name='desk_clearance' rules={[{ required: true }]}>
                    <Input placeholder="Значение в метрах" type='number' />
                </Form.Item>
                <Form.Item label="Направление столов" name="layout_direction" rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio.Button value="to-wall">К стенке</Radio.Button>
                        <Radio.Button value="to-center">К центру</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default LayoutParams;
