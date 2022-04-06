import { Form, Input, Button  } from 'antd';
import { BankOutlined, LayoutOutlined} from '@ant-design/icons';

function SearchForm({ onSubmit }) {
    return (
        <Form name='horizontal_login' layout='inline' onFinish={onSubmit}
            style={{ justifyContent: 'center', position: 'sticky', top: '0', backgroundColor: '#fff', zIndex: 999, padding: '16px 0' }} size='large'>
            <Form.Item
                name='building'
                rules={[{ required: true, message: 'Здание' }]}
            >
                <Input prefix={<BankOutlined className='site-form-item-icon' />} placeholder='Здание' required={false} />
            </Form.Item>
            <Form.Item
                name='block'
                rules={[{ message: 'Помещение' }]}
            >
                <Input
                    prefix={<LayoutOutlined className='site-form-item-icon' />}
                    type='text'
                    placeholder='Помещение'
                />
            </Form.Item>
            <Form.Item shouldUpdate>
                {() => (
                    <Button
                        type='primary'
                        htmlType='submit'
                        block
                    >
                        Найти
                    </Button>
                )}
            </Form.Item>
        </Form>
    );
}

export default SearchForm;
