const axios = require("axios");
// const Host = "http://127.0.0.1:8082/api/music"
const Host = "https://api.dydq.eu.org/api/music"

module.exports = {
    platform: "PMusic", // 插件名
    version: "0.0.18", // 版本号
    cacheControl: "no-store",
    srcUrl:'https://raw.kkgithub.com/ycq3/test/master/plugin.js',
    async search(query, page, type) {
        if (type === "music") {
            const {success, data} = (
                await axios.get(Host + "/search", {
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
        const {data} = await axios.get(Host + "/lyric", {
            params: {
                title: musicItem.title,
                artist: musicItem.artist,
                album: musicItem.album,
                id: musicItem.id,
                source: musicItem.source,
            }
        })

        console.log("获取歌词",{data})
        return {
            rawLrc: "[00:00.00] 功能开发中", // 文本格式的歌词
        };
    },

    // 获取音源
    async getMediaSource(musicItem, quality) {
        // 根据媒体对象获取源信息
        const fakeResult = (
            await axios.get(Host + "/media_source", {
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
    async getTopLists() {
        const {data} = (await axios.get(Host+'/top_lists')).data
        // 获取榜单
        console.log("获取榜单",data)
        return data.results;
    },
    async importMusicSheet(url) {
        // 导入歌单

        const musicItems = (
            await axios.get(Host+"/import_music_sheet", {
                params: { url },
            })
        ).data;
        return musicItems;
    },
};
