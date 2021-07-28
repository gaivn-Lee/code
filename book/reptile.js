let axios = require('axios');
let cheerio = require('cheerio');
let mysql = require('mysql');

let options = {
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'book'
}

let connection = mysql.createConnection(options);

connection.connect((err, result) => {
	if (!err) {
		console.log('数据库连接成功');
	} else {
		console.log('数据库连接失败');
	}
});

let count =2;

async function getBooks(num) {
	let url = 'https://sobooks.cc/page/' + num;
	let res = await axios.get(url);
	
	let $ = cheerio.load(res.data);
	
	$('#cardslist .card-item .thumb-img > a').each((i, ele) => {
		let href = $(ele).attr('href');
		console.log(href);
		getBookInfo(href);
	});
}

async function getBookInfo(href) {
	let info = await axios.get(href);
	let $ = cheerio.load(info.data);
	
	let bookname = $('.bookinfo > ul > li:nth-child(1)').text().substring(3);
	let author = $('.bookinfo > ul > li:nth-child(2)').text().substring(3);
	let tag = $('.bookinfo > ul > li:nth-child(4)').text().substring(3);
	let posttime = $('.bookinfo > ul > li:nth-child(5)').text().substring(3);
	let score = $('.bookinfo > ul > li:nth-child(6) b').attr('class');
	score = score[score.length - 1];
	let category = $('#mute-category > a').text();
	let description = $('body > section > div.content-wrap > div > article > p:nth-child(3)').text();
	let authordesc = $('body > section > div.content-wrap > div > article > p:nth-child(7)').text();
	let bookimg = $('body > section > div.content-wrap > div > article > div.book-info > div.book-left > div > div.bookpic > img').attr('src');
	
	let insertSql = `insert into book (bookname, author, tag, posttime, score, category, description, authordesc, bookimg) values (?,?,?,?,?,?,?,?,?)`;
	let arr = [bookname, author, tag, posttime, score, category, description, authordesc, bookimg];
	connection.query(insertSql, arr, (err, result) => {
		if (err) {
			console.log(err);
		}
		console.log(result)
	})
}


let start = setInterval(() => {
	console.log('-----------------第'+count+'页-----------------');
	getBooks(count);
	count++;
	if (count > 331) {
		console.log('-----------------结束了-----------------');
		clearInterval(start);
	}
}, 10000);




