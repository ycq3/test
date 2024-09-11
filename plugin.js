const axios = require("axios");
// const Host = "http://127.0.0.1:8082"
const Host = "https://api.dydq.eu.org"

module.exports = {
    platform: "PMusic", // 插件名
    version: "0.0.17", // 版本号
    cacheControl: "no-store",
    srcUrl:'https://raw.kkgithub.com/ycq3/test/master/plugin.js',
    async search(query, page, type) {
        if (type === "music") {

            const {success, data} = (
                await axios.get(Host + "/api/music/search", {
                    params: {
                        query,
                        page,
                    }
                })
            ).data;

            let isEnd = data.page.limit * data.page.page >= data.page.total

            console.log({query, success, data, isEnd})
            return {
                isEnd: data.results.length === 0 && isEnd,
                data: data.results.map(d => ({...d, query: query}))
            }
        }
    },
    async getLyric(musicItem) {
        const {data} = await axios.get(Host + "/api/music/lyric", {
            params: {
                title: musicItem.title,
                artist: musicItem.artist,
                album: musicItem.album,
                id: musicItem.id,
            }
        })

        console.log("获取歌词",{data})
        return {
            rawLrc: "[00:00.00] First Lyric", // 文本格式的歌词
        };
    },

    // 获取音源
    async getMediaSource(musicItem, quality) {
        // 根据媒体对象获取源信息
        const fakeResult = (
            await axios.get(Host + "/api/music/media_source", {
                params: {
                    id: musicItem.id,
                    source: musicItem.source,
                    title: musicItem.title,
                    artist: musicItem.artist,
                    album: musicItem.album,
                    quality: quality,
                    query: musicItem.query
                },
            })
        ).data;

        console.log("获取音源",{fakeResult})
        // 转化为插件可识别的返回值
        return {
            url: fakeResult.data.url,
        };
    },
    async getTopLists(){

    }
};

// module.exports.getLyric({
//     title: '夜曲',
//     artist: '周杰伦',
//     album: '十一月的萧邦',
//     id: 'https://zh.followlyrics.com/lyrics/99416/ye-qu'
// }).then(console.log);


// module.exports.search("周杰伦", 2, "music")
// module.exports.search("周杰伦", 3, "music")
