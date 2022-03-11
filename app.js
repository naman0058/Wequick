var createError = require('http-errors');
var cookieSession = require('cookie-session')

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var login = require('./routes/login');
var api = require('./routes/api')
var admin = require('./routes/Admin/Login');
var adminDashboard = require('./routes/Admin/Dashboard')
var vendor_registeration = require('./routes/Vendor/registeration')
var vendor_dashboard = require('./routes/Vendor/vendorDashboard');
var vendorLogin = require('./routes/Vendor/login');
var agentLogin = require('./routes/Agent/login');
var financeLogin = require('./routes/Finance/login');
var financeDashboard = require('./routes/Finance/Dashboard')


var agent_dashboard = require('./routes/Agent/agentDashboard');
var channel_partner_login = require('./routes/Channel_Partner/login');
var channel_partner_api = require('./routes/Channel_Partner/api');
var agent_api = require('./routes/Agent/api');


var banner = require('./routes/banner');
var repurchasingapi = require('./routes/repurchasing_api');
var talentHunt = require('./routes/talentHunt');

var repurchasingapi = require('./routes/repurchasing_api');
var htaccess = require('./routes/htaccess');

var mlm = require('./routes/mlm');
var shop_banner = require('./routes/shop_banner');
var channel_partner_dashboard = require('./routes/Channel_Partner/channelPartnerDashboard');

var merchant_api = require('./routes/Vendor/merchant_api');
var blogs = require('./routes/blogs');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));










app.use(cookieSession({
  name: 'session',
  keys: ['political-frames'],
 
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))




app.use('/login',login);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin',admin);
app.use('/admin/dashboard',adminDashboard);
app.use('/finance/dashboard',financeDashboard);

app.use('/api',api);
app.use('/vendor-registeration',vendor_registeration);
app.use('/vendor-dashboard',vendor_dashboard);
app.use('/vendor-login',vendorLogin);
app.use('/agent-login',agentLogin);
app.use('/finance-login',financeLogin);

app.use('/channel-partner-login',channel_partner_login);
app.use('/agent-dashboard',agent_dashboard);
app.use('/channel-partner-dashboard',channel_partner_dashboard);

app.use('/banner',banner);
app.use('/repurchasing-api',repurchasingapi);
app.use('/talent-hunt',talentHunt)
app.use('/.htaccess',htaccess);

app.use('/repurchasing-api',repurchasingapi);
app.use('/mlm',mlm);
app.use('/shop_banner',shop_banner);
app.use('/merchant-api',merchant_api);
app.use('/channe-partner-api',channel_partner_api);
app.use('/agent-api',agent_api)
app.use('/blogs',blogs);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
