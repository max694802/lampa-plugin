(function () {
    'use strict';

    Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {

            function search(query, success) {
                let url = 'https://kinogo.biz/index.php?do=search&subaction=search&story=' + encodeURIComponent(query);

                fetch(url)
                    .then(r => r.text())
                    .then(html => {
                        let doc = new DOMParser().parseFromString(html, 'text/html');
                        let items = doc.querySelectorAll('.shortstory, .movie-item');
                        let results = [];

                        items.forEach(el => {
                            let a = el.querySelector('a');
                            let img = el.querySelector('img');

                            if (a && img) {
                                results.push({
                                    title: a.innerText.trim(),
                                    url: a.href,
                                    poster: img.src
                                });
                            }
                        });

                        success(results);
                    })
                    .catch(() => success([]));
            }

            function open(item) {
                fetch(item.url)
                    .then(r => r.text())
                    .then(html => {
                        let doc = new DOMParser().parseFromString(html, 'text/html');
                        let iframe = doc.querySelector('iframe');

                        if (iframe) {
                            Lampa.Player.play({
                                url: iframe.src,
                                type: 'iframe'
                            });
                        } else {
                            Lampa.Noty.show('Видео не найдено');
                        }
                    });
            }

            Lampa.Search.add({
                title: '🔥 Kinogo',
                search: search,
                onSelect: open
            });

        }
    });

})();
