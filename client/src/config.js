export default {
    layout_settings_templates: { // Наборы параметров авторассадки для разных видов помещений
        default: {
            title: 'По умолчанию',
            desk_width: .8,
            desk_depth: .4,
            desk_clearance: .4,
            layout_type: 'combined',
            layout_direction: 'to-wall'
        },
        boss: {
            title: 'Кабинет начальника',
            desk_width: 1.2,
            desk_depth: .6,
            desk_clearance: .6,
            layout_type: 'combined',
            layout_direction: 'to-center'
        },
        open_space: {
            title: 'Офисный опен-спейс',
            desk_width: .7,
            desk_depth: .5,
            desk_clearance: .5,
            layout_type: 'center',
            layout_direction: 'to-wall'
        },
    },
    user_actions: {
        outline: false, // Выделение нового помещения
        doors: false, // Добавление дверей
        blocks: true, // Добавление преград
        delete: false, // Удаление помещений
        params: true // Параметры рассадки
    }
};