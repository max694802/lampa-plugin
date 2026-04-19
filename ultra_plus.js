(function () {
    'use strict';

    function start() {

        Lampa.Search.add({
            title: '🔥 ULTRA',
            search: function (query, success) {
                success([
                    {
                        title: 'УЛЬТРА РАБОТАЕТ',
                        url: '',
                        poster: ''
                    }
                ]);
            },
            onSelect: function () {
                Lampa.Noty.show('ВСЁ ОК 🚀');
            }
        });

    }

    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') start();
        });
    }

})();
