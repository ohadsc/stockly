/**
 * Created by ohad on 2015-12-27.
 */


Template.changePassword.events({

    'click button.btn.btn-primary.submit-button': function (event, template) {
        event.preventDefault();
        var newPassword = $("#new-password").val();
        var oldPassword = $("#current-password").val();
        var repeatPassword = $("#repeat-password").val();
        var passwordsEqual = repeatPassword === newPassword;
        if (newPassword && oldPassword && passwordsEqual) {
            Accounts.changePassword(oldPassword, newPassword, function (error) {
                if (!error){
                    Router.go('/');
                } else {
                    markError("Error");
                }
            });
        } else {
            markError("Error");
        }

    },

    'keyup #new-password': function(event) {
        var text = event.target.value;
        if (event.which !== 13) {
            removeError();
        }
    },

    'keyup #current-password': function(event) {
        var text = event.target.value;
        if (event.which !== 13) {
            removeError();
        }
    },

    'keyup #repeat-password': function(event) {
        var text = event.target.value;
        if (event.which !== 13) {
            removeError();
        }
    }
});


function markError(reason){
    $(".form-group").addClass('has-error');
    $(".form-group").addClass('has-feedback');
    $("#x-error-icon").show();
    $("#error-msg").show();
    $("#error-msg").text(reason);
}

function removeError(){
    $("#x-error-icon").hide();
    $("#error-msg").hide();
    $(".form-group").removeClass('has-error');
    $(".form-group").removeClass('has-feedback');
}