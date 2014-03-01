process.env.NODE_ENV = 'test';
// required modules/packages
var should = require('should');
var app = require("../app");
var request = require("supertest");
var agent = request.agent(app);
var mongoose = require('mongoose');
// Schemas
var  Team = mongoose.model('Team');
var Email_Template = mongoose.model('Email_Template');

// after the tests are done
after(function(done) {
	console.log('\nEmail_Template tests have finished');
	done();
});

describe('Email_Template', function() {
	var fly;
	var prep;
	var flyTeam;
	var prepTeam;
	beforeEach(function(done) {
		flyTeam = {
			name: "Flyers",
			sport: "Hockey"
		};
		prepTeam = {
			name: "Hawks",
			sport: "Hockey"
		};
		done();
	});

	after(function(done) {
		Email_Template.remove(done);
		Team.remove(done);
	});

	describe('#save()', function(done) {
		var fly_email;
		var prep_email_1;
		var prep_email_2;
		beforeEach(function(done) {
			fly = new Team(flyTeam);
			fly.save(function(err, fly_saved) {
				prep = new Team(prepTeam);
				prep.save(function(err, prep_saved) {
					fly_recipients = ["a@example.com", "b@example.com"];
					fly_email = new Email_Template({'team_id': fly_saved._id, 'subject': 'template test', 'body': 'The eody of the email', 'recipients': fly_recipients});
					fly_email.save(function(err, fm_saved) {
						pe1_recipients = ["c@example.com", "d@example.com"];
						prep_email_1 = new Email_Template({'team_id': prep_saved._id, 'subject': 'test', 'body': 'another test', 'recipients': pe1_recipients});
						prep_email_1.save(function(err, pe1_saved) {
							pe2_recipients = ["c@example.com"];
							prep_email_2 = new Email_Template({'team_id': prep_saved._id, 'subject': 'test2', 'body': 'test subj', 'recipients': pe2_recipients});
							prep_email_2.save(done);
						});
					});
				});
			});
		});
		// 'it' tests
		it('should save properly for the above emails with all required fields in place', function(done) {
			fly_email.should.have.property('subject', 'template test');
			prep_email_1.should.have.property('subject', 'test');
			prep_email_2.should.have.property('subject', 'test2');
			done();
		});
		// allowed to not have a subject
		it('should allow email templates to not have a subject', function(done) {
			var no_subj = new Email_Template({'team_id': prep._id, 'body': 'nosubj', 'recipients': ["ab@cd.com"]});
			no_subj.save(function(err, no_subj_saved) {
				should.not.exist(err);
				no_subj_saved.should.have.property('body', 'nosubj');
				done();
			});
		});
		// not allowed to not have a team_id
		it('should not allow an email template to be created without a team id', function(done) {
			var no_team = new Email_Template({'body': 'body', 'subject': 'a subject', 'recipients': ["ab@cd.com"]});
			no_team.save(function(err, returned) {
				err.should.be.ok;
				done();
			});
		});
		// needs to have a body
		it('should not allow an email template to be created without a body', function(done) {
			var no_body = new Email_Template({'team_id': prep._id, 'subject': 'subject', 'recipients': ["ab@cd.com"]});
			no_body.save(function(err, returned) {
				err.should.be.ok;
				done();
			});
		});
		// needs to have recepiants
		it('should not allow an email template to be created without recepiants', function(done) {
			var no_recep = new Email_Template({'team_id': prep._id, 'subject': 'subject', 'body': 'body'});
			no_recep.save(function(err, returned) {
				err.should.be.ok;
				done();
			});
		});
	});


});