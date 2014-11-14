Parse.Cloud.afterSave('credits', function(request) {

	var AccountLog = Parse.Object.extend('account_log');

	var addedCredit = request.object;
	var newAccountLog = new AccountLog();

	query = new Parse.Query('credit_lines');

	var creditLines = query.equalTo('credit', addedCredit.id);
	
	console.log("Getting credit lines of credit number: " + addedCredit.id);

	creditLines.find({
		success: function(linesList) {

			var amount = 0;
			console.log("linesList: " + linesList);


			for (var i = 0; i < linesList.length; i++) {
				console.log("CreditLine: " + linesList[i]);
				amount += (linesList[i].get('quantity')*linesList[i].get('price'));
			};

			newAccountLog.set('credit', addedCredit);
			newAccountLog.set('client', addedCredit.get('client'));
			newAccountLog.set('transaction_kind', 'credit');
			newAccountLog.set('amount', amount);

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
	newAccountLog.set('transaction_kind', 'debits');
	newAccountLog.set('amount', addedDebits.get('amount'));

	newAccountLog.save();

});