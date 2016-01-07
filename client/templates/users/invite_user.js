Template.inviteUser.helpers({
    usernames: function() {
        var output = Meteor.users.find({_id: {$ne: Meteor.userId()}}).fetch().map(function(user){
            return user.profile ? user.profile.username : undefined;
        });
        return output.filter(function(n){ return !!n });
    }
});

Template.inviteUser.onRendered(function () {
    $("#x-error-icon").hide();
    $("#error-msg").hide();
    Meteor.typeahead.inject();
});

Template.inviteUser.events({
    'click .btn.btn-default': function (event, template) {
        event.preventDefault();
        var sprint_id = this.sprint._id;
        var username = $('#user_name').val();
        username = username.replace(/\s+/g, '');

        Meteor.call('addUserToSprint', username, sprint_id, function(err){
            if (err) {
                $(".form-group").addClass('has-error');
                $(".form-group").addClass('has-feedback');
                $("#x-error-icon").show();
                $("#error-msg").show();
                $("#error-msg").text(err.reason);
            } else {
                Router.go('/sprints/' + sprint_id + '/stocks');
            }
        });

    },

    'keyup #user_name': function(event) {
        var text = event.target.value;
        if (event.which !== 13) {
            $(".form-group").removeClass('has-error');
            $(".form-group").removeClass('has-feedback');
            $("#x-error-icon").hide();
            $("#error-msg").hide();
        }
    }
});


