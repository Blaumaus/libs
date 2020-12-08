const request = require('request')
const fs = require("fs")
// const text = fs.readFileSync("./proxies.txt").toString('utf-8');
// const proxy_arr = text.split("\n")

let requests = 0
let successful_req = 0

const ua_arr = [
  "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.1021.10gin_lib.cc",
  "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; es-es) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B360 Safari/531.21.10",
  "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; es-es) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B367 Safari/531.21.10",
  "Mozilla/5.0 (iPad; U; CPU OS 3_2_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B500 Safari/53",
  "Mozilla/5.0 (iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314",
  "Mozilla/5.0 (iPhone Simulator; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7D11 Safari/531.21.10",
  "Mozilla/5.0 (iPhone; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10",
  "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_1 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8B117 Safari/6531.22.7",
  "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_1 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8B5097d Safari/6531.22.7",
  "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; fi-fi) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5",
  "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; fi-fi) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148a Safari/6533.18.5",
  "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; fr) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148a Safari/6533.18.5",
  "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; it-it) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148a Safari/6533.18.5",
  "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_2_1 like Mac OS X; nb-no) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148a Safari/6533.18.5",
  "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3 like Mac OS X; en-gb) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8F190 Safari/6533.18.5",
  "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3 like Mac OS X; fr-fr) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8F190 Safari/6533.18.5",
  "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3 like Mac OS X; pl-pl) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8F190 Safari/6533.18.5",
  "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_1 like Mac OS X; zh-tw) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8G4 Safari/6533.18.5",
  "Mozilla/5.0 (iPhone; U; fr; CPU iPhone OS 4_2_1 like Mac OS X; fr) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148a Safari/6533.18.5",
  "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_2_1 like Mac OS X; he-il) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148 Safari/6533.18.5",
  "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_1 like Mac OS X; zh-cn) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8G4 Safari/6533.18.5",
  "Mozilla/5.0 Mozilla/5.0 (Windows; U; Windows NT 5.1; de; rv:1.9.2.13) Firefox/3.6.13",
  "Mozilla/5.0(Windows; U; Windows NT 5.2; rv:1.9.2) Gecko/20100101 Firefox/3.6",
  "Mozilla/5.0(Windows; U; Windows NT 7.0; rv:1.9.2) Gecko/20100101 Firefox/3.6",
  "Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/123",
  "Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10",
  "Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10gin_lib.cc",
  "Opera/10.50 (Windows NT 6.1; U; en-GB) Presto/2.2.2",
  "Opera/10.60 (Windows NT 5.1; U; en-US) Presto/2.6.30 Version/10.60",
  "Opera/10.60 (Windows NT 5.1; U; zh-cn) Presto/2.6.30 Version/10.60",
  "Opera/9.80 (Linux i686; U; en) Presto/2.5.22 Version/10.51",
  "Opera/9.80 (Macintosh; Intel Mac OS X; U; nl) Presto/2.6.30 Version/10.61",
  "Opera/9.80 (S60; SymbOS; Opera Tablet/9174; U; en) Presto/2.7.81 Version/10.5",
  "Opera/9.80 (Windows 98; U; de) Presto/2.6.30 Version/10.61",
  "Opera/9.80 (Windows NT 5.1; U; MRA 5.5 (build 02842); ru) Presto/2.7.62 Version/11.00",
  "Opera/9.80 (Windows NT 5.1; U; MRA 5.6 (build 03278); ru) Presto/2.6.30 Version/10.63",
  "Opera/9.80 (Windows NT 5.1; U; cs) Presto/2.2.15 Version/10.10",
  "Opera/9.80 (Windows NT 5.1; U; cs) Presto/2.7.62 Version/11.01",
  "Opera/9.80 (Windows NT 5.1; U; de) Presto/2.2.15 Version/10.10",
  "Opera/9.80 (Windows NT 5.1; U; it) Presto/2.7.62 Version/11.00",
  "Opera/9.80 (Windows NT 5.1; U; pl) Presto/2.6.30 Version/10.62",
  "Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.5.22 Version/10.50",
  "Opera/9.80 (Windows NT 5.1; U; ru) Presto/2.7.39 Version/11.00",
  "Opera/9.80 (Windows NT 5.1; U; sk) Presto/2.5.22 Version/10.50",
  "Opera/9.80 (Windows NT 5.1; U; zh-cn) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (Windows NT 5.1; U; zh-tw) Presto/2.8.131 Version/11.10",
  "Opera/9.80 (Windows NT 5.1; U;) Presto/2.7.62 Version/11.01",
  "Opera/9.80 (Windows NT 5.2; U; en) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (Windows NT 5.2; U; en) Presto/2.6.30 Version/10.63",
  "Opera/9.80 (Windows NT 5.2; U; ru) Presto/2.5.22 Version/10.51",
  "Opera/9.80 (Windows NT 5.2; U; ru) Presto/2.6.30 Version/10.61",
  "Opera/9.80 (Windows NT 5.2; U; ru) Presto/2.7.62 Version/11.01",
  "Opera/9.80 (Windows NT 5.2; U; zh-cn) Presto/2.6.30 Version/10.63",
  "Opera/9.80 (Windows NT 6.0; U; Gecko/20100115; pl) Presto/2.2.15 Version/10.10",
  "Opera/9.80 (Windows NT 6.0; U; cs) Presto/2.5.22 Version/10.51",
  "Opera/9.80 (Windows NT 6.0; U; de) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (Windows NT 6.0; U; en) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (Windows NT 6.0; U; en) Presto/2.2.15 Version/10.10",
  "Opera/9.80 (Windows NT 6.0; U; en) Presto/2.7.39 Version/11.00",
  "Opera/9.80 (Windows NT 6.0; U; en) Presto/2.8.99 Version/11.10",
  "Opera/9.80 (Windows NT 6.0; U; it) Presto/2.6.30 Version/10.61",
  "Opera/9.80 (Windows NT 6.0; U; nl) Presto/2.6.30 Version/10.60",
  "Opera/9.80 (Windows NT 6.0; U; pl) Presto/2.7.62 Version/11.01",
  "Opera/9.80 (Windows NT 6.0; U; zh-cn) Presto/2.5.22 Version/10.50",
  "Opera/9.80 (Windows NT 6.1 x64; U; en) Presto/2.7.62 Version/11.00",
  "Opera/9.80 (Windows NT 6.1; U; cs) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (Windows NT 6.1; U; cs) Presto/2.7.62 Version/11.01",
  "Opera/9.80 (Windows NT 6.1; U; de) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (Windows NT 6.1; U; de) Presto/2.2.15 Version/10.10",
  "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.5.22 Version/10.51",
  "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.6.30 Version/10.61",
  "Opera/9.80 (Windows NT 6.1; U; en-GB) Presto/2.7.62 Version/11.00",
  "Opera/9.80 (Windows NT 6.1; U; en-US) Presto/2.7.62 Version/11.01",
  "Opera/9.80 (Windows NT 6.1; U; fi) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (Windows NT 6.1; U; fi) Presto/2.7.62 Version/11.00",
  "Opera/9.80 (Windows NT 6.1; U; fr) Presto/2.5.24 Version/10.52",
  "Opera/9.80 (Windows NT 6.1; U; ja) Presto/2.5.22 Version/10.50",
  "Opera/9.80 (Windows NT 6.1; U; ko) Presto/2.7.62 Version/11.00",
  "Opera/9.80 (Windows NT 6.1; U; pl) Presto/2.6.31 Version/10.70",
  "Opera/9.80 (Windows NT 6.1; U; pl) Presto/2.7.62 Version/11.00",
  "Opera/9.80 (Windows NT 6.1; U; sk) Presto/2.6.22 Version/10.50",
  "Opera/9.80 (Windows NT 6.1; U; sv) Presto/2.7.62 Version/11.01",
  "Opera/9.80 (Windows NT 6.1; U; zh-cn) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (Windows NT 6.1; U; zh-cn) Presto/2.5.22 Version/10.50",
  "Opera/9.80 (Windows NT 6.1; U; zh-cn) Presto/2.6.30 Version/10.61",
  "Opera/9.80 (Windows NT 6.1; U; zh-cn) Presto/2.6.37 Version/11.00",
  "Opera/9.80 (Windows NT 6.1; U; zh-cn) Presto/2.7.62 Version/11.01",
  "Opera/9.80 (Windows NT 6.1; U; zh-tw) Presto/2.5.22 Version/10.50",
  "Opera/9.80 (Windows NT 6.1; U; zh-tw) Presto/2.7.62 Version/11.01",
  "Opera/9.80 (X11; Linux i686; U; Debian; pl) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (X11; Linux i686; U; de) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (X11; Linux i686; U; en) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (X11; Linux i686; U; en) Presto/2.5.27 Version/10.60",
  "Opera/9.80 (X11; Linux i686; U; en-GB) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (X11; Linux i686; U; en-GB) Presto/2.5.24 Version/10.53",
  "Opera/9.80 (X11; Linux i686; U; es-ES) Presto/2.6.30 Version/10.61",
  "Opera/9.80 (X11; Linux i686; U; fr) Presto/2.7.62 Version/11.01",
  "Opera/9.80 (X11; Linux i686; U; it) Presto/2.5.24 Version/10.54",
  "Opera/9.80 (X11; Linux i686; U; it) Presto/2.7.62 Version/11.00",
  "Opera/9.80 (X11; Linux i686; U; ja) Presto/2.7.62 Version/11.01",
  "Opera/9.80 (X11; Linux i686; U; nb) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (X11; Linux i686; U; pl) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (X11; Linux i686; U; pl) Presto/2.6.30 Version/10.61",
  "Opera/9.80 (X11; Linux i686; U; pt-BR) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (X11; Linux i686; U; ru) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (X11; Linux x86_64; U; Ubuntu/10.10 (maverick); pl) Presto/2.7.62 Version/11.01",
  "Opera/9.80 (X11; Linux x86_64; U; de) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (X11; Linux x86_64; U; en) Presto/2.2.15 Version/10.00",
  "Opera/9.80 (X11; Linux x86_64; U; en-GB) Presto/2.2.15 Version/10.01",
  "Opera/9.80 (X11; Linux x86_64; U; it) Presto/2.2.15 Version/10.10",
  "Opera/9.80 (X11; Linux x86_64; U; pl) Presto/2.7.62 Version/11.00",
  "Opera/9.80 (X11; U; Linux i686; en-US; rv:1.9.2.3) Presto/2.2.15 Version/10.10"
]

const main = (url, cookie = null) => {
  for (let i = 0; i < 10/*proxy_arr.length*/; ++i) {
    setInterval(() => {
      request.get({
        // proxy: proxy_arr[i],
        url: url.href,
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Referer': url.origin,
          'Origin': url.origin,
          'Cookie': cookie ? cookie : '',
          'User-Agent': ua_arr[Math.floor(Math.random() * ua_arr.length)]
        },
      }, (err, resp, body) => {
        ++requests
        if (resp && resp.statusCode === 200) {
          ++successful_req
          console.log(`${successful_req} successful of ${requests} total.`)
        }
      })
    }, 200)
  }
}

if (!process.argv[2]) console.log(`Usage of the program: ${process.argv[0]} ${process.argv[1]} URL cookie(optional)`)
else main(new URL(process.argv[2]), process.argv[3]) // node(0) requester.js(1) url_to_request(2) cookie(3)