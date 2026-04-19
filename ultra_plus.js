(function () {
    'use strict';

    Lampa.Plugin.create({
        name: 'Ultra Plus',
        version: '1.0.0',
        description: 'Тестовый плагин',

        init: function () {

            Lampa.Search.add({
                title: '🔥 TEST',
                search: function (query, success) {
                    success([
                        {
                            title: 'Тест фильм',
                            url: 'https://example.com',
                            poster: ''
                        }
                    ]);
                },
                onSelect: function () {
                    Lampa.Noty.show('Плагин работает 🚀');
                }
            });

        }
    });

})();
