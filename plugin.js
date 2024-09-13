const axios = require("axios");
// const Host = "http://127.0.0.1:8082/api/music"
const Host = "https://api.dydq.eu.org/api/music"
axios.defaults.timeout = 5000

module.exports = {
    platform: "PMusic", // 插件名
    version: "0.0.22", // 版本号
    author: "pipiqiang",
    cacheControl: "no-store",
    srcUrl: 'https://raw.kkgithub.com/ycq3/test/master/plugin.js',
    supportedSearchType: ["music",],
    hints: {
        // 导入歌单浮层上的提示
        importMusicSheet: [
            "支持导入网易和QQ歌单",
            "导入完成需要较长时间匹配歌曲",
            "可以稍后到歌单页面查看结果",
        ],
        // 导入单曲浮层上的提示
        importMusicItem: [
            // "注意事项：导入单曲时需要XXX",
            // "第二点注意事项，导入单曲时需要XXX",
        ],
    },
    userVariables: [
        {
            key: "userId",
            name: "用户ID",
        },
        {
            key: "token",
            name: "Token",
        },
    ],
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

        console.log("获取歌词", {data})
        return data.data
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

        console.log("获取音源", {fakeResult})
        // 转化为插件可识别的返回值
        return {
            url: fakeResult.data.url,
        };
    },

    async getTopLists() {
        const {data} = (await axios.get(Host + '/top_lists')).data
        // 获取榜单
        console.log("获取榜单", data)
        return data.results;
    },
    async getTopListDetail(topListItem) {
        // 获取榜单详情
        const {data} = (await axios.get(Host + '/top_list_detail', {
            params: {
                id: topListItem.id,
            }
        })).data

        console.log("获取榜单详情", {data})

        return {
            isEnd: true,
            sheetItem: data,
            musicList: data.musics,
        };
    },

    async importMusicSheet(url) {
        // 导入歌单

        const musicItems = (
            await axios.get(Host + "/import_music_sheet", {
                params: {url},
            })
        ).data;
        return musicItems;
    },
};
