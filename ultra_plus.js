(function () {
    'use strict';

    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {

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
                onSelect: function (item) {
                    Lampa.Noty.show('Плагин работает');
                }
            });

        }
    });

})();
