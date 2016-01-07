Template.content.helpers({

    sprintsList: function () {
        var sprints = [];
        sprints = $.map(Sprints.find({
            users: Meteor.userId()
        }).fetch(), function (sprint, i) {
            return {name: sprint.name, tab: i, id: sprint._id};
        });
        return sprints;
    },

    starKind : function(){
        if (this.id === Meteor.user().profile.default_sprint){
            return "fa-star";
        } else {
            return "fa-star-o";
        }
    }
});


Template.content.events({

    'click i.fa.fa-pencil-square-o.pull-right' : function(event){
        event.preventDefault();
        $('.edit').editable('toggleDisabled');
    },

    'click i.fa.fa-star-o' : function(event){
        event.preventDefault();
        $('ul.treeview-menu > li > a.sprint > i').removeClass('fa-star-o');
        $('ul.treeview-menu > li > a.sprint > i').removeClass('fa-star');
        $('ul.treeview-menu > li > a.sprint > i').addClass('fa-star-o');
        $(event.target).removeClass('fa-star-o');
        $(event.target).addClass('fa-star');
        Meteor.call('updateDefaultSprint', this.id, function(err){
            if (err){
                alert(err);
            }
        });
    },

    'click .user-panel' : function(event){
        event.preventDefault();
        removeSlideBar();
        //Router.go('/profile/edit');
    },

    'click #new-sprint-btn': function (event, template) {
        event.preventDefault();
        removeSlideBar();
        Router.go('/sprints/new');
    },

    'click #invite-btn': function (event, template) {
        event.preventDefault();
        removeSlideBar();
        var sprint_id = null;
        if (!this.sprint){
            var sprints = Sprints.find({users : Meteor.userId()}).fetch();
            var sprint = sprints[0];
            sprint_id = sprint._id;
        } else {
            sprint_id = this.sprint._id;
        }
        Router.go('/sprints/' + sprint_id + '/invite');
    },

    'click .sprint': function (event, template) {
        event.preventDefault();
        if ($(event.target).hasClass('editable-open') || $(event.target).hasClass('fa-star') || $(event.target).hasClass('fa-star-o')){
            return;
        }

        removeSlideBar();
        var sprint_name = event.target.text
        if (!sprint_name)
            return;
        var sprint_id = event.target.id;
        Router.go('/sprints/' + sprint_id + '/stocks');
    },

    'click .content-wrapper': function(event) {
        var text = event.target.value;
        if (event.which !== 13) {
            removeSlideBar();
        }
    }

});

Template.content.onRendered(function () {
    removeSlideBar();
    // setting defaults for the editable
    $.fn.editable.defaults.mode = 'inline';
    $.fn.editable.defaults.showbuttons = false;
    $.fn.editable.defaults.url = '/post';
    $.fn.editable.defaults.type = 'text';

    // make all items having class 'edit' editable
    $('.edit').editable({
        escape : true,
        success: function(response, newValue) {
            var className = this.children[0].className;
            var sprint_id = this.id;
            var that = this;
            if (this.text !== newValue) {
                newValue = newValue.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                Meteor.call("updateSprintName", newValue, sprint_id, function (err) {
                    if (err) {
                        alert(err);
                    } else {
                        $("#" + that.id).text('');
                        var i = $('<i class="' + className + '">');
                        $("#" + that.id).append(i);
                        $('.edit').editable('toggleDisabled');
                    }
                });
            }
        }
    });

    $('.edit').editable('toggleDisabled');

});

function removeSlideBar(){
    $(".content-wrapper").removeClass('open');
}

