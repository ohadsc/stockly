Template.login.events({
    'submit .register': function(event) {
        event.preventDefault();
        var emailVar = event.target.email.value;
        var passwordVar = event.target.password.value;
        Accounts.createUser({
            email: emailVar,
            password: passwordVar
        },function(err){
            if (!err) {
                console.log('successful registration');
            }
        });

    }
});

Template.login.events({
    'submit .login': function(event) {
        event.preventDefault();
        var emailVar = event.target.email.value;
        var passwordVar = event.target.password.value;
        Meteor.loginWithPassword(emailVar, passwordVar, function(err){
            console.log(err);
        });
    }
});

