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


async function getResume(page) {
	axios({
		url: 'https://api.apiopen.top/getJoke',
		method: 'get',
		params: {
			page: 1,
			count: 20
		},
	}).then((res) => {
		console.log(res)
	});
	
	// console.log(res.data);
}

getResume();




