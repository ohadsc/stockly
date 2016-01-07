Template.updateUsername.events({
    'submit .update-username': function(event) {
        event.preventDefault();
        var userId = Meteor.userId();
        var username = $(event.target).find('[name=username]').val();
        username = username.trim();
        if (username.indexOf(' ') >= 0){
            markError("Error");
        } else {
            Meteor.call('initUserAndSprint', username, function (err) {
                if (err) {
                    markError(err.reason);
                } else {
                    Router.go('/');
                }
            });
        }

    },

    'keyup #username-text': function(event) {
        if (event.which !== 13) {
            $("#x-error-icon").hide();
            $("#error-msg").hide();
            $(".form-group").removeClass('has-error');
            $(".form-group").removeClass('has-feedback');
        }
    },
});


Template.updateUsername.onRendered(function () {
    $("#x-error-icon").hide();
    $("#error-msg").hide();
});

function markError(msg){
    $(".form-group").addClass('has-error');
    $(".form-group").addClass('has-feedback');
    $("#x-error-icon").show();
    $("#error-msg").show();
    $("#error-msg").text(msg);
}