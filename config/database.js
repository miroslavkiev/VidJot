if (process.env.NODE_ENV === 'production'){
	module.exports = {
		mongoURI: 'mongodb://miroslav:miroslav25@ds219832.mlab.com:19832/vidjot-prod'
	}
} else {
	module.exports = {
		mongoURI: 'mongodb://localhost:27017/vidjot-dev'
	}
}