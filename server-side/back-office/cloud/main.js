var balance = 0;

Parse.Cloud.afterSave('credits', function(request) {

	var AccountLog = Parse.Object.extend('account_log');
	var CreditLine = Parse.Object.extend('credit_lines');

	var addedCredit = request.object;
	var newAccountLog = new AccountLog();

	var query = new Parse.Query(CreditLine);
	query.equalTo('credit', addedCredit);
	query.find({
		success: function(linesList) {
			newAccountLog.set('credit', addedCredit);
			newAccountLog.set('client', addedCredit.get('client'));
			newAccountLog.set('transaction_kind', 'credit');
			newAccountLog.set('amount', addedCredit.get('amount'));
			newAccountLog.save();
		},
		error: function() {
			return false;
		}
	});
});

Parse.Cloud.afterSave('debits', function(request) {
	var AccountLog = Parse.Object.extend('account_log');
	var addedDebits = request.object;
	var newAccountLog = new AccountLog();

	newAccountLog.set('debit', addedDebits);
	newAccountLog.set('client', addedDebits.get('client'));
	newAccountLog.set('transaction_kind', 'debit');
	newAccountLog.set('amount', addedDebits.get('amount'));
	
	newAccountLog.set('isRefund', addedDebits.get('isRefund'));
	newAccountLog.set('detail', addedDebits.get('detail'));

	newAccountLog.save();

	var currentClient = addedDebits.get('client');
	currentClient.set('lastCollectDate', (new Date()));
	currentClient.save();
});

Parse.Cloud.define('getClientBalance', function(request, response) {

	var client = getClient(request.params.clientID);
	getTransactions(responseClient, response);
	
});

Parse.Cloud.define('getClient', function(request, response) {

	var client = getClient(request.clientID);
	response.success(client);
	
});


var getClient = function(clientID, response) {
	var client = {};
	var query = new Parse.Query(Client);
	query.get(clientID, {
		success: function(responseClient) {
			client = responseClient;
		},
		error: function(object, error) {
			console.log('Ocurrió un error obteniendo cliente actual, con el codigo de error: ' + error.message);
		}
	}).then(function() {
		return client;
	});
};

var getTransactions = function(cliente, response) {
	
	var Log = Parse.Object.extend('account_log');
	var query = new Parse.Query(Log);

	query.ascending("createdAt");
	query.include("client");
	query.include("debit");
	query.include("credit");
	query.include("createdAt");
	query.equalTo("client", cliente);
	query.find({
		success: function(logs) {
			var transactions = logs;
			for (var i = 0; i < logs.length; i++) {
				if(logs[i].get('transaction_kind') === 'credit') {
					getCreditLinesFor(logs[i].get('credit'));
				}else{
					balance += logs[i].get('amount');
				}
			};
		},
		error: function() {
			console.log('Error getting the transaction logs');
		}
	});
};

var getCreditLinesFor = function(credit) {
	var Lines = Parse.Object.extend('credit_lines');
	var query = new Parse.Query(Lines);
	query.equalTo('credit', credit);
	query.find({
		success: function(lines) {
			var amount = 0;
			for (var i = 0; i < lines.length; i++) {
				amount += (lines[i].get('quantity')*lines[i].get('price'));
			};
			// console.log(amount*-1);
			balance -= amount;
		},
		error: function() {
			console.log('Error getting the transaction logs');
		}
	});
};