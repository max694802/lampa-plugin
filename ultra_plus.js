(function () {
    'use strict';

    const CONFIG = {
        proxy: 'https://corsproxy.io/?',
        autoNext: true
    };

    function req(url) {
        let u = CONFIG.proxy ? CONFIG.proxy + encodeURIComponent(url) : url;
        return fetch(u).then(r => r.text());
    }

    function parse(html) {
        return new DOMParser().parseFromString(html, 'text/html');
    }

    function extractStreams(doc) {
        let streams = [];

        doc.querySelectorAll('iframe').forEach(f => {
            streams.push({ url: f.src, type: 'iframe', label: 'Iframe' });
        });

        doc.querySelectorAll('script').forEach(s => {
            let m = s.innerHTML.match(/https?:\/\/[^"]+\.m3u8/);
            if (m) {
                streams.push({ url: m[0], type: 'hls', label: 'HLS' });
            }
        });

        return streams;
    }

    function play(streams, index = 0) {
        if (!streams[index]) {
            Lampa.Noty.show('Нет рабочих источников');
            return;
        }

        Lampa.Player.play(streams[index]);

        if (CONFIG.autoNext) {
            setTimeout(() => {
                if (!Lampa.Player.video || Lampa.Player.video.readyState === 0) {
                    play(streams, index + 1);
                }
            }, 5000);
        }
    }

    function parseEpisodes(doc) {
        let episodes = [];

        // ищем кнопки/ссылки серий (универсально)
        doc.querySelectorAll('[data-episode], .episode, .seria').forEach((el, i) => {
            let title = el.innerText || `Серия ${i+1}`;
            let link = el.getAttribute('data-episode') || el.href;

            if (link) {
                episodes.push({ title, url: link });
            }
        });

        return episodes;
    }

    function openMovie(item) {
        req(item.url).then(html => {
            let doc = parse(html);

            let episodes = parseEpisodes(doc);
            let streams = extractStreams(doc);

            // 🎬 Если сериал
            if (episodes.length > 1) {
                Lampa.Select.show({
                    title: '📺 Серии',
                    items: episodes.map(ep => ({
                        title: ep.title,
                        onSelect: () => openMovie(ep)
                    }))
                });
                return;
            }

            // 🎥 Если фильм
            if (streams.length) {
                Lampa.Select.show({
                    title: '🎬 Источники',
                    items: streams.map((s, i) => ({
                        title: s.label,
                        onSelect: () => play(streams, i)
                    }))
                });
            } else {
                Lampa.Noty.show('Видео не найдено');
            }
        });
    }

    function search(query, success) {
        let url = `https://kinogo.biz/index.php?do=search&subaction=search&story=${encodeURIComponent(query)}`;

        req(url).then(html => {
            let doc = parse(html);
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
        }).catch(() => success([]));
    }

    // 🎨 псевдо UI (категория)
    Lampa.Component.add('ultra_category', {
        template: '<div>🔥 ULTRA MOVIES</div>',
        create: function () {
            console.log('ULTRA UI loaded');
        }
    });

    Lampa.Search.add({
        title: '🔥 ULTRA+',
        search: search,
        onSelect: openMovie
    });

})();
