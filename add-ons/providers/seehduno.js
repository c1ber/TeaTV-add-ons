const URL = {   
    DOMAIN: `https://seehd.uno`,
    SEARCH: (title, page=false) => {
        if( page == false ) {
            return `https://seehd.uno/?s=${title}`;
        }
        return `https://seehd.uno/page/${page}/?s=${title}`;
    },
    HEADERS: () => {
        return {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'cache-control': 'max-age=0',
            'upgrade-insecure-requests': 1,
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
        };
    }
};

class SeehdUno {
    constructor(props) {
        this.libs       = props.libs;
        this.movieInfo  = props.movieInfo;
        this.settings   = props.settings;
        this.state      = {};
    }

    async searchDetail() {

        const { httpRequest, cheerio, stringHelper, base64 } = this.libs; 
        let { title, year, season, episode, type } = this.movieInfo;

        let htmlSearch  = await httpRequest.getCloudflare(URL.SEARCH(stringHelper.convertToSearchQueryString(title, '+')), URL.HEADERS());
        htmlSearch      = htmlSearch.data;
        let $           = cheerio.load(htmlSearch);
        let page        = $('#paginador .paginado ul li');

        if( page.length <= 0 ) {
            page = 1;
        } else {
            page = page.last().find('a').attr('href');
            page = page.match(/\/page\/([0-9]+)/i);
            page = page != null ? +page[1] : 1;
        }

        await this.getDetailUrl(page, this.state);

        return;
    }


    async getDetailUrl(page, state) {

        const { httpRequest, cheerio, stringHelper, base64 }    = this.libs; 
        const { title, year, season, episode, type }            = this.movieInfo;

        let arrNumber = [];
        
        for( let i = 1; i <= page; i++ )  {

            arrNumber.push(i);
        }

        let arrPromise = arrNumber.map(async function(val) {

            let htmlSearch  = await httpRequest.getCloudflare(URL.SEARCH(stringHelper.convertToSearchQueryString(title, '+'), val), URL.HEADERS());
            htmlSearch      = htmlSearch.data;
            let $           = cheerio.load(htmlSearch);
            let itemSearch  = $('.peliculas .items .item');

            itemSearch.each(function() {


                let hrefMovies      = $(this).find('a').attr('href');
                let yearMovies      = $(this).find('.fixyear .year').text();
                let titleMovies     = $(this).find('.fixyear h2').text();
                let seasonMovies    = titleMovies.match(/season *([0-9]+)/i);
                let episodeMovies   = titleMovies.match(/season *[0-9]+ *episode *([0-9]+)/i);
                seasonMovies 	    = seasonMovies  != null ? +seasonMovies[1]  : false;
                episodeMovies 	    = episodeMovies != null ? +episodeMovies[1] : false; 
                titleMovies         = titleMovies.replace('Watch', '').replace('Online', '').replace('Free', '').trim();
                titleMovies         = titleMovies.replace(/\([0-9]+\)/i, '').trim();

                if( seasonMovies != false && episodeMovies != false ) {

                    titleMovies = titleMovies.replace(/\– *season.*/i, '').trim();
                }
                
                if( stringHelper.shallowCompare(title, titleMovies) ) {

                    if( type == 'movie' && +yearMovies == year ) {

                        state.detailUrl = hrefMovies;
                    } else if( type == 'tv' && seasonMovies == season && episodeMovies == episode ) {
                        
                        state.detailUrl = hrefMovies;
                    }
                }
            });


            if( val == page ) {
                return;
            }

        });

        await Promise.all(arrPromise);
        return;        
    }


    async getHostFromDetail() {

        const { httpRequest, cheerio, base64 } = this.libs;
        if(!this.state.detailUrl) throw new Error("NOT_FOUND");

        let hosts       = [];
        
        let detailUrl   = this.state.detailUrl;
        let htmlDetail  = await httpRequest.getCloudflare(this.state.detailUrl, URL.HEADERS());
        htmlDetail      = htmlDetail.data;
        let $           = cheerio.load(htmlDetail);
        let itemEmbed   = $('#player2 .movieplay');

        itemEmbed.each(function() {

            let script  = $(this).find('script').html();
		    let token   = script.match(/str *\= *\'([^\']+)/i);
            token 	    = token != null ? token[1] : false;
            
            if( token ) {

                token           = unescape(token.replace(/@/g,'%'));
                let linkEmbed   = token.match(/src *\= *\"([^\"]+)/i);
                linkEmbed       = linkEmbed != null ? linkEmbed[1] : false;

                linkEmbed !== false && hosts.push({
                    provider: {
                        url: detailUrl,
                        name: "seehduno"
                    },
                    result: {
                        file: linkEmbed,
                        label: "embed",
                        type: "embed"
                    }
                });
            }
        });

        this.state.hosts = hosts;
    }

}

exports.default = async (libs, movieInfo, settings) => {

    const seehduno = new SeehdUno({
        libs: libs,
        movieInfo: movieInfo,
        settings: settings
    });
    await seehduno.searchDetail();
    await seehduno.getHostFromDetail();
    return seehduno.state.hosts;
}


exports.testing = SeehdUno;