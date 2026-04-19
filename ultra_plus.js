/**
 * @name Ultra Plus
 * @version 1.0.0
 * @author Max
 */

(function () {
    'use strict';

    function startPlugin() {

        Lampa.Search.add({
            title: '🔥 TEST',
            search: function (query, success) {
                success([
                    {
                        title: 'Плагин работает',
                        url: '',
                        poster: ''
                    }
                ]);
            },
            onSelect: function () {
                Lampa.Noty.show('УЛЬТРА РАБОТАЕТ 🚀');
            }
        });

    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') startPlugin();
        });
    }

})();
